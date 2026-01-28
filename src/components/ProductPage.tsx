"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { 
  WizardStep,
  VideoMode, 
  LearningStyle, 
  BackgroundVideo,
  CaptionFont,
  CaptionTextSize,
  CaptionPosition,
  Topic
} from "./states/types"
import { UploadStep, VideoStep, CaptionsStep, TopicsStep, ConfirmStep } from "./steps"
import VideoPreview from "./VideoPreview"
import Button from "./ui/button"
import Panel from "./ui/panel"

interface ProductPageProps {
  // Step state
  currentStep: WizardStep
  setCurrentStep: (step: WizardStep) => void
  
  // Upload state (Step 1)
  lectureLink: string
  setLectureLink: (link: string) => void
  uploadedFile: File | null
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeUploadedFile: () => void
  
  // Video customization state (Step 2)
  mode: VideoMode
  setMode: (mode: VideoMode) => void
  learningStyle: LearningStyle
  setLearningStyle: (style: LearningStyle) => void
  backgroundVideo: BackgroundVideo
  setBackgroundVideo: (video: BackgroundVideo) => void
  
  // Caption state (Step 3)
  font: CaptionFont
  setFont: (font: CaptionFont) => void
  textSize: CaptionTextSize
  setTextSize: (size: CaptionTextSize) => void
  position: CaptionPosition
  setPosition: (position: CaptionPosition) => void
  
  // Topics state (Step 4)
  topics: Topic[]
  setTopics: (topics: Topic[]) => void
  
  // Processing state
  isProcessing: boolean
  processInputAndGenerateTopics: () => Promise<void>
  generateReel: () => Promise<void>
  
  // Generated video
  generatedVideoUrl: string
}

export default function ProductPage({
  currentStep,
  setCurrentStep,
  lectureLink,
  setLectureLink,
  uploadedFile,
  handleFileUpload,
  removeUploadedFile,
  mode,
  setMode,
  learningStyle,
  setLearningStyle,
  backgroundVideo,
  setBackgroundVideo,
  font,
  setFont,
  textSize,
  setTextSize,
  position,
  setPosition,
  topics,
  setTopics,
  isProcessing,
  processInputAndGenerateTopics,
  generateReel,
  generatedVideoUrl
}: ProductPageProps) {
  // Animation variants - smooth fade with blur transition (no horizontal movement)
  const variants = {
    initial: { opacity: 0, filter: 'blur(1px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(1px)' }
  }
  
  // Check if we can proceed based on current step
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(lectureLink.trim() || uploadedFile)
      case 2:
        return !!(mode && learningStyle && backgroundVideo)
      case 3:
        return !!(font && textSize && position)
      case 4:
        return topics.some(t => t.selected)
      case 5:
        return true
      default:
        return false
    }
  }

  // Handle continue button click
  const handleContinue = async () => {
    if (currentStep === 1) {
      // Process input and generate topics before moving to step 2
      await processInputAndGenerateTopics()
      setCurrentStep(2)
    } else if (currentStep === 5) {
      // Generate video
      await generateReel()
    } else {
      // Move to next step
      setCurrentStep((currentStep + 1) as WizardStep)
    }
  }

  // Handle back button click
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep)
    }
  }

  // Get continue button text
  const getContinueText = (): string => {
    if (isProcessing) {
      return currentStep === 1 ? 'Generating topics...' : 'Generating video...'
    }
    switch (currentStep) {
      case 1:
        return 'Generate topics'
      case 5:
        return 'Generate video'
      default:
        return 'Continue'
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <UploadStep
            lectureLink={lectureLink}
            setLectureLink={setLectureLink}
            uploadedFile={uploadedFile}
            handleFileUpload={handleFileUpload}
            removeUploadedFile={removeUploadedFile}
          />
        )
      case 2:
        return (
          <VideoStep
            mode={mode}
            setMode={setMode}
            learningStyle={learningStyle}
            setLearningStyle={setLearningStyle}
            backgroundVideo={backgroundVideo}
            setBackgroundVideo={setBackgroundVideo}
          />
        )
      case 3:
        return (
          <CaptionsStep
            font={font}
            setFont={setFont}
            textSize={textSize}
            setTextSize={setTextSize}
            position={position}
            setPosition={setPosition}
          />
        )
      case 4:
        return (
          <TopicsStep
            topics={topics}
            setTopics={setTopics}
          />
        )
      case 5:
        return (
          <ConfirmStep
            lectureLink={lectureLink}
            uploadedFile={uploadedFile}
            mode={mode}
            learningStyle={learningStyle}
            backgroundVideo={backgroundVideo}
            font={font}
            textSize={textSize}
            position={position}
            topics={topics}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center font-[family-name:var(--font-instrument-sans)]">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recaps</h1>
          <p className="text-md font-medium text-gray-600 text-right max-w-xs tracking-wide">
            Upload your notes, pdf or youtube video.<br />
            Customise your video. Learn the fun way.
          </p>
        </div>

        {/* Main Content - Single Card with Form and Video Preview */}
        <Panel className="flex">
          {/* Left Side - Customise Section */}
          <div className="flex-1 flex flex-col" style={{ minHeight: '520px' }}>
            {/* Step Content */}
            <div 
              style={{ 
                flex: 1, 
                minHeight: 0, 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep}
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={{
                    duration: 0.22,
                    ease: 'easeOut'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 mt-6 shrink-0">
              {currentStep > 1 && (
                <Button
                  variant="dark"
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-2 py-4"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
                </Button>
              )}
              <Button
                variant="orange"
                onClick={handleContinue}
                disabled={!canProceed() || isProcessing}
                className={`flex-1 flex items-center justify-center gap-2 py-4 ${
                  (!canProceed() || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>{getContinueText()}</span>
                {currentStep > 1 && currentStep < 5 && <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Right Side - Video Section (52px gap from form, 24px gap to buttons) */}
          <div className="flex-shrink-0 flex items-stretch" style={{ marginLeft: '52px', gap: '24px' }}>
            <VideoPreview
              backgroundVideo={backgroundVideo}
              isProcessing={isProcessing && currentStep === 5}
              generatedVideoUrl={generatedVideoUrl}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}
