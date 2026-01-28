"use client"

import React from "react"
import { Topic } from "../states/types"
import Button from "../ui/button"

interface TopicsStepProps {
  topics: Topic[]
  setTopics: (topics: Topic[]) => void
}

export default function TopicsStep({
  topics,
  setTopics
}: TopicsStepProps) {
  // Toggle topic selection (single selection only per image design)
  const toggleTopic = (topicId: string) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return { ...topic, selected: !topic.selected }
      } else {
        // Deselect all other topics (single selection)
        return { ...topic, selected: false }
      }
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 shrink-0">Generated Content</h2>
      
      <div className="flex flex-col flex-1 min-h-0">
        <label className="text-base font-semibold text-gray-700 block mb-3 shrink-0">Topics</label>
        
        {topics.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No topics generated yet. Please upload content first.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 mt-2">
            <div className="space-y-2">
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={topic.selected ? 'orange' : 'grey'}
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full text-left"
                >
                  {topic.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
