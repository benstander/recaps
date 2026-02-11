"use client"

import React, { Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import AuthForm, { AuthMode } from "@/components/auth/AuthForm"

function AuthPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const modeParam = searchParams.get("mode")
  const initialMode: AuthMode = modeParam === "signup" ? "signup" : "login"

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleModeChange = (mode: AuthMode) => {
    const newUrl = mode === "signup" ? "/auth?mode=signup" : "/auth"
    window.history.replaceState({}, "", newUrl)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center px-8 py-6">
        <Link href="/" className="text-2xl font-bold text-black">
          recaps
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-[550px] border border-gray-200 rounded-xl shadow-md bg-white">
          <div className="p-12">
            <AuthForm
              initialMode={initialMode}
              onSuccess={() => router.push("/")}
              onModeChange={handleModeChange}
            />
          </div>

          <div className="text-center pb-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              ← Back to recaps
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  )
}
