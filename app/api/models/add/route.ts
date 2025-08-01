import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { encrypt } from "@/lib/encryption"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const addModelSchema = z.object({
  name: z.string().min(1, "Model name is required").max(100, "Model name too long"),
  apiEndpoint: z.string().url("Valid API endpoint URL is required"),
  authType: z.enum(["Bearer", "Basic", "Custom Header", "None"]),
  apiKey: z.string().optional(),
  customHeaderKey: z.string().optional(),
  modelFormat: z.enum(["OpenAI-compatible", "HuggingFace", "Custom"]),
  testPrompt: z.string().min(1).default("Hello"),
  modelName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the user with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = addModelSchema.parse(body)

    console.log("Adding custom model for user:", user.id)

    // Check if model name already exists for this user
    const { data: existingModel } = await supabase
      .from("custom_models")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", validatedData.name)
      .single()

    if (existingModel) {
      return NextResponse.json(
        {
          success: false,
          error: "A model with this name already exists",
        },
        { status: 400 },
      )
    }

    // Prepare the model data
    let encryptedApiKey = null
    let apiKeyIv = null
    let apiKeyTag = null

    // Encrypt API key if provided
    if (validatedData.apiKey && validatedData.authType !== "None") {
      try {
        console.log("Encrypting API key...")
        const encrypted = encrypt(validatedData.apiKey)
        encryptedApiKey = encrypted.encryptedData
        apiKeyIv = encrypted.iv
        apiKeyTag = encrypted.tag
        console.log("API key encrypted successfully")
      } catch (error) {
        console.error("Encryption failed:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to encrypt API key",
            details: error instanceof Error ? error.message : "Unknown encryption error",
          },
          { status: 500 },
        )
      }
    }

    // For HuggingFace models, ensure the model name has the correct suffix
    let finalModelName = validatedData.modelName
    if (
      validatedData.modelFormat === "HuggingFace" &&
      validatedData.apiEndpoint.includes("router.huggingface.co") &&
      finalModelName
    ) {
      if (!finalModelName.includes(":featherless-ai")) {
        finalModelName = `${finalModelName}:featherless-ai`
      }
    }

    // Insert the model into the database
    const { data: newModel, error: insertError } = await supabase
      .from("custom_models")
      .insert({
        user_id: user.id,
        name: validatedData.name,
        api_endpoint: validatedData.apiEndpoint,
        auth_type: validatedData.authType,
        api_key_encrypted: encryptedApiKey,
        api_key_iv: apiKeyIv,
        api_key_tag: apiKeyTag,
        custom_header_key: validatedData.customHeaderKey,
        model_format: validatedData.modelFormat,
        model_name: finalModelName,
        test_prompt: validatedData.testPrompt,
        is_active: true,
        encryption_version: 1,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting model:", insertError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save model to database",
          details: insertError.message,
        },
        { status: 500 },
      )
    }

    console.log("Successfully added custom model:", newModel.id)

    return NextResponse.json({
      success: true,
      model: {
        id: newModel.id,
        name: newModel.name,
        modelFormat: newModel.model_format,
        modelName: newModel.model_name,
        apiEndpoint: newModel.api_endpoint,
        authType: newModel.auth_type,
        isActive: newModel.is_active,
        createdAt: newModel.created_at,
      },
    })
  } catch (error) {
    console.error("Error in add model API:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
