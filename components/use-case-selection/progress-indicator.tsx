"use client"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepNames: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, stepNames }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {stepNames.map((stepName, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isAccessible = stepNumber <= currentStep

            return (
              <div key={stepName} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : isAccessible
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-800 text-gray-500"
                      }
                    `}
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs font-medium
                      ${
                        isActive
                          ? "text-blue-400"
                          : isCompleted
                            ? "text-green-400"
                            : isAccessible
                              ? "text-gray-300"
                              : "text-gray-500"
                      }
                    `}
                  >
                    {stepName}
                  </span>
                </div>
                {index < stepNames.length - 1 && (
                  <div
                    className={`
                      mx-4 h-0.5 w-12
                      ${
                        stepNumber < currentStep
                          ? "bg-green-600"
                          : stepNumber === currentStep
                            ? "bg-blue-600"
                            : "bg-gray-700"
                      }
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
