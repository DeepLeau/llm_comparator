"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Code,
  CheckCircle,
  AlertTriangle,
  Brain,
  Database,
  Cpu,
  Target,
  Sparkles,
} from "lucide-react"

export function BlogContent() {
  return (
    <article className="max-w-4xl mx-auto px-6 pb-20 relative">
      <div className="prose prose-lg prose-invert max-w-none">
        {/* Section 1: Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            The LLM Selection Challenge
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            The AI landscape has exploded with options. Today, developers can choose from over{" "}
            <strong className="text-blue-400">300 different Large Language Models</strong>, from OpenAI's GPT-4 and
            Anthropic's Claude to open-source alternatives like Mistral and LLaMA. Each model has unique strengths,
            weaknesses, and cost structures.
          </p>

          <p className="text-gray-300 leading-relaxed mb-6">
            This abundance creates a new problem:{" "}
            <strong className="text-white">How do you choose the right model for your specific use case?</strong> More
            importantly, how do you ensure you're always using the best-performing model as the landscape rapidly
            evolves?
          </p>

          <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-2">The Evaluation Bottleneck</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  WhichLLMs already makes it easy to test the latest models and updates manually, no setup, just results.
                  But as usage grows, manually comparing models becomes time-consuming and error-prone. For teams in
                  production, this slows down decision-making. You need a scalable way to keep up with the pace of
                  innovation.
                </p>
              </div>
            </div>
          </Card>

          <p className="text-gray-300 leading-relaxed">
            <strong className="text-blue-400">Automated benchmarking</strong> emerges as the solution, a systematic
            approach to continuously evaluate and compare LLMs based on objective criteria, ensuring you always have the
            most current performance data to make informed decisions.
          </p>
        </section>

        {/* Section 2: What is Scheduled Benchmarking? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-violet-400" />
            What is Scheduled Benchmarking?
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Scheduled benchmarking is the practice of{" "}
            <strong className="text-white">automatically running LLM evaluations at regular intervals</strong> — daily,
            weekly, or monthly — to track performance changes over time and ensure optimal model selection.
          </p>

          <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-violet-500/20 backdrop-blur-xl rounded-2xl mb-8">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              Real-World Example: Customer Support Optimization
            </h4>
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                A SaaS company runs automated tests every <strong className="text-violet-400">Tuesday at 9 AM</strong>,
                evaluating 5 different models (GPT-4, Claude-3, Gemini Pro, Mistral Large, and LLaMA-2) on their
                customer support prompts.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">
                  Week 1: GPT-4 scores highest (4.2/5) → Production uses GPT-4
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">
                  Week 2: Claude-3 improves (4.4/5) → Automatic switch to Claude-3
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">
                  Week 3: Mistral Large drops (3.1/5) → Avoided automatically
                </span>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Consistency</h4>
              <p className="text-gray-300 text-sm">
                Always using the best-performing model without manual intervention
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Adaptability</h4>
              <p className="text-gray-300 text-sm">Automatically adapts to model updates and new releases</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Quality Assurance</h4>
              <p className="text-gray-300 text-sm">Prevents quality regressions in production systems</p>
            </Card>
          </div>
        </section>

        {/* Section 3: What is Automatic Scoring? */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-400" />
            What is Automatic Scoring?
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Automatic scoring uses an <strong className="text-green-400">LLM-as-a-judge architecture</strong> where a
            specialized model evaluates and rates responses from other LLMs based on predefined criteria. This
            eliminates human bias and enables scalable, consistent evaluation.
          </p>

          <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-green-500/20 backdrop-blur-xl rounded-2xl mb-8">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-green-400" />
              Scoring Criteria
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Quality</Badge>
                  <span className="text-gray-300 text-sm">How well does the response address the prompt?</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Hallucination</Badge>
                  <span className="text-gray-300 text-sm">Rate of factual inaccuracies</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Latency</Badge>
                  <span className="text-gray-300 text-sm">Response time performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Cost</Badge>
                  <span className="text-gray-300 text-sm">Token usage and pricing efficiency</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 4: Why It Matters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            Why It Matters
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Saving Developer Time</h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                Manual model evaluation can take{" "}
                <strong className="text-blue-400">40+ hours per comparison cycle</strong>. Automated scoring reduces
                this to minutes while providing more comprehensive results.
              </p>
              <div className="bg-blue-500/10 rounded-xl p-4 border-l-4 border-blue-500">
                <p className="text-blue-300 text-sm">
                  <strong>Time saved:</strong> 95% reduction in evaluation overhead
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-red-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Preventing Quality Regressions</h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                LLM providers frequently update their models. Without continuous monitoring, a model that performed well
                last month might degrade without notice.
              </p>
              <div className="bg-red-500/10 rounded-xl p-4 border-l-4 border-red-500">
                <p className="text-red-300 text-sm">
                  <strong>Risk mitigation:</strong> Catch performance drops before users do
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-violet-500/20 backdrop-blur-xl rounded-2xl mb-8">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Adapting to the Fast-Changing LLM Landscape
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-violet-400 mb-2">Weekly</div>
                <p className="text-gray-300 text-sm">New model releases</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400 mb-2">Monthly</div>
                <p className="text-gray-300 text-sm">Pricing changes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-400 mb-2">Quarterly</div>
                <p className="text-gray-300 text-sm">Major updates</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 5: Under the Hood */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-purple-400" />
            Under the Hood: How It Works
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            The automated scoring system combines <strong className="text-purple-400">parallel processing</strong>,{" "}
            <strong className="text-blue-400">LLM-as-a-judge architecture</strong>, and{" "}
            <strong className="text-green-400">scalable API integration</strong> to deliver fast, reliable evaluations.
          </p>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-purple-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                1. Parallel Processing Architecture
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                Instead of testing models sequentially, the system sends prompts to multiple LLMs simultaneously,
                dramatically reducing evaluation time.
              </p>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  {["GPT-4", "Claude-3", "Gemini", "Mistral", "LLaMA"].map((model, index) => (
                    <div key={model} className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                      <div className="text-purple-300 font-semibold text-sm">{model}</div>
                      <div className="text-xs text-gray-400 mt-1">~2.3s</div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Total time: 2.3s (not 11.5s)
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                2. LLM-as-a-Judge Architecture
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                A specialized evaluator model acts as the judge, providing consistent,
                objective scoring across all responses.
              </p>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-2">
                      <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-blue-300 font-semibold text-sm">Responses</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-px bg-gradient-to-r from-blue-400 to-violet-400"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center mb-2">
                      <Brain className="w-8 h-8 text-violet-400" />
                    </div>
                    <div className="text-violet-300 font-semibold text-sm">Judge LLM</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-px bg-gradient-to-r from-violet-400 to-green-400"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-2">
                      <BarChart3 className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="text-green-300 font-semibold text-sm">Scores</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-green-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                3. Multi-Prompt Support & API Integration
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                Test multiple prompts simultaneously and integrate results directly into your production routing logic
                via API.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Batch testing: 100+ prompts per evaluation cycle</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">REST API: Real-time routing to best-performing model</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">
                    Webhooks: Automatic notifications on performance changes
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 6: Real Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-orange-400" />
            Real Use Cases
          </h2>

          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                Continuous Chatbot Evaluation
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                A fintech company runs daily evaluations of their customer support chatbot, testing responses across
                different query types and complexity levels.
              </p>
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-blue-300 font-semibold mb-1">Schedule</div>
                    <div className="text-gray-300">Daily at 6 AM UTC</div>
                  </div>
                  <div>
                    <div className="text-blue-300 font-semibold mb-1">Models Tested</div>
                    <div className="text-gray-300">GPT-4, Claude-3, Gemini Pro</div>
                  </div>
                  <div>
                    <div className="text-blue-300 font-semibold mb-1">Result</div>
                    <div className="text-gray-300">15% improvement in CSAT</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-violet-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-violet-400 font-bold text-sm">2</span>
                </div>
                Content Generation Optimization
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                A marketing agency evaluates LLMs weekly for different content types: blog posts, social media, and ad
                copy, optimizing for engagement and brand voice consistency.
              </p>
              <div className="bg-violet-500/10 rounded-xl p-4 border border-violet-500/20">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300 text-sm">Blog Posts</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Claude-3 (4.2/5)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300 text-sm">Social Media</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">GPT-4 (4.4/5)</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-violet-300 text-sm">Ad Copy</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Mistral (4.1/5)</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-green-500/20 backdrop-blur-xl rounded-2xl">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">3</span>
                </div>
                Academic & Enterprise Research
              </h4>
              <p className="text-gray-300 leading-relaxed mb-4">
                Research institutions use automated scoring to evaluate model performance across different domains,
                languages, and reasoning tasks for academic publications.
              </p>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-300 font-semibold mb-2">Research Benefits</div>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Reproducible results</li>
                      <li>• Large-scale comparisons</li>
                      <li>• Longitudinal studies</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-green-300 font-semibold mb-2">Evaluation Domains</div>
                    <ul className="space-y-1 text-gray-300">
                      <li>• Mathematical reasoning</li>
                      <li>• Code generation</li>
                      <li>• Multi-language support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 7: Future Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            Future Features
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            The automated scoring landscape continues to evolve. Here are upcoming features that will further enhance
            LLM evaluation capabilities:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Advanced Hallucination Detection</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Specialized scoring for factual accuracy with real-time fact-checking against knowledge bases.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Long-Context Evaluation</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Testing models with 100K+ token contexts for document analysis and complex reasoning tasks.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 backdrop-blur-xl rounded-2xl">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Multi-Language Support</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Automated evaluation across 50+ languages with native speaker validation.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 8: Conclusion */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            Conclusion
          </h2>

          <p className="text-gray-300 leading-relaxed mb-6">
            Automated scoring and scheduled benchmarking represent a fundamental shift in how we approach LLM
            evaluation. As the AI landscape continues to evolve at breakneck speed, companies with higher needs 
            can't afford to rely on manual testing, they need real-time insights, continuous updates, and effortless model selection.
          </p>

          <Card className="p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl mb-8">
            <h4 className="text-white font-semibold mb-4">Key Takeaways</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Automated evaluation</strong> saves 95% of manual testing time while
                  providing more comprehensive results
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Scheduled benchmarking</strong> ensures you're always using the
                  best-performing model for your use case
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 leading-relaxed">
                  <strong className="text-white">LLM-as-a-judge architecture</strong> provides consistent, objective
                  scoring at scale
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Continuous monitoring</strong> prevents quality regressions and adapts
                  to model updates automatically
                </span>
              </div>
            </div>
          </Card>

          <p className="text-gray-300 leading-relaxed mb-8">
            Whether you're a developer building AI features, a product manager optimizing user experience, or a
            researcher conducting large-scale studies, automated LLM evaluation provides the foundation for making
            data-driven decisions in an increasingly complex AI landscape.
          </p>

          <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl rounded-2xl text-center">
            <h4 className="text-white font-semibold mb-4">Ready to Get Started?</h4>
            <p className="text-gray-300 leading-relaxed mb-6">
              Experience automated LLM scoring with WhichLLMs. Compare 300+ models, set up scheduled benchmarks, and
              optimize your AI applications with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
                Free trial available
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">No setup required</Badge>
              <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-2">
                Start in minutes
              </Badge>
            </div>
          </Card>
        </section>
      </div>
    </article>
  )
}
