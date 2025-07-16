"use client"

import { BlogHeader } from "@/components/blog/blog-header"
import { BlogContent } from "@/components/blog/blog-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background - Same as landing page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/20 to-violet-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10">
        <Header />
        <div className="pt-20">
          <BlogHeader />
          <BlogContent />
        </div>
        <Footer />
      </div>
    </div>
  )
}