"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { controlInputClass, controlInputButtonClass } from "@/components/ui/control-classes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export type AuthMode = "login" | "signup"

interface AuthFormProps {
  initialMode?: AuthMode
  onSuccess?: () => void
  onModeChange?: (mode: AuthMode) => void
  className?: string
}

export default function AuthForm({
  initialMode = "login",
  onSuccess,
  onModeChange,
  className = "",
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { signIn, signUp, signInWithGoogle } = useAuth()

  useEffect(() => {
    setMode(initialMode)
    setShowPassword(false)
  }, [initialMode])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== 'INPUT' || (target.id !== 'email' && target.id !== 'password')) {
        const emailInput = document.getElementById('email') as HTMLInputElement
        const passwordInput = document.getElementById('password') as HTMLInputElement
        if (emailInput && document.activeElement === emailInput) {
          emailInput.blur()
        }
        if (passwordInput && document.activeElement === passwordInput) {
          passwordInput.blur()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isLogin = mode === "login"

  const resetFeedback = () => {
    setError("")
    setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    resetFeedback()

    if (!showPassword) {
      setShowPassword(true)
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          onSuccess?.()
        }
      } else {
        const { data, error } = await signUp(email, password)
        if (error) {
          setError(error.message)
        } else if (data?.session) {
          onSuccess?.()
        } else {
          setMessage("Check your email for the confirmation link, then come back to generate your video.")
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    resetFeedback()

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed.")
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    const nextMode: AuthMode = isLogin ? "signup" : "login"
    setMode(nextMode)
    setEmail("")
    setPassword("")
    resetFeedback()
    setShowPassword(false)
    onModeChange?.(nextMode)
  }

  const inputClasses = controlInputClass
  const inputButtonClasses = controlInputButtonClass

  return (
    <div className={`flex h-full min-h-[520px] flex-col justify-center ${className}`}>
      <section className="text-left">
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
          Welcome to Recaps
          <span className="block text-gray-400 font-normal">Make Learning Fun</span>
        </h1>
      </section>

      {/* Explicit spacer so separation can't be "optimized away" by layout */}
      <div aria-hidden className="h-[72px] shrink-0" />

      <section className="space-y-4 mt-0">
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className={inputButtonClasses}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="h-px w-full bg-gray-200" />
          <span>or</span>
          <div className="h-px w-full bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <Label htmlFor="email" className="text-base font-semibold text-gray-700 block mb-3">
              Email
            </Label>
            <div className="relative mt-2">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <AnimatePresence>
            {showPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <Label htmlFor="password" className="text-base font-semibold text-gray-700 block mb-3">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    onBlur={(e) => {
                      e.target.blur();
                    }}
                    onMouseDown={(e) => {
                      if (document.activeElement === e.target) {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-4 rounded-lg mt-4">
              {message}
            </div>
          )}

          <div className="mt-auto pt-4">
            <Button
              type="submit"
              variant="dark"
              className="w-full py-4 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue with email"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
