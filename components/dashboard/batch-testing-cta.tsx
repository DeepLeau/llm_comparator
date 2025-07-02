"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ArrowRight, Sparkles } from "lucide-react"

export function BatchTestingCTA() {
  return (
    <Card className="p-8 bg-gradient-to-br from-purple-900/20 via-white/5 to-blue-900/20 border-white/10 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Fonctionnalité avancée</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Envie de tester des prompts en masse ?</h3>

          <p className="text-gray-400 text-lg mb-6 max-w-2xl">
            Uploadez un fichier CSV avec des centaines de prompts et obtenez une analyse comparative complète de tous
            les modèles IA en quelques minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => {
                window.location.href = "/batch"
              }}
            >
              <Upload className="mr-2 w-5 h-5" />
              Passer au comparateur avancé
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white bg-transparent px-6 py-3 rounded-xl"
            >
              En savoir plus
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <Upload className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>
    </Card>
  )
}
