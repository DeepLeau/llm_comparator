"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        setIsSubmitted(true)
      } else {
        console.error("Email failed to send:", data.error)
        alert("An error occurred while sending your message.")
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("An unexpected error occurred.")
    }

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
          <p className="text-gray-400 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <Button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({ name: "", email: "", company: "", subject: "", message: "" })
            }}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300 text-sm font-medium">
              Company <span className="text-gray-500">(optional)</span>
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-300 text-sm font-medium">
              Subject *
            </Label>
            <Select onValueChange={(value) => handleInputChange("subject", value)} required>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="api">Automated scoring</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300 text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              required
              rows={6}
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none focus:border-blue-500 focus:ring-blue-500/20"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
