"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Zap, Cpu, DollarSign } from "lucide-react"

interface ModelConfigurationSectionProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const models = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", cost: "$0.03", speed: "Fast" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", cost: "$0.002", speed: "Very Fast" },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic", cost: "$0.015", speed: "Fast" },
  { id: "llama-2", name: "Llama 2", provider: "Meta", cost: "$0.001", speed: "Fast" },
]

export function ModelConfigurationSection({ selectedModel, onModelChange }: ModelConfigurationSectionProps) {
  const currentModel = models.find((m) => m.id === selectedModel)

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          Model Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">Configure your API endpoint model and parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="text-gray-300">Selected Model</Label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-700">
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Info */}
        {currentModel && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Cost per 1K tokens</p>
                <p className="text-white font-medium">{currentModel.cost}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">Speed</p>
                <p className="text-white font-medium">{currentModel.speed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Parameters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Temperature</Label>
            <Slider defaultValue={[0.7]} max={2} min={0} step={0.1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Max Tokens</Label>
            <Slider defaultValue={[2048]} max={4096} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span>
              <span>4096</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Stream Responses</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Update Configuration</Button>
      </CardContent>
    </Card>
  )
}
