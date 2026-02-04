"use client"

import React, { useEffect } from "react"
import { X } from "lucide-react"
import Panel from "@/components/ui/panel"
import AuthForm, { AuthMode } from "@/components/auth/AuthForm"

interface AuthModalProps {
  open: boolean
  initialMode?: AuthMode
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({
  open,
  initialMode = "login",
  onClose,
  onSuccess,
}: AuthModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <Panel
        className="relative w-full max-w-5xl"
        style={{ height: "580px" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm transition hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-full flex-col items-center justify-center px-6">
          <div className="w-full max-w-[520px]">
            <AuthForm
              initialMode={initialMode}
              onSuccess={onSuccess}
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}
