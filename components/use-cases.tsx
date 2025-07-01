"use client"

import { Card } from "@/components/ui/card"
import { Users, Headphones, ShoppingCart, FileText, Mail } from "lucide-react"

const useCases = [
  {
    icon: Headphones,
    title: "Support Client (SAV)",
    description: "Réponses automatiques, classification des tickets, résolution de problèmes",
    example: "Répondre à une réclamation client de manière empathique et professionnelle",
  },
  {
    icon: Users,
    title: "Ressources Humaines",
    description: "Screening CV, rédaction d'offres d'emploi, préparation d'entretiens",
    example: "Rédiger une offre d'emploi attractive pour un poste de développeur senior",
  },
  {
    icon: FileText,
    title: "Résumé de contenu",
    description: "Synthèse d'articles, rapports, documents longs en points clés",
    example: "Résumer un rapport financier de 50 pages en 5 points essentiels",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Descriptions produits, analyse d'avis, recommandations personnalisées",
    example: "Créer une description produit convaincante pour une boutique en ligne",
  },
  {
    icon: Mail,
    title: "Génération commerciale",
    description: "Emails de prospection, propositions commerciales, pitchs de vente",
    example: "Rédiger un email de prospection B2B avec un taux d'ouverture élevé",
  },
]

export function UseCases() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Cas d'Usage Concrets
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Découvrez quel modèle IA excelle dans votre domaine d'activité
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.slice(0, 3).map((useCase, index) => (
            <Card
              key={index}
              className="p-8 bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-300 italic">Exemple : {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {useCases.slice(3).map((useCase, index) => (
            <Card
              key={index + 3}
              className="p-8 bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{useCase.title}</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-300 italic">Exemple : {useCase.example}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
