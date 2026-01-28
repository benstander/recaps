"use client"

import React, { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import { BackgroundVideo } from "./states/types"
import Button from "./ui/button"

interface VideoPreviewProps {
  backgroundVideo: BackgroundVideo
  isProcessing?: boolean
  generatedVideoUrl?: string
}

// Video URL mapping
const VIDEO_URLS: Record<string, string> = {
  'minecraft': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/minecraft/mp1.mp4',
  'subway': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/subway/ss1.mp4',
  'mega-ramp': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/gta/gta1.mp4',
  'lebron': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/celebs/lebron.mp4',
  'ronaldo': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/celebs/ronaldo.mp4',
  'mcconaughey': 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/celebs/matthew-mc.mp4',
}

// Default video when none selected
const DEFAULT_VIDEO = 'https://odlodohhblopeekvquaa.supabase.co/storage/v1/object/public/background-videos/minecraft/mp1.mp4'

export default function VideoPreview({ 
  backgroundVideo, 
  isProcessing = false,
  generatedVideoUrl 
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isDownloaded, setIsDownloaded] = useState(false)

  // Get the current video URL
  const videoUrl = generatedVideoUrl || (backgroundVideo ? VIDEO_URLS[backgroundVideo] : DEFAULT_VIDEO)

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = generatedVideoUrl ? 'recaps-video.mp4' : 'preview-video.mp4'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Show clipboard-check icon
      setIsDownloaded(true)
      // Reset after 2 seconds
      setTimeout(() => {
        setIsDownloaded(false)
      }, 2000)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Auto-play when video source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }, [videoUrl])

  return (
    <div className="flex h-full" style={{ gap: '24px' }}>
      {/* Video Container - fills height, maintains 9:16 aspect ratio */}
      <div 
        className="relative overflow-hidden flex-shrink-0" 
        style={{ 
          height: '100%',
          aspectRatio: '9/16',
          borderRadius: '16px', 
          backgroundColor: '#000' 
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-sm font-medium">Generating...</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons - 24px gap from video, flex column with space between */}
      <div className="flex flex-col justify-between shrink-0">
        {/* Top buttons */}
        <div className="flex flex-col gap-3">
          {/* Play/Pause Button */}
          <Button
            variant="orange"
            onClick={togglePlayPause}
            className="py-4 px-4 relative overflow-hidden"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="relative w-5 h-5">
              <Pause 
                className={`absolute inset-0 w-5 h-5 transition-all duration-200 ease-in-out ${
                  isPlaying 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
                }}
              />
              <Play 
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 ease-in-out ${
                  !isPlaying 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
                }}
              />
            </div>
          </Button>

          {/* Mute Button */}
          <Button
            variant="dark"
            onClick={toggleMute}
            className="py-4 px-4 relative overflow-hidden"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <div className="relative w-5 h-5">
              <VolumeX 
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 ease-in-out ${
                  isMuted 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
                }}
              />
              <Volume2 
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 ease-in-out ${
                  !isMuted 
                    ? 'opacity-100 blur-0 scale-100' 
                    : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
                }}
              />
            </div>
          </Button>
        </div>

        {/* Download Button - at bottom */}
        <Button
          variant="orange"
          onClick={handleDownload}
          className="py-4 px-4 relative overflow-hidden"
          aria-label={isDownloaded ? 'Downloaded' : 'Download'}
        >
          <div className="relative w-5 h-5">
            <Download 
              className={`absolute inset-0 w-5 h-5 transition-all duration-150 ease-in-out ${
                !isDownloaded 
                  ? 'opacity-100 blur-0 scale-100' 
                  : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
              }`}
              style={{
                transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
              }}
            />
            <ClipboardDocumentCheckIcon 
              className={`absolute inset-0 w-5 h-5 transition-all duration-150 ease-in-out ${
                isDownloaded 
                  ? 'opacity-100 blur-0 scale-100' 
                  : 'opacity-0 blur-[3px] scale-95 pointer-events-none'
              }`}
              style={{
                transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out, transform 150ms ease-in-out'
              }}
            />
          </div>
        </Button>
      </div>
    </div>
  )
}
