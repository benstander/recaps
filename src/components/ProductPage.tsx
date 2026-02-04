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
import AuthForm, { AuthMode } from "@/components/auth/AuthForm"
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

  // Auth CTA
  onSignUp?: () => void
  authMode?: AuthMode | null
  onAuthCancel?: () => void
  onAuthSuccess?: () => void
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
  generatedVideoUrl,
  onSignUp,
  authMode,
  onAuthCancel,
  onAuthSuccess
}: ProductPageProps) {
  const handleLogoClick = () => {
    console.log('Logo clicked! Resetting to initial state')
    // Close auth panel if open
    if (onAuthCancel) {
      onAuthCancel()
    }
    // Reset to step 1
    setCurrentStep(1)
  }

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

  const getProgress = (): number => {
    const stepReached = (step: WizardStep) => currentStep >= step
    const lectureComplete = !!(lectureLink.trim() || uploadedFile)
    const enteredStep2 = stepReached(2)
    const modeComplete = stepReached(2) && !!mode
    const learningStyleComplete = stepReached(2) && !!learningStyle
    const backgroundVideoComplete = stepReached(2) && !!backgroundVideo
    const enteredStep3 = stepReached(3)
    const fontComplete = stepReached(3) && !!font
    const textSizeComplete = stepReached(3) && !!textSize
    const positionComplete = stepReached(3) && !!position
    const enteredStep4 = stepReached(4)
    const topicsComplete = stepReached(4) && topics.some(t => t.selected)
    const enteredStep5 = stepReached(5)
    const generatedComplete = !!generatedVideoUrl
    const completedSteps = [
      lectureComplete,
      enteredStep2,
      modeComplete,
      learningStyleComplete,
      backgroundVideoComplete,
      enteredStep3,
      fontComplete,
      textSizeComplete,
      positionComplete,
      enteredStep4,
      topicsComplete,
      enteredStep5
    ].filter(Boolean).length
    if (generatedComplete) {
      return 1
    }
    if (completedSteps === 0) {
      return 0
    }
    return (completedSteps / 12) * 0.99
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

  const hasCaptionSelection = !!(font || textSize || position)
  const previewBackground = currentStep === 1 ? null : backgroundVideo
  const previewCaptionFont = currentStep === 1 ? 'arial' : (font ?? (hasCaptionSelection ? 'arial' : undefined))
  const previewCaptionTextSize = currentStep === 1 ? 'medium' : (textSize ?? (hasCaptionSelection ? 'medium' : undefined))
  const previewCaptionPosition = currentStep === 1 ? 'middle' : (position ?? (hasCaptionSelection ? 'middle' : undefined))
  const showPreviewCaptions = currentStep === 1 ? true : hasCaptionSelection
  const useDefaultBackground = currentStep === 1
  const showAuthPanel = !!authMode

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center font-[family-name:var(--font-instrument-sans)]">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-50">
          <button 
            type="button"
            onClick={handleLogoClick}
            className="text-3xl font-bold text-gray-900 bg-transparent border-none cursor-pointer hover:opacity-70"
          >
            Recaps
          </button>
          <Button
            variant="dark"
            onClick={onSignUp}
            className="px-8 py-4 rounded-full"
          >
            Sign up
          </Button>
        </div>

        {/* Main Content - Single Card with Form and Video Preview */}
        <Panel className="flex" style={{ height: '580px' }}>
          {/* Left Side - Customise Section */}
          <div className="flex-1 flex flex-col h-full">
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
                  key={showAuthPanel ? `auth-${authMode}` : `step-${currentStep}`}
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
                  {showAuthPanel ? (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-auto">
                        <AuthForm
                          initialMode={authMode ?? "login"}
                          onSuccess={onAuthSuccess}
                        />
                      </div>
                    </div>
                  ) : (
                    renderStepContent()
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {!showAuthPanel && (
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
                  {isProcessing && currentStep === 1 ? (
                    <motion.div
                      className="w-5 h-5"
                      aria-label="Generating topics"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="2.5"
                        />
                        <path
                          d="M21 12a9 9 0 0 1-9 9"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    <>
                      <span>{getContinueText()}</span>
                      {currentStep > 1 && currentStep < 5 && <ChevronRight className="w-5 h-5" />}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Side - Video Section (52px gap from form, 24px gap to buttons) */}
          <div className="flex-shrink-0 flex items-stretch" style={{ marginLeft: '52px', gap: '24px' }}>
            <VideoPreview
              backgroundVideo={previewBackground}
              isProcessing={isProcessing && currentStep === 5}
              generatedVideoUrl={generatedVideoUrl}
              progress={getProgress()}
              captionFont={previewCaptionFont}
              captionTextSize={previewCaptionTextSize}
              captionPosition={previewCaptionPosition}
              showCaptions={showPreviewCaptions}
              useDefaultBackground={useDefaultBackground}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}
