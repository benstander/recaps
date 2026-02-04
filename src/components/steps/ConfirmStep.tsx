"use client"

import React from "react"
import { 
  VideoMode, 
  LearningStyle, 
  BackgroundVideo,
  CaptionFont,
  CaptionTextSize,
  CaptionPosition,
  Topic 
} from "../states/types"

interface ConfirmStepProps {
  lectureLink: string
  uploadedFile: File | null
  mode: VideoMode
  learningStyle: LearningStyle
  backgroundVideo: BackgroundVideo
  font: CaptionFont
  textSize: CaptionTextSize
  position: CaptionPosition
  topics: Topic[]
}

export default function ConfirmStep({
  lectureLink,
  uploadedFile,
  mode,
  learningStyle,
  backgroundVideo,
  font,
  textSize,
  position,
  topics
}: ConfirmStepProps) {
  const selectedTopic = topics.find(t => t.selected)

  // Helper to format display values
  const formatValue = (value: string | null | undefined): string => {
    if (!value) return '-'
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatBackgroundVideo = (video: BackgroundVideo): string => {
    if (!video) return '-'
    const labels: Record<string, string> = {
      'minecraft': 'Minecraft parkour',
      'subway': 'Subway Surfers',
      'mega-ramp': 'Mega Ramp',
      'lebron': 'LeBron',
      'ronaldo': 'Ronaldo',
      'mcconaughey': 'McConaughey',
    }
    return labels[video] || formatValue(video)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Confirm Video</h2>
      
      {/* File Section */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-900 block mb-3">File</label>
        <p className="text-sm text-gray-500">
          {uploadedFile 
            ? `File: ${uploadedFile.name}` 
            : lectureLink 
              ? `Youtube link: ${lectureLink}` 
              : 'No file uploaded'}
        </p>
      </div>

      {/* Video Section */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-900 block mb-3">Video</label>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Mode: {formatValue(mode)}</p>
          <p className="text-sm text-gray-500">Learning style: {formatValue(learningStyle)}</p>
          <p className="text-sm text-gray-500">Background video: {formatBackgroundVideo(backgroundVideo)}</p>
        </div>
      </div>

      {/* Captions Section */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-900 block mb-3">Captions</label>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Font: {formatValue(font)}</p>
          <p className="text-sm text-gray-500">Size: {formatValue(textSize)}</p>
          <p className="text-sm text-gray-500">Position: {formatValue(position)}</p>
        </div>
      </div>

      {/* Topic Section */}
      <div>
        <label className="text-base font-semibold text-gray-900 block mb-3">Topic</label>
        <p className="text-sm text-gray-500">
          {selectedTopic ? selectedTopic.title : 'No topic selected'}
        </p>
      </div>
    </div>
  )
}
