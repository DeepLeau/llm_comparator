"use client"

import { Button } from "@/components/ui/button"
import { LogIn, User, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Header() {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-blue-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-sm">
              <Image
                src="/logo.png" 
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-white/90 font-bold text-lg group-hover:text-blue-300 transition-colors">
                WhichLLMs
              </span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-400/80 animate-pulse" />
                <span className="text-blue-400/80 text-xs font-medium">AI-Powered</span>
              </div>
            </div>
          </Link>

          {/* Login Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
              className="group bg-transparent border-blue-500/30 text-blue-300/90 hover:bg-blue-500/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Login
            </Button>

            <Link href="/early-access">
              <Button
                size="sm"
                className="group bg-gradient-to-r from-blue-600/80 to-violet-600/80 hover:from-blue-500/90 hover:to-violet-500/90 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 backdrop-blur-sm"
              >
                <User className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
