"use client"

import React from "react"
import { 
  CaptionFont, 
  CaptionTextSize, 
  CaptionPosition 
} from "../states/types"
import Button from "../ui/button"

interface CaptionsStepProps {
  font: CaptionFont
  setFont: (font: CaptionFont) => void
  textSize: CaptionTextSize
  setTextSize: (size: CaptionTextSize) => void
  position: CaptionPosition
  setPosition: (position: CaptionPosition) => void
}

export default function CaptionsStep({
  font,
  setFont,
  textSize,
  setTextSize,
  position,
  setPosition
}: CaptionsStepProps) {
  const fonts: { value: CaptionFont; label: string }[] = [
    { value: 'arial', label: 'Arial' },
    { value: 'instrument-sans', label: 'Instrument Sans' },
    { value: 'times-new-roman', label: 'Times New Roman' },
  ]

  const sizes: { value: CaptionTextSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]

  const positions: { value: CaptionPosition; label: string }[] = [
    { value: 'top', label: 'Top' },
    { value: 'middle', label: 'Middle' },
    { value: 'bottom', label: 'Bottom' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customise Captions</h2>
      
      {/* Font Selection */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-700 block mb-3">Font</label>
        <div className="flex gap-2 mt-2">
          {fonts.map(({ value, label }) => (
            <Button
              key={value}
              variant={font === value ? 'orange' : 'grey'}
              onClick={() => setFont(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-700 block mb-3">Size</label>
        <div className="flex gap-2 mt-2">
          {sizes.map(({ value, label }) => (
            <Button
              key={value}
              variant={textSize === value ? 'orange' : 'grey'}
              onClick={() => setTextSize(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Position Selection */}
      <div>
        <label className="text-base font-semibold text-gray-700 block mb-3">Position</label>
        <div className="flex gap-2 mt-2">
          {positions.map(({ value, label }) => (
            <Button
              key={value}
              variant={position === value ? 'orange' : 'grey'}
              onClick={() => setPosition(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
