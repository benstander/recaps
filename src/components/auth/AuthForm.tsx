"use client"

import React, { useEffect, useState } from "react"
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
  className = "",
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const { signIn, signUp, signInWithGoogle } = useAuth()

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    const handlePointerDownOutsideInput = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest("input")) return

      const activeElement = document.activeElement
      if (activeElement instanceof HTMLInputElement) {
        activeElement.blur()
      }
    }

    document.addEventListener("pointerdown", handlePointerDownOutsideInput)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutsideInput)
    }
  }, [])

  const isLogin = mode === "login"

  const resetFeedback = () => {
    setError("")
    setMessage("")
  }

  const getErrorMessage = (err: unknown, fallback: string) => {
    return err instanceof Error ? err.message : fallback
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    resetFeedback()

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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."))
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Google sign-in failed."))
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = controlInputClass
  const inputButtonClasses = controlInputButtonClass

  return (
    <div className={`flex h-full min-h-[520px] flex-col justify-between ${className}`}>
      <section className="text-left pt-4">
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
          Welcome to Recaps
          <span className="block text-gray-400 font-normal">Make Learning Fun</span>
        </h1>
      </section>

      <section className="space-y-4 mt-0">
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className={`${inputButtonClasses} cursor-pointer`}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label
              htmlFor="email"
              className="text-base font-semibold text-gray-700 block mb-2"
              onPointerDown={(event) => event.preventDefault()}
            >
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

          <div>
            <Label
              htmlFor="password"
              className="text-base font-semibold text-gray-700 block mb-2"
              onPointerDown={(event) => event.preventDefault()}
            >
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
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div>
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
