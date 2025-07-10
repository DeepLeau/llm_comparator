"use client"

import type React from "react"

import { useState, Suspense, useEffect } from "react"
import { Eye, EyeOff, Zap, Sparkles, ArrowLeft, Crown, Building2, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

const planDetails = {
  free: { name: "Free", credits: 50, icon: Zap, color: "text-blue-400" },
  start: { name: "Start", credits: 500, icon: Crown, color: "text-purple-400" },
  scale: { name: "Scale", credits: 1500, icon: Building2, color: "text-green-400" },
}

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = (searchParams.get("plan") as keyof typeof planDetails) || "free"
  const paymentSuccess = searchParams.get("payment") === "success"
  const sessionId = searchParams.get("session_id")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  // Auto-remplir l'email si on vient d'un paiement Stripe
  useEffect(() => {
    if (paymentSuccess && !formData.email) {
      // Essayer de récupérer l'email depuis les pending subscriptions
      const fetchPendingSubscription = async () => {
        try {
          const response = await fetch("/api/get-pending-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.email) {
              setFormData((prev) => ({ ...prev, email: data.email, name: data.name || "" }))
            }
          }
        } catch (error) {
          console.log("Could not fetch pending subscription data")
        }
      }

      if (sessionId) {
        fetchPendingSubscription()
      }
    }
  }, [paymentSuccess, sessionId, formData.email])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !agreeToTerms) {
      setError("Please fill in all fields and agree to the terms")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("Starting signup process with sessionId:", sessionId)

      // Construire l'URL de redirection avec le sessionId si présent
      const redirectUrl = sessionId
        ? `${window.location.origin}/auth/callback?session_id=${sessionId}`
        : `${window.location.origin}/auth/callback`

      console.log("Redirect URL:", redirectUrl)

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            plan: selectedPlan,
          },
          emailRedirectTo: redirectUrl,
        },
      })

      if (authError) {
        throw authError
      }

      console.log("✅ User signup initiated:", authData.user?.email)

      if (authData.user && !authData.user.email_confirmed_at) {
        // Show email verification modal
        setUserEmail(formData.email)
        setShowEmailVerification(true)

        console.log("User created, email verification required:", {
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          plan: selectedPlan,
          sessionId: sessionId,
        })
      } else if (authData.user && authData.user.email_confirmed_at) {
        // User is already confirmed, create user record and process subscription
        await createUserRecord(authData.user.id)

        // Si il y a un sessionId (paiement), traiter l'abonnement
        if (sessionId) {
          console.log("Processing pending subscription for confirmed user...")
          try {
            const response = await fetch("/api/process-pending-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId }),
            })

            const result = await response.json()
            if (response.ok) {
              console.log("✅ Subscription processed:", result)
              router.push(`/dashboard?welcome=true&plan=${result.plan}`)
            } else {
              console.error("❌ Error processing subscription:", result)
              router.push("/dashboard?welcome=true")
            }
          } catch (error) {
            console.error("❌ Error processing subscription:", error)
            router.push("/dashboard?welcome=true")
          }
        } else {
          router.push("/dashboard?welcome=true")
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  const createUserRecord = async (userId: string) => {
    try {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        name: formData.name,
        plan: selectedPlan,
        credits: planDetails[selectedPlan].credits,
      })

      if (insertError) {
        console.error("Error creating user record:", insertError)
      } else {
        console.log("✅ User record created")
      }
    } catch (error) {
      console.error("Error in createUserRecord:", error)
    }
  }

  const handleResendEmail = async () => {
    try {
      const redirectUrl = sessionId
        ? `${window.location.origin}/auth/callback?session_id=${sessionId}`
        : `${window.location.origin}/auth/callback`

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: userEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error("Error resending email:", error)
      } else {
        console.log("Verification email resent successfully")
      }
    } catch (error) {
      console.error("Error resending verification email:", error)
    }
  }

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    agreeToTerms &&
    formData.password === formData.confirmPassword

  const PlanIcon = planDetails[selectedPlan].icon

  // Email Verification Modal
  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>

            {/* Description */}
            <p className="text-gray-400 mb-6">
              We've sent a verification link to <span className="text-white font-medium">{userEmail}</span>
            </p>

            {/* Payment Success Message */}
            {sessionId && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-sm text-green-300">
                    Payment successful! Your subscription will be activated once you verify your email.
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-gray-300 mb-2">
                    Click the verification link in your email to activate your account.
                  </p>
                  <p className="text-xs text-gray-500">
                    Don't forget to check your spam folder if you don't see the email.
                  </p>
                </div>
              </div>
            </div>

            {/* Resend Email Button */}
            <button
              onClick={handleResendEmail}
              className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/10 transition-all mb-4"
            >
              Resend verification email
            </button>

            {/* Back to Login */}
            <Link
              href="/login"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">© 2024 LLM Comparator. All rights reserved.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Sign Up Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Back to Login Link */}
          <Link
            href="/login"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>

          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              LLM Comparator
            </h1>
            <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Secure Platform
            </div>
            <p className="text-gray-400">
              {paymentSuccess ? "Complete your account setup" : "Create your account to start comparing AI models"}
            </p>
          </div>

          {/* Selected Plan Display */}
          {selectedPlan && (
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlanIcon className={`w-5 h-5 mr-2 ${planDetails[selectedPlan].color}`} />
                  <span className="text-white font-medium">{planDetails[selectedPlan].name} Plan</span>
                </div>
                <div className="text-sm text-gray-400">
                  {planDetails[selectedPlan].credits.toLocaleString()} credits
                </div>
              </div>
              {paymentSuccess && <div className="mt-2 text-sm text-green-400">✓ Payment successful</div>}
            </div>
          )}

          {/* Payment Success Message */}
          {paymentSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-green-300 font-medium">Payment Successful!</p>
                  <p className="text-xs text-green-400 mt-1">
                    Complete your account setup to activate your subscription.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 bg-white/5 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  {paymentSuccess ? "Activating Account..." : "Creating account..."}
                </div>
              ) : paymentSuccess ? (
                "Activate Account"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href={sessionId ? `/login?session_id=${sessionId}` : "/login"}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2024 LLM Comparator. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
