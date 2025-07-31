"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Key, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react"

export function APIKeysSection() {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [newKeyName, setNewKeyName] = useState("")

  const apiKeys = [
    {
      id: "1",
      name: "Production API",
      key: "sk-1234567890abcdef1234567890abcdef",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
      requests: 12847,
      status: "active",
    },
    {
      id: "2",
      name: "Development API",
      key: "sk-abcdef1234567890abcdef1234567890",
      created: "2024-01-10",
      lastUsed: "2024-01-19",
      requests: 3421,
      status: "active",
    },
    {
      id: "3",
      name: "Testing API",
      key: "sk-9876543210fedcba9876543210fedcba",
      created: "2024-01-05",
      lastUsed: "2024-01-18",
      requests: 856,
      status: "inactive",
    },
  ]

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 7) + "..." + key.substring(key.length - 4)
  }

  return (
    <Card className="border-gray-800 bg-gray-900/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">API Keys</CardTitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Create New API Key</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a new API key for your application. Keep it secure and don't share it publicly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName" className="text-gray-300">
                    Key Name
                  </Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Generate API Key</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-gray-400">Manage your API keys and monitor their usage</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">API Key</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Requests</TableHead>
              <TableHead className="text-gray-300">Last Used</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id} className="border-gray-800">
                <TableCell className="text-white font-medium">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-gray-300 bg-gray-800 px-2 py-1 rounded text-sm">
                      {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      apiKey.status === "active"
                        ? "bg-green-600/20 text-green-300 border-green-600/30"
                        : "bg-gray-600/20 text-gray-300 border-gray-600/30"
                    }
                  >
                    {apiKey.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{apiKey.requests.toLocaleString()}</TableCell>
                <TableCell className="text-gray-300">{apiKey.lastUsed}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-600/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
