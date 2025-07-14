import { ContactForm } from "@/components/contact/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png?height=32&width=32" alt="Logo" className="w-8 h-8 rounded" />
              <span className="text-lg font-semibold text-white">WhichLLMs</span>
            </div>
            <a href="/" className="text-gray-400 hover:text-white transition-colors">
              Back to Home
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">Have questions about WhichLLMs? We'd love to hear from you.</p>
        </div>

        <ContactForm />
      </main>
    </div>
  )
}
