"use client"

import React from "react"
import { controlRadiusClass } from "./control-classes"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "orange" | "grey" | "dark" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
}

export function Button({ 
  variant = "grey", 
  size = "default",
  children, 
  className = "",
  style,
  ...props 
}: ButtonProps) {
  const baseClasses = `cursor-pointer font-semibold ${controlRadiusClass} border-2`
  
  const transitionStyle: React.CSSProperties = {
    transitionProperty: 'background, box-shadow, transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease'
    // Border color and text color are excluded from transition, so they change instantly
  }
  
  const sizeClasses: Record<string, string> = {
    default: "text-sm py-3 px-4",
    sm: "text-xs py-2 px-3",
    lg: "text-base py-4 px-6",
    icon: "p-3"
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    orange: {
      background: "linear-gradient(to bottom, #F1753F 0%, #FF4B00 100%)",
      borderColor: "#e93b0a",
      color: "white",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)"
    },
    grey: {
      background: "linear-gradient(to bottom, #E9E9E9 0%, #D7D7D7 100%)",
      borderColor: "#c8c8c8",
      color: "#4A4A4A",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.05)"
    },
    dark: {
      background: "linear-gradient(to bottom, #484848 0%, #2C2C2C 100%)",
      borderColor: "#101010",
      color: "white",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.2)"
    },
    default: {
      background: "linear-gradient(to bottom, #F1753F 0%, #FF4B00 100%)",
      borderColor: "#e93b0a",
      color: "white",
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)"
    },
    destructive: {
      background: "#ef4444",
      borderColor: "#dc2626",
      color: "white"
    },
    outline: {
      background: "transparent",
      borderColor: "#d1d5db",
      color: "#374151"
    },
    secondary: {
      background: "#e5e7eb",
      borderColor: "#d1d5db",
      color: "#111827"
    },
    ghost: {
      background: "transparent",
      borderColor: "transparent",
      color: "#374151"
    },
    link: {
      background: "transparent",
      borderColor: "transparent",
      color: "#3b82f6",
      textDecoration: "underline"
    }
  }

  const variantClasses: Record<string, string> = {
    orange: "hover:brightness-95 active:translate-y-0.5 active:scale-[0.97]",
    grey: "hover:brightness-95 active:translate-y-0.5 active:scale-[0.97]",
    dark: "hover:brightness-110 active:translate-y-0.5 active:scale-[0.97]",
    default: "hover:brightness-95 active:translate-y-0.5 active:scale-[0.97]",
    destructive: "hover:bg-red-600 active:scale-[0.97]",
    outline: "hover:bg-gray-100 active:scale-[0.97]",
    secondary: "hover:bg-gray-300 active:scale-[0.97]",
    ghost: "hover:bg-gray-100 active:scale-[0.97]",
    link: "hover:text-blue-600 active:scale-[0.97]"
  }

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || ""} ${className}`}
      style={{ ...transitionStyle, ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
