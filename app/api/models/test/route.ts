import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const testModelSchema = z.object({
  apiEndpoint: z.string().url("Valid API endpoint URL is required"),
  authType: z.enum(["Bearer", "Basic", "Custom Header", "None"]),
  apiKey: z.string().optional(),
  customHeaderKey: z.string().optional(),
  modelFormat: z.enum(["OpenAI-compatible", "HuggingFace", "Custom"]),
  testPrompt: z.string().min(1, "Test prompt is required"),
  modelName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received request body:", body)

    // Validate the request body
    const validationResult = testModelSchema.safeParse(body)

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.errors)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const data = validationResult.data

    console.log("Testing model connection:", {
      endpoint: data.apiEndpoint,
      format: data.modelFormat,
      authType: data.authType,
      modelName: data.modelName,
    })

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    // Add authentication headers
    if (data.authType === "Bearer" && data.apiKey) {
      headers["Authorization"] = `Bearer ${data.apiKey}`
    } else if (data.authType === "Basic" && data.apiKey) {
      const encoded = Buffer.from(data.apiKey).toString("base64")
      headers["Authorization"] = `Basic ${encoded}`
    } else if (data.authType === "Custom Header" && data.apiKey && data.customHeaderKey) {
      headers[data.customHeaderKey] = data.apiKey
    }

    // Prepare request body based on format
    let requestBody: any

    if (data.modelFormat === "OpenAI-compatible") {
      requestBody = {
        model: data.modelName || "gpt-3.5-turbo",
        messages: [{ role: "user", content: data.testPrompt }],
        max_tokens: 100,
        temperature: 0.7,
      }
    } else if (data.modelFormat === "HuggingFace") {
      // For HuggingFace Router, add :featherless-ai suffix if not present
      let modelName = data.modelName || "meta-llama/Llama-3.1-8B-Instruct"
      if (data.apiEndpoint.includes("router.huggingface.co") && !modelName.includes(":featherless-ai")) {
        modelName = `${modelName}:featherless-ai`
      }

      requestBody = {
        model: modelName,
        messages: [{ role: "user", content: data.testPrompt }],
        max_tokens: 100,
        temperature: 0.7,
      }
    } else if (data.modelFormat === "Custom") {
      requestBody = {
        prompt: data.testPrompt,
        max_tokens: 100,
        temperature: 0.7,
      }
    }

    console.log("Request details:", {
      url: data.apiEndpoint,
      headers: { ...headers, Authorization: headers.Authorization ? "[REDACTED]" : undefined },
      body: requestBody,
    })

    // Make the API request
    const response = await fetch(data.apiEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    const responseText = await response.text()
    console.log("Raw response:", responseText.substring(0, 500))

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = JSON.parse(responseText)
        if (errorData.error?.message) {
          errorMessage = errorData.error.message
        }
      } catch (e) {
        // Use the raw response text if JSON parsing fails
        errorMessage = responseText.substring(0, 200)
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        details: responseText,
        requestDetails: {
          endpoint: data.apiEndpoint,
          modelFormat: data.modelFormat,
          modelName: requestBody.model || requestBody.prompt,
        },
      })
    }

    // Parse response
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: "Invalid JSON response from API",
        details: responseText,
      })
    }

    // Extract generated text based on format
    let extractedText = ""

    // Try different response formats
    if (responseData.choices?.[0]?.message?.content) {
      extractedText = responseData.choices[0].message.content
    } else if (responseData.choices?.[0]?.text) {
      extractedText = responseData.choices[0].text
    } else if (responseData.generated_text) {
      extractedText = responseData.generated_text
    } else if (responseData[0]?.generated_text) {
      extractedText = responseData[0].generated_text
    } else if (responseData.result?.text) {
      extractedText = responseData.result.text
    } else if (responseData.output) {
      extractedText = responseData.output
    } else {
      // If no standard format found, show raw response
      extractedText = JSON.stringify(responseData, null, 2)
    }

    return NextResponse.json({
      success: true,
      extractedText,
      requestDetails: {
        endpoint: data.apiEndpoint,
        modelFormat: data.modelFormat,
        modelName: requestBody.model || requestBody.prompt,
      },
      rawResponse: responseData,
    })
  } catch (error) {
    console.error("Test model error:", error)

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
