export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-20 h-8 bg-gray-800/50 rounded animate-pulse"></div>
              <div>
                <div className="w-32 h-6 bg-gray-800/50 rounded animate-pulse mb-1"></div>
                <div className="w-48 h-4 bg-gray-800/50 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-24 h-10 bg-gray-800/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full max-w-md h-10 bg-gray-800/50 rounded animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-800/50 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800/50 rounded-lg"></div>
                    <div>
                      <div className="w-24 h-5 bg-gray-800/50 rounded mb-1"></div>
                      <div className="w-16 h-4 bg-gray-800/50 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-800/50 rounded"></div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="w-full h-4 bg-gray-800/50 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-800/50 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-800/50 rounded"></div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-800/50 rounded"></div>
                  <div className="flex-1 h-8 bg-gray-800/50 rounded"></div>
                  <div className="w-8 h-8 bg-gray-800/50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
