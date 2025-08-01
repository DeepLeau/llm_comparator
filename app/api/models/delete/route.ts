import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

    const { modelId } = await request.json()

    if (!modelId) {
      return NextResponse.json({ error: "Model ID is required" }, { status: 400 })
    }

    // First, verify the model belongs to the user
    const { data: model, error: fetchError } = await supabase
      .from("custom_models")
      .select("id, user_id")
      .eq("id", modelId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !model) {
      return NextResponse.json({ error: "Model not found or access denied" }, { status: 404 })
    }

    // Delete the model
    const { error: deleteError } = await supabase
      .from("custom_models")
      .delete()
      .eq("id", modelId)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("Database error:", deleteError)
      return NextResponse.json({ error: "Failed to delete model" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Model deleted successfully" })
  } catch (error) {
    console.error("Error deleting model:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
