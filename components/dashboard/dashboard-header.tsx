export function DashboardHeader() {
  return (
    <div className="mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Mon tableau de bord
      </h1>
      <p className="text-xl text-gray-400 max-w-3xl">
        Consultez vos précédents tests de prompts et comparez les résultats des modèles
      </p>
    </div>
  )
}