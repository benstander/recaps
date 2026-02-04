"use client"

import React from "react"
import { 
  VideoMode, 
  LearningStyle, 
  BackgroundVideo 
} from "../states/types"
import Button from "../ui/button"

interface VideoStepProps {
  mode: VideoMode
  setMode: (mode: VideoMode) => void
  learningStyle: LearningStyle
  setLearningStyle: (style: LearningStyle) => void
  backgroundVideo: BackgroundVideo
  setBackgroundVideo: (video: BackgroundVideo) => void
}

export default function VideoStep({
  mode,
  setMode,
  learningStyle,
  setLearningStyle,
  backgroundVideo,
  setBackgroundVideo
}: VideoStepProps) {
  const modes: { value: VideoMode; label: string }[] = [
    { value: 'academic', label: 'Academic' },
    { value: 'brainrot', label: 'Brainrot' },
    { value: 'unhinged', label: 'Unhinged' },
  ]

  const learningStyles: { value: LearningStyle; label: string }[] = [
    { value: 'explainer', label: 'Explainer' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'socratic', label: 'Socratic' },
  ]

  const backgroundVideosRow1: { value: BackgroundVideo; label: string }[] = [
    { value: 'minecraft', label: 'Minecraft Parkour' },
    { value: 'subway', label: 'Subway Surfers' },
    { value: 'mega-ramp', label: 'Mega Ramp' },
  ]

  const backgroundVideosRow2: { value: BackgroundVideo; label: string }[] = [
    { value: 'lebron', label: 'Lebron' },
    { value: 'ronaldo', label: 'Ronaldo' },
    { value: 'mcconaughey', label: 'McConaughey' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customise Video</h2>
      
      {/* Mode Selection */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-700 block mb-3">Mode</label>
        <div className="flex gap-2 mt-2">
          {modes.map(({ value, label }) => (
            <Button
              key={value}
              variant={mode === value ? 'orange' : 'grey'}
              onClick={() => setMode(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Learning Style Selection */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-700 block mb-3">Learning style</label>
        <div className="flex gap-2 mt-2">
          {learningStyles.map(({ value, label }) => (
            <Button
              key={value}
              variant={learningStyle === value ? 'orange' : 'grey'}
              onClick={() => setLearningStyle(value)}
              className="flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Background Video Selection */}
      <div>
        <label className="text-base font-semibold text-gray-700 block mb-3">Background video</label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {backgroundVideosRow1.map(({ value, label }) => (
              <Button
                key={value}
                variant={backgroundVideo === value ? 'orange' : 'grey'}
                onClick={() => setBackgroundVideo(value)}
                className="flex-1"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {backgroundVideosRow2.map(({ value, label }) => (
              <Button
                key={value}
                variant={backgroundVideo === value ? 'orange' : 'grey'}
                onClick={() => setBackgroundVideo(value)}
                className="flex-1"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
