"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import ProductPage from "@/components/ProductPage"
import type { AuthMode } from "@/components/auth/AuthForm"
import { 
  WizardStep,
  VideoMode,
  LearningStyle,
  BackgroundVideo,
  CaptionFont,
  CaptionTextSize,
  CaptionPosition,
  Topic,
  TopicSummary
} from "@/components/states/types"

export default function Home() {
  const { user } = useAuth()
  
  // Wizard step state
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  
  // Upload state (Step 1)
  const [lectureLink, setLectureLink] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  // Video customization state (Step 2)
  const [mode, setMode] = useState<VideoMode>(null)
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(null)
  const [backgroundVideo, setBackgroundVideo] = useState<BackgroundVideo>(null)
  
  // Caption state (Step 3)
  const [font, setFont] = useState<CaptionFont>(null)
  const [textSize, setTextSize] = useState<CaptionTextSize>(null)
  const [position, setPosition] = useState<CaptionPosition>(null)
  
  // Topics state (Step 4)
  const [topics, setTopics] = useState<Topic[]>([])
  const [topicSummaries, setTopicSummaries] = useState<TopicSummary[]>([])
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("")
  const [pendingGenerate, setPendingGenerate] = useState(false)
  const [authPanelMode, setAuthPanelMode] = useState<AuthMode | null>(null)

  useEffect(() => {
    if (!user || !pendingGenerate) return
    setPendingGenerate(false)
    setAuthPanelMode(null)
    generateReel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, pendingGenerate])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null)
  }

  // Process input and generate topics (Step 1 -> Step 2)
  const processInputAndGenerateTopics = async () => {
    if (!lectureLink.trim() && !uploadedFile) {
      alert("Please provide a lecture link or upload a file!")
      return
    }

    // Reset selections so regenerating topics starts fresh
    setMode(null)
    setLearningStyle(null)
    setBackgroundVideo(null)
    setFont(null)
    setTextSize(null)
    setPosition(null)
    setTopics([])
    setTopicSummaries([])
    setGeneratedVideoUrl("")

    setIsProcessing(true)
    
    try {
      let response
      
      if (uploadedFile) {
        const formData = new FormData()
        formData.append('pdf', uploadedFile)
        
        response = await fetch('/api/pdfUpload', {
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch('/api/youtubeUpload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            youtubeUrl: lectureLink,
          }),
        })
      }

      if (!response.ok) {
        throw new Error('Failed to process input')
      }

      const data = await response.json()
      setTopicSummaries(data.summaries)
      
      // Convert summaries to topics for the UI
      const generatedTopics: Topic[] = data.summaries.map((summary: TopicSummary, index: number) => ({
        id: `topic_${index}`,
        title: summary.topicTitle,
        selected: false
      }))
      
      setTopics(generatedTopics)
      
    } catch (error) {
      console.error('Error processing input:', error)
      alert('Failed to process input. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Generate video (Step 5)
  const generateReel = async () => {
    if (!user) {
      setAuthPanelMode("login")
      setPendingGenerate(true)
      return
    }

    const selectedTopics = topics.filter(topic => topic.selected)
    
    if (selectedTopics.length === 0) {
      alert("Please select at least one topic!")
      return
    }

    setIsProcessing(true)
    
    try {
      // Filter summaries based on selected topics
      const selectedSummaries = topicSummaries.filter(summary => 
        selectedTopics.some(topic => topic.title === summary.topicTitle)
      )
      
      // Map the new learning style to the existing API voiceOptions
      const voiceOptions = {
        style: mode,
        character: 'storyteller' as const,
        dialogue: learningStyle === 'explainer' ? 'explainer' as const : 
                  learningStyle === 'storytelling' ? 'narrative' as const : 
                  'socratic' as const
      }

      const captionOptions = {
        font,
        textSize,
        position
      }

      // Generate video with selected summaries
      const videoResponse = await fetch('/api/createVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summaries: selectedSummaries.length > 0 ? selectedSummaries : topicSummaries.slice(0, selectedTopics.length),
          backgroundVideo: backgroundVideo || 'minecraft',
          voiceEnabled: true,
          videoFormat: 'fullscreen',
          voiceOptions,
          captionOptions,
          userId: user.id,
        }),
      })

      if (!videoResponse.ok) {
        throw new Error('Failed to generate video')
      }

      const videoData = await videoResponse.json()
      if (videoData.videos && videoData.videos.length > 0 && videoData.videos[0].videoUrl) {
        setGeneratedVideoUrl(videoData.videos[0].videoUrl)
      }
      
    } catch (error) {
      console.error('Error generating video:', error)
      alert('Failed to generate video. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <ProductPage
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        lectureLink={lectureLink}
        setLectureLink={setLectureLink}
        uploadedFile={uploadedFile}
        handleFileUpload={handleFileUpload}
        removeUploadedFile={removeUploadedFile}
        mode={mode}
        setMode={setMode}
        learningStyle={learningStyle}
        setLearningStyle={setLearningStyle}
        backgroundVideo={backgroundVideo}
        setBackgroundVideo={setBackgroundVideo}
        font={font}
        setFont={setFont}
        textSize={textSize}
        setTextSize={setTextSize}
        position={position}
        setPosition={setPosition}
        topics={topics}
        setTopics={setTopics}
        isProcessing={isProcessing}
      processInputAndGenerateTopics={processInputAndGenerateTopics}
      generateReel={generateReel}
      generatedVideoUrl={generatedVideoUrl}
      authMode={authPanelMode}
      onAuthCancel={() => {
        setAuthPanelMode(null)
        setPendingGenerate(false)
      }}
      onAuthSuccess={() => setAuthPanelMode(null)}
      onSignUp={() => {
        setAuthPanelMode("signup")
        setPendingGenerate(false)
      }}
    />
    </>
  )
}
