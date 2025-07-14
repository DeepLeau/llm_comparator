import { Heart, Sparkles, Github, Twitter, Linkedin, Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-blue-500/20 bg-gradient-to-b from-gray-900/50 to-black backdrop-blur-xl relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-violet-600/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-600/5 to-blue-600/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-white font-black text-lg">LC</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl group-hover:text-blue-300 transition-colors">
                  LLM Comparator
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                  <span className="text-blue-400 text-xs font-medium">AI-Powered</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md group-hover:text-gray-300 transition-colors">
              The definitive platform for AI model comparison. Make smarter decisions, save time, and build better AI
              applications.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Product
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-blue-500/20">
          <p className="text-gray-400 flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-blue-400 animate-pulse" /> for the AI community
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2025 LLM Comparator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
