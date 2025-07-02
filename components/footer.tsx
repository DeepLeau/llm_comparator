import { Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <span className="text-white font-semibold text-lg">LLM Comparator</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for the AI community
          </p>
          <p className="text-gray-500 text-sm mt-2">© 2025 LLM Comparator. Free Beta.</p>
        </div>
      </div>
    </footer>
  )
}
