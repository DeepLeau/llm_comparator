"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function ContactHeader() {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/placeholder.svg?height=32&width=32" alt="Logo" className="w-8 h-8 rounded" />
              <span className="hidden sm:block text-lg font-semibold text-white">WhichLLMs</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="text-sm text-gray-400">Get in Touch</div>
        </div>
      </div>
    </div>
  )
}
