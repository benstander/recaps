"use client"

import React, { useRef, useState, useEffect, useId, useMemo } from "react"
import { motion, animate, useMotionValue, useMotionValueEvent } from "motion/react"
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react"
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline"
import { BackgroundVideo, CaptionFont, CaptionPosition, CaptionTextSize } from "./states/types"
import Button from "./ui/button"

interface VideoPreviewProps {
  backgroundVideo: BackgroundVideo
  isProcessing?: boolean
  generatedVideoUrl?: string
  progress?: number
  captionFont?: CaptionFont
  captionTextSize?: CaptionTextSize
  captionPosition?: CaptionPosition
  showCaptions?: boolean
  useDefaultBackground?: boolean
}

// Video URL mapping
const VIDEO_URLS: Record<string, string> = {
  'minecraft': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/mp1.mp4',
  'subway': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/ss1.mp4',
  'mega-ramp': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/gta1.mp4',
  'lebron': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/lebron.mp4',
  'ronaldo': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/ronaldo.mp4',
  'mcconaughey': 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/matthew-mc.mp4',
}

// Default video when none selected
const DEFAULT_VIDEO = 'https://zgsukhxfrztnoojowzkr.supabase.co/storage/v1/object/public/background-videos/mp1.mp4'

export default function VideoPreview({ 
  backgroundVideo, 
  isProcessing = false,
  generatedVideoUrl,
  progress = 0,
  captionFont,
  captionTextSize,
  captionPosition,
  showCaptions = false,
  useDefaultBackground = true
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const waveClipId = useId()
  const progressPercentRaw = Math.max(0, Math.min(100, Math.round(progress * 100)))
  const progressPercent = generatedVideoUrl ? progressPercentRaw : Math.min(progressPercentRaw, 99)
  const progressMotion = useMotionValue(progressPercent)
  const [displayPercent, setDisplayPercent] = useState(progressPercent)
  const waveBars = [
    50, 44, 56, 50, 60, 44, 50, 34, 44, 56, 50, 60,
    44, 50, 56, 44, 34, 50, 56, 44, 60, 50, 44, 56,
    50, 34, 44, 56, 50, 60, 44, 50, 56, 44, 34, 50,
    56, 44, 60, 50, 44, 56, 50, 34, 44, 56, 50, 60,
    44, 50, 56, 44, 34, 50, 56, 44, 60, 50, 44, 50,
    56, 44, 50, 34, 60, 44, 56, 50, 34, 50, 56, 44
  ]
  const waveBarHeight = 2
  const waveBarGap = 3
  const waveViewWidth = 92
  const waveViewHeight = waveBars.length * (waveBarHeight + waveBarGap) - waveBarGap
  const waveFillHeight = (progressPercent / 100) * waveViewHeight
  const waveClipY = waveViewHeight - waveFillHeight
  const progressTextColor = progressPercent === 0 ? "#9CA3AF" : "#F97316"

  useEffect(() => {
    const controls = animate(progressMotion, progressPercent, {
      duration: 0.45,
      ease: "easeOut"
    })
    return () => controls.stop()
  }, [progressMotion, progressPercent])

  useMotionValueEvent(progressMotion, "change", (latest) => {
    const nextValue = Math.round(latest)
    setDisplayPercent(generatedVideoUrl ? nextValue : Math.min(nextValue, 99))
  })

  const preloadUrls = useMemo(() => {
    return Array.from(new Set(Object.values(VIDEO_URLS)))
  }, [])

  // Get the current video URL
  const videoUrl = generatedVideoUrl || (backgroundVideo ? VIDEO_URLS[backgroundVideo] : (useDefaultBackground ? DEFAULT_VIDEO : ""))

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
      if (!videoUrl) return
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
    if (!videoUrl) {
      setIsPlaying(false)
      return
    }
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }, [videoUrl])

  // Preload background videos so switching is instant
  useEffect(() => {
    if (typeof window === "undefined") return
    const preloadedVideos = preloadUrls.map((url) => {
      const video = document.createElement("video")
      video.preload = "auto"
      video.muted = true
      video.playsInline = true
      video.src = url
      video.load()
      video.play()
        .then(() => {
          video.pause()
          video.currentTime = 0
        })
        .catch(() => {
          // Autoplay may be blocked; load() is still helpful
        })
      return video
    })

    return () => {
      preloadedVideos.forEach((video) => {
        video.removeAttribute("src")
        video.load()
      })
    }
  }, [preloadUrls])

  const captionFontFamily = (() => {
    if (captionFont === "instrument-sans") return "var(--font-instrument-sans), system-ui, sans-serif"
    if (captionFont === "times-new-roman") return '"Times New Roman", Times, serif'
    return "Arial, Helvetica, sans-serif"
  })()

  const captionFontSize = (() => {
    if (captionTextSize === "large") return 24
    if (captionTextSize === "medium") return 20
    return 16
  })()

  const captionAnchorY = (() => {
    if (captionPosition === "top") return "20%"
    if (captionPosition === "bottom") return "80%"
    return "50%"
  })()

  const shouldShowCaptions = showCaptions && !generatedVideoUrl
  const captionScript = useMemo(() => {
    const paragraph =
      "Recaps turns long lectures into short, shareable videos. Upload a PDF or YouTube link, choose your style and background, customize captions, and preview instantly before exporting your recap."
    const words = paragraph.replace(/\s+/g, " ").trim().split(" ")
    const segments: string[] = []
    let currentLine = ""
    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word
      if (candidate.length <= 20) {
        currentLine = candidate
        return
      }
      if (currentLine) {
        segments.push(currentLine)
      }
      currentLine = word
    })
    if (currentLine) {
      segments.push(currentLine)
    }
    return segments
  }, [])
  const [captionIndex, setCaptionIndex] = useState(0)

  useEffect(() => {
    if (!shouldShowCaptions || !isPlaying) return
    const interval = window.setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % captionScript.length)
    }, 1500)
    return () => window.clearInterval(interval)
  }, [shouldShowCaptions, isPlaying, captionScript.length])

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
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            preload="auto"
            muted={isMuted}
            playsInline
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-black" />
        )}

        {shouldShowCaptions && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute left-0 right-0 flex justify-center px-6"
              style={{ top: captionAnchorY, transform: "translateY(-50%)" }}
            >
              <div
                className="text-white text-center font-semibold"
                style={{
                  fontFamily: captionFontFamily,
                  fontSize: captionFontSize,
                  lineHeight: 1.2,
                  textShadow: "0 2px 6px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.9)",
                  maxWidth: "88%",
                  whiteSpace: "nowrap"
                }}
              >
                {captionScript[captionIndex]}
              </div>
            </div>
          </div>
        )}

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
      <div className="flex flex-col justify-between shrink-0 items-center" style={{ width: 56 }}>
        {/* Top buttons */}
        <div className="flex flex-col gap-3 items-center">
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

        {/* Progress Wave */}
        <div
          className="relative flex-1 w-full"
          style={{ minHeight: 260 }}
          aria-label={`Progress ${progressPercent}%`}
          role="img"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative h-7 w-20">
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold tabular-nums leading-none"
                style={{ color: progressTextColor }}
                animate={{ scale: progressPercent === 0 ? 1 : 1.02 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {displayPercent}%
              </motion.span>
            </div>
            <div className="relative mt-2" style={{ width: 104, height: 240 }}>
              <svg
                viewBox={`0 0 ${waveViewWidth} ${waveViewHeight}`}
                className="absolute inset-0"
                style={{ width: "100%", height: "100%" }}
                aria-hidden="true"
              >
              <defs>
                <clipPath id={waveClipId}>
                  <motion.rect
                    x="0"
                    width={waveViewWidth}
                    initial={{ y: waveViewHeight, height: 0 }}
                    animate={{ y: waveClipY, height: waveFillHeight }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </clipPath>
              </defs>
              {waveBars.map((width, index) => {
                const y = index * (waveBarHeight + waveBarGap)
                const x = (waveViewWidth - width) / 2
                return (
                  <rect
                    key={`base-${index}`}
                    x={x}
                    y={y}
                    width={width}
                    height={waveBarHeight}
                    rx={waveBarHeight / 2}
                    fill="#D1D5DB"
                  />
                )
              })}
              <g clipPath={`url(#${waveClipId})`}>
                {waveBars.map((width, index) => {
                  const y = index * (waveBarHeight + waveBarGap)
                  const x = (waveViewWidth - width) / 2
                  return (
                    <rect
                      key={`fill-${index}`}
                      x={x}
                      y={y}
                      width={width}
                      height={waveBarHeight}
                      rx={waveBarHeight / 2}
                      fill="#F97316"
                    />
                  )
                })}
              </g>
            </svg>
            </div>
          </div>
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
