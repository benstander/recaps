"use client"

import React, { useRef } from "react"
import { X } from "lucide-react"
import { ArrowUpTrayIcon, LinkIcon } from "@heroicons/react/24/outline"

interface UploadStepProps {
  lectureLink: string
  setLectureLink: (link: string) => void
  uploadedFile: File | null
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeUploadedFile: () => void
}

// Shared button styles matching the Button component
const buttonBase = "cursor-pointer transition-all duration-100 ease-in-out font-semibold rounded-md border-2 text-sm py-4 px-4 w-full"

const orangeButtonStyle: React.CSSProperties = {
  background: "linear-gradient(to bottom, #F1753F 0%, #FF4B00 100%)",
  borderColor: "#e93b0a",
  color: "white",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)"
}

const greyButtonStyle: React.CSSProperties = {
  background: "linear-gradient(to bottom, #E9E9E9 0%, #D7D7D7 100%)",
  borderColor: "#c8c8c8",
  color: "#4A4A4A",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.05)"
}

// Inset style for inputs - no fill, just depth
const insetInputStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
  color: "#6b7280"
}

// Orange filled style for uploaded state
const orangeFilledStyle: React.CSSProperties = {
  background: "linear-gradient(to bottom, #F1753F 0%, #FF4B00 100%)",
  borderRadius: "12px",
  border: "2px solid #e93b0a",
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)",
  color: "white"
}

// Disabled style - slight grey fill to indicate not usable
const disabledInputStyle: React.CSSProperties = {
  background: "#f5f5f5",
  border: "1px solid #e5e5e5",
  borderRadius: "12px",
  boxShadow: "none",
  color: "#c0c0c0"
}

export default function UploadStep({
  lectureLink,
  setLectureLink,
  uploadedFile,
  handleFileUpload,
  removeUploadedFile
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRemoveFile = () => {
    removeUploadedFile()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Files</h2>
      
      {/* Notes Upload Section */}
      <div className="mb-6">
        <label className="text-base font-semibold text-gray-700 block mb-3">Notes</label>
        <div className="relative">
          {!lectureLink && !uploadedFile && (
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              ref={fileInputRef}
            />
          )}
          {uploadedFile ? (
            <div 
              className="transition-all duration-100 ease-in-out font-semibold text-sm py-12 px-4 w-full flex items-center justify-center gap-2 mt-2 cursor-default select-none"
              style={orangeFilledStyle}
            >
              <span className="font-medium text-white truncate cursor-default select-none">{uploadedFile.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile()
                }}
                className="p-1 hover:bg-gray-400/40 rounded-md cursor-pointer flex-shrink-0 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div 
              className={`transition-all duration-100 ease-in-out font-semibold text-sm py-12 px-4 w-full flex items-center justify-center gap-2 mt-2 ${lectureLink ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              style={lectureLink ? disabledInputStyle : insetInputStyle}
            >
              <ArrowUpTrayIcon className={`w-4 h-4 ${lectureLink ? 'text-gray-300' : 'text-gray-400'}`} />
              <span className={`font-medium ${lectureLink ? 'text-gray-300' : 'text-gray-400'}`}>Upload notes</span>
            </div>
          )}
        </div>
      </div>

      {/* YouTube URL Section */}
      <div>
        <label className="text-base font-semibold text-gray-700 block mb-3">Youtube</label>
        <div className="relative mt-2">
          <LinkIcon className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${uploadedFile ? 'text-gray-200' : 'text-gray-400'}`} style={{ left: '1rem' }} />
          {lectureLink && !uploadedFile && (
            <button
              type="button"
              onClick={() => setLectureLink('')}
              className="absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200/50 rounded-md cursor-pointer flex-shrink-0 transition-colors z-20"
              style={{ right: '0.75rem' }}
              aria-label="Clear input"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <input
            type="text"
            placeholder="https://youtube.com"
            value={lectureLink}
            onChange={(e) => setLectureLink(e.target.value)}
            disabled={!!uploadedFile}
            className={`w-full focus:outline-none text-sm font-medium ${uploadedFile ? 'cursor-not-allowed placeholder:text-gray-300' : 'placeholder:text-gray-400 text-gray-600'}`}
            style={{
              ...(uploadedFile ? disabledInputStyle : insetInputStyle),
              paddingLeft: '2.75rem',
              paddingRight: lectureLink && !uploadedFile ? '2.5rem' : '1rem',
              paddingTop: '1rem',
              paddingBottom: '1rem'
            }}
          />
        </div>
      </div>
    </div>
  )
}
