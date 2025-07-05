export function PricingHeader() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Simple, Transparent Pricing
      </h1>
      <p className="text-xl text-gray-400 max-w-3xl mx-auto">
        Choose the perfect plan for your LLM benchmarking needs. Test GPT-4, Claude, Mistral, and more with batch prompt
        testing and smart analytics.
      </p>
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>No setup fees</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>14-day free trial</span>
        </div>
      </div>
    </div>
  )
}