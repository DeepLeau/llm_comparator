"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, User, Server, Copyright, Shield, Mail, MapPin, Globe, FileText, ChevronRight } from "lucide-react"

export function LegalContent() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" },
    )

    const sections = document.querySelectorAll('[id^="section-"]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const sections = [
    { id: "section-publisher", title: "Website Publisher", icon: Building2 },
    { id: "section-director", title: "Publication Director", icon: User },
    { id: "section-hosting", title: "Hosting Provider", icon: Server },
    { id: "section-intellectual", title: "Intellectual Property", icon: Copyright },
    { id: "section-liability", title: "Liability", icon: Shield },
    { id: "section-contact", title: "Contact", icon: Mail },
  ]

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 bg-white/5 backdrop-blur-sm border-white/10 text-white">
              <FileText className="w-3 h-3 mr-1" />
              Legal Information
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Legal Notice
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Legal information and publication details for the WhichLLMs platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sticky */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  Contents
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <Button
                        key={section.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full justify-start text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? "bg-blue-500/20 text-blue-300 border-l-2 border-blue-400"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {section.title}
                        <ChevronRight className="w-3 h-3 ml-auto" />
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Website Publisher */}
            <Card id="section-publisher" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Website Publisher</h2>
                    <p className="text-gray-300">Legal entity information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-blue-400" />
                        Website
                      </h4>
                      <p className="text-gray-300">
                        WhichLLMs (available at{" "}
                        <a href="https://whichllms.com" className="text-blue-400 hover:underline font-medium">
                          https://whichllms.com
                        </a>
                        )
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Building2 className="w-4 h-4 mr-2 text-purple-400" />
                        Business Name
                      </h4>
                      <p className="text-gray-300 font-medium">BODENAN THOMAS</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-green-400" />
                        Legal Status
                      </h4>
                      <p className="text-gray-300">Sole proprietorship (micro-entreprise under French law)</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                        Registered Address
                      </h4>
                      <p className="text-gray-300">
                        22 rue Jean de la Fontaine
                        <br />
                        78800 Houilles, France
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/20">
                  <h4 className="font-semibold text-white mb-2">VAT Status</h4>
                  <p className="text-gray-300">VAT not applicable – Article 293 B of the French General Tax Code</p>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-400" />
                    Email
                  </h4>
                  <a href="mailto:support@whichllms.com" className="text-blue-400 hover:underline font-medium">
                    support@whichllms.com
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Publication Director */}
            <Card id="section-director" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Publication Director</h2>
                    <p className="text-gray-300">Editorial responsibility</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="text-gray-300 text-lg">
                    <span className="font-semibold text-purple-400">Thomas Bodenan</span>, as the legal owner of the
                    business.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hosting Provider */}
            <Card id="section-hosting" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hosting Provider</h2>
                    <p className="text-gray-300">Technical infrastructure</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <p className="text-gray-300 mb-4">The site is hosted by:</p>
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <span className="font-medium text-white">Company name:</span> Vercel
                    </p>
                    <p>
                      <span className="font-medium text-white">Address:</span> 650 California St, San Francisco, CA 94108, US
                    </p>
                    <p>
                      <span className="font-medium text-white">Website:</span>{" "}
                      <a href="https://vercel.com" className="text-green-400 hover:underline">
                        https://vercel.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card id="section-intellectual" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-4">
                    <Copyright className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Intellectual Property</h2>
                    <p className="text-gray-300">Content ownership and usage rights</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <p className="text-gray-300 leading-relaxed">
                    All content on the site (including but not limited to text, graphics, logos, and software) is the
                    exclusive property of <span className="font-semibold text-orange-400">WhichLLMs</span>, unless
                    otherwise stated. Any reproduction, modification, distribution, or use without express written
                    permission is strictly prohibited.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card id="section-liability" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Liability</h2>
                    <p className="text-gray-300">Disclaimer and limitations</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20">
                  <p className="text-gray-300 leading-relaxed">
                    The publisher strives to ensure the information provided on the website is accurate and up to date.
                    However, no guarantee is made regarding the completeness or accuracy of the content, and the
                    publisher cannot be held liable for errors or omissions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card id="section-contact" className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Contact</h2>
                    <p className="text-gray-300">Get in touch with us</p>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <p className="text-gray-300 mb-4">
                    For any questions regarding this legal notice or the website, please contact:
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <a
                      href="mailto:support@whichllms.com"
                      className="text-blue-400 hover:underline font-medium text-lg"
                    >
                      support@whichllms.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
