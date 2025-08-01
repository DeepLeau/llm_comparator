import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { decrypt } from "@/lib/encryption"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Verify the user with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Fetch user's custom models with all necessary fields
    const { data: models, error: modelsError } = await supabase
      .from("custom_models")
      .select(`
        id,
        name,
        api_endpoint,
        model_format,
        auth_type,
        custom_header_key,
        model_name,
        api_key_encrypted,
        api_key_iv,
        api_key_tag,
        encryption_version,
        is_active,
        created_at,
        updated_at
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (modelsError) {
      console.error("Database error:", modelsError)
      return NextResponse.json({ success: false, error: "Failed to fetch models" }, { status: 500 })
    }

    // Process models to mask API keys and decrypt if needed
    const processedModels =
      models?.map((model) => {
        let maskedApiKey = "No API key"

        if (model.auth_type !== "None" && model.api_key_encrypted) {
          try {
            console.log(`Decrypting API key for model ${model.id}, version: ${model.encryption_version}`)

            // Use the correct encrypted fields with individual parameters
            const decryptedKey = decrypt(
              model.api_key_encrypted,
              model.api_key_iv,
              model.api_key_tag,
              model.encryption_version || 1, // Default to version 1 if null
            )

            // Mask the API key (show first 4 and last 4 characters)
            if (decryptedKey && decryptedKey.length > 8) {
              maskedApiKey = `${decryptedKey.slice(0, 4)}...${decryptedKey.slice(-4)}`
            } else if (decryptedKey) {
              maskedApiKey = "***"
            }
          } catch (error) {
            console.error(`Failed to decrypt API key for model ${model.id}:`, error)
            maskedApiKey = "Encrypted"
          }
        }

        return {
          id: model.id,
          name: model.name,
          provider: model.model_format || "Custom",
          base_url: model.api_endpoint,
          model_format: model.model_format,
          auth_type: model.auth_type,
          model_name: model.model_name,
          masked_api_key: maskedApiKey,
          is_active: model.is_active,
          created_at: model.created_at,
          updated_at: model.updated_at,
        }
      }) || []

    return NextResponse.json({ success: true, models: processedModels })
  } catch (error) {
    console.error("Error fetching user models:", error)
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
