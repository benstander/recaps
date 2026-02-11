"use client"

import React, { useRef } from "react"
import { X } from "lucide-react"
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import { controlInputClass, controlRadiusClass } from "@/components/ui/control-classes"

interface UploadStepProps {
  lectureLink: string
  setLectureLink: (link: string) => void
  uploadedFile: File | null
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeUploadedFile: () => void
}

export default function UploadStep({
  uploadedFile,
  handleFileUpload,
  removeUploadedFile
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadSurfaceClass = `${controlInputClass} w-full mt-2 px-4 py-12 flex items-center justify-center gap-2`

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
          {!uploadedFile && (
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
              className={`${uploadSurfaceClass} cursor-default select-none text-gray-600`}
            >
              <span className="font-medium truncate cursor-default select-none">{uploadedFile.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveFile()
                  }}
                  className={`p-1 hover:bg-gray-50 ${controlRadiusClass} cursor-pointer flex-shrink-0 transition-colors`}
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
          ) : (
            <div 
              className={`${uploadSurfaceClass} transition-colors cursor-pointer hover:bg-gray-50`}
            >
              <ArrowUpTrayIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-400">Upload notes</span>
            </div>
          )}
        </div>
      </div>

      {/* YouTube URL Section */}
      {/*
      <div>
        <label className="text-base font-semibold text-gray-700 block mb-3">Youtube</label>
        <div className="relative mt-2">
          <LinkIcon
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 z-10 ${uploadedFile ? 'text-gray-200' : 'text-gray-400'}`}
            aria-hidden="true"
          />
          {lectureLink && !uploadedFile && (
            <button
              type="button"
              onClick={() => setLectureLink('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-50 ${controlRadiusClass} cursor-pointer flex-shrink-0 transition-colors z-20`}
              aria-label="Clear input"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <Input
            type="text"
            placeholder="https://youtube.com"
            value={lectureLink}
            onChange={(e) => setLectureLink(e.target.value)}
            disabled={!!uploadedFile}
            className={`${controlInputClass} w-full pl-12 ${lectureLink && !uploadedFile ? 'pr-10' : 'pr-4'} ${uploadedFile ? 'cursor-not-allowed placeholder:text-gray-300 text-gray-300' : ''}`}
          />
        </div>
      </div>
      */}
    </div>
  )
}
