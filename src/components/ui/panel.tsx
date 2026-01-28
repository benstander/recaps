"use client"

import React from "react"

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "video"
  children: React.ReactNode
}

export function Panel({ 
  variant = "default", 
  children, 
  className = "",
  style,
  ...props 
}: PanelProps) {
  const baseClasses = "rounded-xl border"
  
  const variantClasses: Record<string, string> = {
    default: "bg-white border-gray-300",
    video: "bg-black border-neutral-800 overflow-hidden"
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      padding: '24px',
      boxShadow: `
        0 8px 16px rgba(0, 0, 0, 0.1),
        0 16px 32px rgba(0, 0, 0, 0.08),
        0 2px 4px rgba(0, 0, 0, 0.12),
        0 -1px 0 rgba(255, 255, 255, 0.5),
        inset 1px 0 3px rgba(0, 0, 0, 0.06),
        inset -1px 0 3px rgba(0, 0, 0, 0.06),
        inset 0 1px 3px rgba(0, 0, 0, 0.06),
        inset 0 -1px 3px rgba(0, 0, 0, 0.06)
      `.replace(/\s+/g, ' ').trim()
    },
    video: {
      boxShadow: `
        0 8px 16px rgba(0, 0, 0, 0.2),
        0 16px 32px rgba(0, 0, 0, 0.15),
        0 2px 4px rgba(0, 0, 0, 0.25),
        inset 0 2px 8px rgba(0, 0, 0, 0.5),
        inset 0 0 1px rgba(255, 255, 255, 0.1)
      `.replace(/\s+/g, ' ').trim()
    }
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export default Panel
