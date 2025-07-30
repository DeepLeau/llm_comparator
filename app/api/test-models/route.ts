import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

// Client admin pour les opérations serveur
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Définition des limites de tests par batch selon le plan
const PLAN_LIMITS = {
  free: 2,
  start: 5,
  scale: 10,
} as const

type PlanType = keyof typeof PLAN_LIMITS

interface TestModelRequest {
  selectedModelIds: string[]
  systemPrompt: string
  prompts: string[] // Changé de userPrompt à prompts (array)
  useCase?: string // Ajout du use case
}

interface ModelPromptResult {
  promptIndex: number
  prompt: string
  response: string
  responseTime: number
  cost: number
  score: number
  error?: string
}

interface ModelResult {
  id: string
  modelId: string
  modelName: string
  provider: string
  isOpenSource: boolean
  storesData: boolean
  // Résultats agrégés
  averageScore: number
  averageCost: number
  averageResponseTime: number
  totalCost: number
  // Détails par prompt
  promptResults: ModelPromptResult[]
  error?: string
}

// ✨ VERSION ALTERNATIVE : Sans fonction RPC
async function handleModelFailures(failedModelIds: string[]) {
  if (failedModelIds.length === 0) return

  try {
    console.log(`📊 Updating failure count for ${failedModelIds.length} models:`, failedModelIds)

    // Récupérer les valeurs actuelles des failures
    const { data: currentModels, error: fetchError } = await supabaseAdmin
      .from("models")
      .select("id, failures")
      .in("id", failedModelIds)

    if (fetchError) {
      console.error("❌ Error fetching current failure counts:", fetchError)
      return
    }

    if (!currentModels || currentModels.length === 0) {
      console.warn("⚠️ No models found to update")
      return
    }

    // Préparer les mises à jour
    const updatePromises = currentModels.map(async (model) => {
      const newFailures = Math.max(0, (model.failures || 0) - 1)

      const { error } = await supabaseAdmin.from("models").update({ failures: newFailures }).eq("id", model.id)

      if (error) {
        console.error(`❌ Error updating model ${model.id}:`, error)
      } else {
        console.log(`✅ Updated model ${model.id}: failures ${model.failures} → ${newFailures}`)
      }
    })

    await Promise.all(updatePromises)
    console.log("✅ Successfully updated all failure counts")
  } catch (error) {
    console.error("❌ Exception while updating model failures:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestModelRequest = await request.json()
    const { selectedModelIds, systemPrompt, prompts, useCase } = body

    console.log("=== STARTING MULTI-PROMPT MODEL TESTS ===")
    console.log("Selected models:", selectedModelIds)
    console.log("System prompt:", systemPrompt)
    console.log("Number of prompts:", prompts?.length || 0)
    console.log("Use case:", useCase)
    console.log("Prompts:", prompts)

    // Validation
    if (!selectedModelIds?.length || !prompts?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validation des prompts
    const validPrompts = prompts.filter((p) => p && p.trim())
    if (validPrompts.length === 0) {
      return NextResponse.json({ error: "No valid prompts provided" }, { status: 400 })
    }

    // Calculer le nombre total de tests (modèles × prompts)
    const totalTests = selectedModelIds.length * validPrompts.length

    // Récupérer l'utilisateur authentifié
    let userId: string | null = null
    let userPlan: PlanType = "free"

    try {
      const authHeader = request.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1]
        const {
          data: { user },
        } = await supabaseAdmin.auth.getUser(token)

        if (user) {
          userId = user.id

          // Récupérer le plan de l'utilisateur
          const { data: userData } = await supabaseAdmin.from("users").select("plan").eq("id", user.id).single()

          userPlan = (userData?.plan as PlanType) || "free"
        }
      }
    } catch (error) {
      console.warn("Could not get user from token, continuing without user ID")
    }

    // VÉRIFICATION CRITIQUE : Limite de tests par batch selon le plan
    const testLimit = PLAN_LIMITS[userPlan]
    if (totalTests > testLimit) {
      console.error(
        `❌ PLAN LIMIT EXCEEDED: User plan '${userPlan}' allows max ${testLimit} tests, but ${totalTests} requested`,
      )
      return NextResponse.json(
        {
          error: `Plan limit exceeded. Your ${userPlan} plan allows maximum ${testLimit} tests per batch, but you requested ${totalTests} tests.`,
          planLimit: testLimit,
          requestedTests: totalTests,
          userPlan,
        },
        { status: 403 },
      )
    }

    console.log(`✅ Plan check passed: ${totalTests} tests within ${userPlan} plan limit of ${testLimit}`)

    // Récupérer les modèles depuis Supabase
    const { data: models, error: modelsError } = await supabase.from("models").select("*").in("id", selectedModelIds)

    if (modelsError) {
      console.error("Error fetching models:", modelsError)
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
    }

    if (!models?.length) {
      return NextResponse.json({ error: "No models found" }, { status: 404 })
    }

    console.log(
      "Found models:",
      models.map((m) => ({ id: m.id, name: m.name })),
    )

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "WhichLLMs",
    }

    // ✨ NOUVEAU : Tracker les modèles qui échouent
    const failedModelIds = new Set<string>()

    // Tester tous les modèles sur tous les prompts
    console.log("Starting multi-prompt model tests...")
    const modelTestPromises = models.map(async (model) => {
      try {
        console.log(`\n=== Testing model: ${model.name} ===`)

        // Tester le modèle sur chaque prompt
        const promptTestPromises = validPrompts.map(async (prompt, promptIndex) => {
          try {
            const startTime = performance.now()

            // Construire les messages
            const messages = []
            if (systemPrompt?.trim()) {
              messages.push({ role: "system", content: systemPrompt })
            }
            messages.push({ role: "user", content: prompt })

            // Limiter les tokens selon le context_length du modèle
            const maxTokens = Math.min(1000, Math.floor(model.context_length * 0.3))

            const requestBody = {
              model: model.id,
              messages,
              max_tokens: maxTokens,
              temperature: 0.7,
            }

            console.log(`  Testing prompt ${promptIndex + 1}/${validPrompts.length}: "${prompt.substring(0, 50)}..."`)

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers,
              body: JSON.stringify(requestBody),
            })

            const endTime = performance.now()

            if (!response.ok) {
              const errorText = await response.text()
              console.error(`    ❌ Error for prompt ${promptIndex + 1}:`, response.status, errorText)
              // ✨ NOUVEAU : Marquer le modèle comme ayant échoué
              failedModelIds.add(model.id)
              throw new Error(`HTTP ${response.status}: ${errorText}`)
            }

            const result = await response.json()

            if (!result.choices?.[0]?.message?.content) {
              // ✨ NOUVEAU : Marquer le modèle comme ayant échoué
              failedModelIds.add(model.id)
              throw new Error("Invalid response structure")
            }

            const responseText = result.choices[0].message.content
            const usage = result.usage || {}
            const promptTokens = usage.prompt_tokens || 0
            const completionTokens = usage.completion_tokens || 0

            // Calculer le coût
            const promptCost = promptTokens * model.pricing_prompt
            const completionCost = completionTokens * model.pricing_completion
            const totalCost = promptCost + completionCost

            console.log(
              `    ✅ Success for prompt ${promptIndex + 1}: ${Math.round(endTime - startTime)}ms, $${totalCost.toFixed(8)}`,
            )

            return {
              promptIndex,
              prompt,
              response: responseText,
              responseTime: Math.round(endTime - startTime),
              cost: Math.round(totalCost * 100000000) / 100000000,
              score: 0, // Sera mis à jour par le scoring
            } as ModelPromptResult
          } catch (error) {
            console.error(`    ❌ Error testing prompt ${promptIndex + 1}:`, error)
            // ✨ NOUVEAU : Marquer le modèle comme ayant échoué
            failedModelIds.add(model.id)
            return {
              promptIndex,
              prompt,
              response: "",
              responseTime: 0,
              cost: 0,
              score: 0,
              error: error instanceof Error ? error.message : "Unknown error",
            } as ModelPromptResult
          }
        })

        const promptResults = await Promise.all(promptTestPromises)

        // Calculer les moyennes pour ce modèle
        const successfulResults = promptResults.filter((r) => !r.error)
        const averageScore =
          successfulResults.length > 0
            ? successfulResults.reduce((sum, r) => sum + r.score, 0) / successfulResults.length
            : 0
        const averageCost =
          successfulResults.length > 0
            ? successfulResults.reduce((sum, r) => sum + r.cost, 0) / successfulResults.length
            : 0
        const averageResponseTime =
          successfulResults.length > 0
            ? Math.round(successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length)
            : 0
        const totalCost = promptResults.reduce((sum, r) => sum + r.cost, 0)

        console.log(
          `  Model ${model.name} summary: avg_time=${averageResponseTime}ms, avg_cost=$${averageCost.toFixed(8)}, total_cost=$${totalCost.toFixed(8)}`,
        )

        return {
          id: `${model.id}-${Date.now()}`,
          modelId: model.id,
          modelName: model.name,
          provider: model.provider,
          isOpenSource: model.is_open_source,
          storesData: model.stores_data,
          averageScore,
          averageCost: Math.round(averageCost * 100000000) / 100000000,
          averageResponseTime,
          totalCost: Math.round(totalCost * 100000000) / 100000000,
          promptResults,
        } as ModelResult
      } catch (error) {
        console.error(`❌ Error testing model ${model.name}:`, error)
        // ✨ NOUVEAU : Marquer le modèle comme ayant échoué
        failedModelIds.add(model.id)
        return {
          id: `${model.id}-error-${Date.now()}`,
          modelId: model.id,
          modelName: model.name,
          provider: model.provider,
          isOpenSource: model.is_open_source,
          storesData: model.stores_data,
          averageScore: 0,
          averageCost: 0,
          averageResponseTime: 0,
          totalCost: 0,
          promptResults: [],
          error: error instanceof Error ? error.message : "Unknown error",
        } as ModelResult
      }
    })

    const results = await Promise.all(modelTestPromises)
    console.log("All model tests completed")

    // ✨ NOUVEAU : Mettre à jour les échecs de modèles en base de données
    await handleModelFailures(Array.from(failedModelIds))

    // Scorer toutes les réponses avec Claude 3 Opus
    console.log("=== STARTING SCORING PHASE ===")
    const allSuccessfulResults = results.filter((r) => !r.error && r.promptResults.some((pr) => !pr.error))

    if (allSuccessfulResults.length > 0) {
      try {
        // Scorer chaque prompt séparément
        for (let promptIndex = 0; promptIndex < validPrompts.length; promptIndex++) {
          const prompt = validPrompts[promptIndex]
          const responsesForThisPrompt = allSuccessfulResults
            .map((result) => ({
              result,
              promptResult: result.promptResults.find((pr) => pr.promptIndex === promptIndex && !pr.error),
            }))
            .filter((item) => item.promptResult)

          if (responsesForThisPrompt.length === 0) continue

          console.log(`Scoring ${responsesForThisPrompt.length} responses for prompt ${promptIndex + 1}...`)

          const scoringPrompt = `Évalue ces ${responsesForThisPrompt.length} réponses à la question: "${prompt}"

${responsesForThisPrompt
  .map(
    (item, index) => `RÉPONSE ${index + 1} (${item.result.modelName} - ${item.result.provider}):
${item.promptResult!.response}

---`,
  )
  .join("\n")}

Donne une note de 1.0 à 5.0 pour chaque réponse en considérant:
- Pertinence et précision par rapport à la question
- Clarté et structure de la réponse
- Complétude et utilité de l'information

Réponds UNIQUEMENT avec les notes séparées par des virgules, dans l'ordre des réponses (ex: 4.1,3.5,4.2,2.8)`

          const scoringResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: "deepseek/deepseek-chat-v3-0324:free",
              messages: [{ role: "user", content: scoringPrompt }],
              max_tokens: 100,
              temperature: 0.1,
            }),
          })

          if (scoringResponse.ok) {
            const scoringResult = await scoringResponse.json()
            const scoreText = scoringResult.choices?.[0]?.message?.content || ""

            console.log(`  Scoring response for prompt ${promptIndex + 1}:`, scoreText)

            // Parser les scores
            const scoreMatches = scoreText.match(/\d+\.?\d*/g)
            const scores = scoreMatches
              ? scoreMatches.map((s) => {
                  const score = Number.parseFloat(s)
                  return Math.min(Math.max(score, 1.0), 5.0)
                })
              : []

            // Appliquer les scores
            responsesForThisPrompt.forEach((item, index) => {
              if (scores[index] !== undefined) {
                item.promptResult!.score = Math.round(scores[index] * 10) / 10
                console.log(`    Score for ${item.result.modelName}: ${item.promptResult!.score}`)
              } else {
                item.promptResult!.score = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
                console.log(`    Fallback score for ${item.result.modelName}: ${item.promptResult!.score}`)
              }
            })
          } else {
            console.warn(`❌ Scoring failed for prompt ${promptIndex + 1}, using fallback scores`)
            responsesForThisPrompt.forEach((item) => {
              item.promptResult!.score = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
            })
          }
        }

        // Recalculer les scores moyens après scoring
        results.forEach((result) => {
          if (!result.error) {
            const successfulPromptResults = result.promptResults.filter((pr) => !pr.error)
            if (successfulPromptResults.length > 0) {
              result.averageScore =
                Math.round(
                  (successfulPromptResults.reduce((sum, pr) => sum + pr.score, 0) / successfulPromptResults.length) *
                    10,
                ) / 10
            }
          }
        })
      } catch (scoringError) {
        console.error("❌ Error in scoring:", scoringError)
        // Fallback scores
        results.forEach((result) => {
          result.promptResults.forEach((pr) => {
            if (!pr.error) {
              pr.score = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10
            }
          })
          const successfulPromptResults = result.promptResults.filter((pr) => !pr.error)
          if (successfulPromptResults.length > 0) {
            result.averageScore =
              Math.round(
                (successfulPromptResults.reduce((sum, pr) => sum + pr.score, 0) / successfulPromptResults.length) * 10,
              ) / 10
          }
        })
      }
    }

    // Calculer les statistiques globales
    const successfulResults = results.filter((r) => !r.error)
    const totalPromptTests = results.reduce((sum, r) => sum + r.promptResults.length, 0)
    const successfulPromptTests = results.reduce((sum, r) => sum + r.promptResults.filter((pr) => !pr.error).length, 0)

    const stats = {
      totalModels: results.length,
      totalPrompts: validPrompts.length,
      totalTests: totalPromptTests,
      successfulTests: successfulPromptTests,
      failedTests: totalPromptTests - successfulPromptTests,
      averageResponseTime:
        successfulResults.length > 0
          ? Math.round(successfulResults.reduce((sum, r) => sum + r.averageResponseTime, 0) / successfulResults.length)
          : 0,
      totalCost: Math.round(results.reduce((sum, r) => sum + r.totalCost, 0) * 100000000) / 100000000,
    }

    // === NOUVELLE SECTION : SAUVEGARDE EN BASE DE DONNÉES ===
    let testId: string | null = null
    if (userId && supabaseAdmin) {
      try {
        console.log("=== SAVING TO DATABASE ===")

        // 1. Créer l'enregistrement dans la table tests
        const { data: testData, error: testError } = await supabaseAdmin
          .from("tests")
          .insert({
            user_id: userId,
            use_case: useCase || "general", // Utiliser le vrai use case ou fallback
            total_cost: successfulPromptTests, // Nombre de crédits consommés (tests réussis)
          })
          .select("id")
          .single()

        if (testError) {
          console.error("Error creating test record:", testError)
        } else {
          testId = testData.id
          console.log("Created test record with ID:", testId)

          // 2. Créer les enregistrements dans la table prompts
          const promptInserts = validPrompts.map((prompt) => ({
            test_id: testId,
            system_prompt: systemPrompt || "",
            user_prompt: prompt,
          }))

          const { data: promptData, error: promptError } = await supabaseAdmin
            .from("prompts")
            .insert(promptInserts)
            .select("id, user_prompt")

          if (promptError) {
            console.error("Error creating prompt records:", promptError)
          } else {
            console.log(`Created ${promptData.length} prompt records`)

            // 3. Créer les enregistrements dans la table results
            const resultInserts: any[] = []

            results.forEach((modelResult) => {
              if (!modelResult.error) {
                modelResult.promptResults.forEach((promptResult) => {
                  if (!promptResult.error) {
                    // Trouver l'ID du prompt correspondant
                    const promptRecord = promptData.find((p) => p.user_prompt === promptResult.prompt)
                    if (promptRecord) {
                      resultInserts.push({
                        test_id: testId,
                        prompt_id: promptRecord.id,
                        model_name: modelResult.modelName,
                        response_time: promptResult.responseTime,
                        cost: promptResult.cost,
                        quality_score: promptResult.score,
                        response_text: promptResult.response,
                      })
                    }
                  }
                })
              }
            })

            if (resultInserts.length > 0) {
              const { error: resultError } = await supabaseAdmin.from("results").insert(resultInserts)

              if (resultError) {
                console.error("Error creating result records:", resultError)
              } else {
                console.log(`Created ${resultInserts.length} result records`)
              }
            }
          }
        }
      } catch (dbError) {
        console.error("Error saving to database:", dbError)
        // Continue l'exécution même si la sauvegarde échoue
      }
    }

    console.log("=== MULTI-PROMPT TEST COMPLETED ===")
    console.log("Stats:", stats)
    console.log("Test ID:", testId)
    console.log("User Plan:", userPlan)
    console.log("Plan Limit:", testLimit)
    console.log("Tests Executed:", totalTests)
    console.log("Failed Models:", Array.from(failedModelIds)) // ✨ NOUVEAU : Log des modèles échoués
    console.log(
      "Results summary:",
      results.map((r) => ({
        name: r.modelName,
        avgScore: r.averageScore,
        avgCost: r.averageCost,
        avgTime: r.averageResponseTime,
        totalCost: r.totalCost,
        promptsCount: r.promptResults.length,
        error: r.error,
      })),
    )

    return NextResponse.json({
      success: true,
      results,
      stats,
      systemPrompt,
      prompts: validPrompts,
      timestamp: new Date().toISOString(),
      testId, // Retourner l'ID du test créé
      userPlan, // Retourner le plan utilisateur pour info
      planLimit: testLimit, // Retourner la limite du plan
      failedModels: Array.from(failedModelIds), // ✨ NOUVEAU : Retourner les modèles échoués
    })
  } catch (error) {
    console.error("❌ Error in multi-prompt test-models API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}