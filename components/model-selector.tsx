'use client'

import { useState, useEffect } from 'react'
import { ModelType } from '@/lib/ai-client'

interface ModelInfo {
  key: string
  value: string
  name: string
}

interface ModelSelectorProps {
  onModelChange?: (model: ModelType) => void
  className?: string
}

export default function ModelSelector({ onModelChange, className = '' }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [currentModel, setCurrentModel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available models on component mount
  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ai/models')
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      const data = await response.json()
      setModels(data.models)
      setCurrentModel(data.currentModel)
    } catch (error) {
      console.error('Error fetching models:', error)
      setError('Gagal memuat model AI')
    }
  }

  const handleModelChange = async (modelKey: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelKey }),
      })

      if (!response.ok) {
        throw new Error('Failed to change model')
      }

      const data = await response.json()
      setCurrentModel(data.currentModel)
      
      // Call the callback if provided
      if (onModelChange) {
        onModelChange(modelKey as ModelType)
      }

      // Show success message (optional)
      console.log(`Model berhasil diganti ke: ${data.modelName}`)
    } catch (error) {
      console.error('Error changing model:', error)
      setError('Gagal mengganti model')
    } finally {
      setIsLoading(false)
    }
  }

  // Find current model info
  const currentModelInfo = models.find(m => m.value === currentModel)

  return (
    <div className={`model-selector ${className}`}>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pilih Model AI
        </label>
        
        {error && (
          <div className="text-red-500 text-sm mb-2">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={currentModelInfo?.key || ''}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          >
            <option value="" disabled>
              Pilih model...
            </option>
            {models.map((model) => (
              <option key={model.key} value={model.key}>
                {model.name}
              </option>
            ))}
          </select>

          {isLoading && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="space-y-1">
            <p><strong>Claude Sonnet 4.5:</strong> Model terbaik untuk tugas umum dan akademis</p>
            <p><strong>Claude Sonnet 4.5 (Thinking):</strong> Model dengan kemampuan reasoning tinggi</p>
            <p><strong>GPT-5:</strong> Model generasi terbaru dengan kemampuan advanced</p>
          </div>
        </div>
      </div>
    </div>
  )
}
