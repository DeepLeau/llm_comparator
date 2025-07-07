export interface LLMModel {
  id: string
  name: string
  provider: string
  context_length: number
  is_open_source: boolean
  stores_data: boolean
  pricing_prompt: number
  pricing_completion: number
  license: "Open Source" | "Commercial"
  speedScore: number // 1-5
  costPer1kTokens: number
  qualityScore: number // 1-5
  recommended: boolean
  category: "Text" | "Code" | "Multimodal" | "Embedding"
}

const providers = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "Mistral AI",
  "Cohere",
  "Hugging Face",
  "Stability AI",
  "Together AI",
  "Replicate",
  "Perplexity",
  "AI21 Labs",
  "Aleph Alpha",
  "Databricks",
  "MosaicML",
  "EleutherAI",
  "BigScience",
  "Microsoft",
  "Amazon",
  "IBM",
]

const modelNames = {
  OpenAI: ["GPT-4", "GPT-4 Turbo", "GPT-3.5 Turbo", "GPT-3.5", "Codex", "DALL-E 3"],
  Anthropic: ["Claude 3 Opus", "Claude 3 Sonnet", "Claude 3 Haiku", "Claude 2", "Claude Instant"],
  Google: ["Gemini Ultra", "Gemini Pro", "Gemini Nano", "PaLM 2", "Bard", "LaMDA"],
  Meta: ["LLaMA 2 70B", "LLaMA 2 13B", "LLaMA 2 7B", "Code Llama", "LLaMA", "OPT"],
  "Mistral AI": ["Mistral Large", "Mistral Medium", "Mistral Small", "Mixtral 8x7B", "Mistral 7B"],
  Cohere: ["Command R+", "Command R", "Command", "Generate", "Embed", "Classify"],
  "Hugging Face": ["StarCoder", "CodeGen", "BLOOM", "T5", "BERT", "RoBERTa"],
  "Stability AI": ["Stable LM", "StableLM Alpha", "StableCode", "Stable Diffusion"],
  "Together AI": ["RedPajama", "Falcon", "MPT", "Vicuna", "Alpaca"],
  Replicate: ["Llama 2", "Vicuna", "Alpaca", "Dolly", "ChatGLM"],
  Perplexity: ["pplx-7b-online", "pplx-70b-online", "pplx-7b-chat", "pplx-70b-chat"],
  "AI21 Labs": ["Jurassic-2 Ultra", "Jurassic-2 Mid", "Jurassic-2 Light", "J2-Grande"],
  "Aleph Alpha": ["Luminous Supreme", "Luminous Extended", "Luminous Base"],
  Databricks: ["Dolly 2.0", "Dolly 1.0", "MPT-30B", "MPT-7B"],
  MosaicML: ["MPT-30B", "MPT-7B", "MPT-1B", "MPT Instruct"],
  EleutherAI: ["GPT-J", "GPT-NeoX", "Pythia", "GPT-Neo"],
  BigScience: ["BLOOM", "T0", "mT5", "ByT5"],
  Microsoft: ["DialoGPT", "CodeBERT", "GraphCodeBERT", "UniLM"],
  Amazon: ["Titan Text", "Titan Embeddings", "Alexa Teacher Model"],
  IBM: ["Granite", "Watson", "CodeNet", "Project Debater"],
}

export interface ModelFilters {
  searchQuery: string
  licenseFilter: "all" | "open_source" | "proprietary"
  providerFilter: string
  storesDataFilter: "all" | "yes" | "no"
  maxInputPriceFilter: number
  maxOutputPriceFilter: number
}

export function generateMockModels(): LLMModel[] {
  const models: LLMModel[] = []
  let idCounter = 1

  // Generate models for each provider
  providers.forEach((provider) => {
    const providerModels = modelNames[provider as keyof typeof modelNames] || ["Model 1", "Model 2", "Model 3"]

    providerModels.forEach((modelName) => {
      // Generate multiple variants/sizes for some models
      const variants = Math.random() > 0.7 ? ["", " Chat", " Instruct"] : [""]

      variants.forEach((variant) => {
        const fullName = modelName + variant
        const isOpenSource =
          provider === "Meta" ||
          provider === "Hugging Face" ||
          provider === "EleutherAI" ||
          provider === "BigScience" ||
          provider === "MosaicML" ||
          Math.random() > 0.7

        const isRecommended = ["GPT-4", "Claude 3 Opus", "Gemini Pro", "LLaMA 2 70B", "Mistral Large"].some((name) =>
          fullName.includes(name),
        )

        models.push({
          id: `model-${idCounter++}`,
          name: fullName,
          provider,
          context_length: [2048, 4096, 8192, 16384, 32768, 128000][Math.floor(Math.random() * 6)],
          is_open_source: isOpenSource,
          stores_data: Math.random() > 0.5,
          pricing_prompt: Number.parseFloat((Math.random() * 0.05 + 0.001).toFixed(4)),
          pricing_completion: Number.parseFloat((Math.random() * 0.05 + 0.001).toFixed(4)),
          license: isOpenSource ? "Open Source" : "Commercial",
          speedScore: Math.floor(Math.random() * 5) + 1,
          costPer1kTokens: Number.parseFloat((Math.random() * 0.1 + 0.001).toFixed(4)),
          qualityScore: Math.floor(Math.random() * 5) + 1,
          recommended: isRecommended,
          category: Math.random() > 0.8 ? "Code" : Math.random() > 0.6 ? "Multimodal" : "Text",
        })
      })
    })
  })

  // Add more models to reach 500+
  while (models.length < 500) {
    const randomProvider = providers[Math.floor(Math.random() * providers.length)]
    const modelNumber = Math.floor(Math.random() * 100) + 1
    const isOpenSource = Math.random() > 0.6

    models.push({
      id: `model-${idCounter++}`,
      name: `${randomProvider} Model ${modelNumber}`,
      provider: randomProvider,
      context_length: [2048, 4096, 8192, 16384, 32768, 128000][Math.floor(Math.random() * 6)],
      is_open_source: isOpenSource,
      stores_data: Math.random() > 0.5,
      pricing_prompt: Number.parseFloat((Math.random() * 0.05 + 0.001).toFixed(4)),
      pricing_completion: Number.parseFloat((Math.random() * 0.05 + 0.001).toFixed(4)),
      license: isOpenSource ? "Open Source" : "Commercial",
      speedScore: Math.floor(Math.random() * 5) + 1,
      costPer1kTokens: Number.parseFloat((Math.random() * 0.1 + 0.001).toFixed(4)),
      qualityScore: Math.floor(Math.random() * 5) + 1,
      recommended: Math.random() > 0.95,
      category: ["Text", "Code", "Multimodal", "Embedding"][Math.floor(Math.random() * 4)] as any,
    })
  }

  return models.sort((a, b) => a.name.localeCompare(b.name))
}