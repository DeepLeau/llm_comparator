import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, Clock, MapPin, Phone, Twitter, Github, Linkedin } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-white font-medium">Email</p>
              <p className="text-gray-400 text-sm">support@llmcomparator.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-white font-medium">Live Chat</p>
              <p className="text-gray-400 text-sm">Available 24/7 for Pro users</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
            <Phone className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-white font-medium">Phone</p>
              <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Times */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Response Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">General Inquiries</span>
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              24 hours
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Technical Support</span>
            <Badge variant="secondary" className="bg-blue-900 text-blue-300">
              4 hours
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Enterprise</span>
            <Badge variant="secondary" className="bg-green-900 text-green-300">
              1 hour
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Office Location */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Office Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-white font-medium">WhichLLMs HQ</p>
            <p className="text-gray-400">123 AI Street</p>
            <p className="text-gray-400">San Francisco, CA 94105</p>
            <p className="text-gray-400">United States</p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Follow Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5 text-blue-400" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5 text-gray-300" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-blue-600" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
