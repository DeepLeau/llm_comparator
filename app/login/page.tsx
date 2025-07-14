"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Eye, EyeOff, Zap, Sparkles, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const error = searchParams.get("error")
  const message = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const processSubscription = async (sessionId: string, accessToken: string) => {
    try {
      const response = await fetch("/api/process-pending-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()
      if (response.ok) {
        console.log("✅ Subscription processed:", result)
        router.push(`/dashboard?welcome=true&plan=${result.plan}&credits=${result.credits}`)
      } else {
        console.error("❌ Error processing subscription:", result)
        router.push("/dashboard?error=subscription_failed")
      }
    } catch (error) {
      console.error("❌ Error processing subscription:", error)
      router.push("/dashboard?error=api_failed")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setLoginError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setLoginError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      console.log("✅ User logged in:", data.user?.email)

      // Attendre un peu pour que la session soit bien établie
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Si il y a un sessionId (venant d'un paiement), traiter l'abonnement
      if (sessionId) {
        console.log("Processing pending subscription after login...")
        const { data: sessionData } = await supabase.auth.getSession()
        const access_token = sessionData?.session?.access_token
        await processSubscription(sessionId, access_token)
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setLoginError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "session_expired":
        return "Your session has expired. Please log in to continue."
      case "authentication_required":
        return "Please log in to complete your subscription."
      case "session_error":
        return "There was an error with your session. Please try logging in again."
      default:
        return null
    }
  }

  const getMessage = (messageCode: string | null) => {
    switch (messageCode) {
      case "complete_subscription":
        return "Please log in to complete your subscription setup."
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage(error)
  const infoMessage = getMessage(message)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
              <img src="/logo.png" alt="Logo" className="rounded" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              WhichLLMs
            </h1>
            <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Secure Platform
            </div>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Session ID Notice */}
          {sessionId && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-300 font-medium">Payment Successful!</p>
                  <p className="text-xs text-blue-400 mt-1">Sign in to activate your subscription.</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          {infoMessage && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-blue-300">{infoMessage}</p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(errorMessage || loginError) && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {errorMessage || loginError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={!formData.email || !formData.password || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {sessionId ? "Activating Subscription..." : "Signing in..."}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {sessionId ? "Complete Subscription" : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href={sessionId ? `/signup?session_id=${sessionId}` : "/signup"}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2025 WhichLLMs. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
