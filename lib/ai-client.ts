import axios from 'axios'

// ChatAnywhere API Configuration
const CHATANYWHERE_API_URL = process.env.OPENAI_API_BASE || 'https://api.chatanywhere.tech/v1'
const CHATANYWHERE_API_KEY = process.env.OPENAI_API_KEY || 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte'

// Available models for ChatAnywhere
export const AVAILABLE_MODELS = {
  'claude-sonnet': 'claude-sonnet-4-5-20250929',
  'claude-thinking': 'claude-sonnet-4-5-20250929-thinking',
  'gpt-5': 'gpt-5'
} as const

export type ModelType = keyof typeof AVAILABLE_MODELS

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GenerateOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  model?: ModelType
}

class AIClient {
  private apiUrl: string
  private apiKey: string
  private currentModel: string

  constructor() {
    this.apiUrl = CHATANYWHERE_API_URL
    this.apiKey = CHATANYWHERE_API_KEY
    // Default to claude-sonnet
    this.currentModel = AVAILABLE_MODELS['claude-sonnet']
  }

  // Method to switch models
  setModel(modelType: ModelType) {
    this.currentModel = AVAILABLE_MODELS[modelType]
    return this.currentModel
  }

  // Get current model
  getCurrentModel() {
    return this.currentModel
  }

  // Get all available models
  getAvailableModels() {
    return Object.entries(AVAILABLE_MODELS).map(([key, value]) => ({
      key,
      value,
      name: this.getModelDisplayName(key as ModelType)
    }))
  }

  // Get display name for model
  getModelDisplayName(modelType: ModelType): string {
    const names = {
      'claude-sonnet': 'Claude Sonnet 4.5',
      'claude-thinking': 'Claude Sonnet 4.5 (Thinking)',
      'gpt-5': 'GPT-5'
    }
    return names[modelType] || modelType
  }

  async generateCompletion(options: GenerateOptions) {
    try {
      // Use specified model or current model
      const modelToUse = options.model 
        ? AVAILABLE_MODELS[options.model]
        : this.currentModel

      // Validate API key
      if (!this.apiKey) {
        throw new Error('API key is not configured. Please set OPENAI_API_KEY in environment variables.')
      }

      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: modelToUse,
          messages: options.messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
          stream: options.stream || false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000, // 60 seconds timeout
        }
      )

      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response from AI service')
      }

      return response.data
    } catch (error: any) {
      // Enhanced error handling
      console.error('AI generation error:', error)
      
      if (error.response) {
        // API returned an error
        if (error.response.status === 401) {
          throw new Error('Invalid API key. Please check your ChatAnywhere API key.')
        } else if (error.response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.')
        } else if (error.response.status === 503) {
          throw new Error('AI service is temporarily unavailable. Please try again later.')
        } else {
          throw new Error(`AI service error: ${error.response.data?.error?.message || error.message}`)
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Unable to connect to AI service. Please check your internet connection.')
      } else {
        // Something else happened
        throw new Error(`AI generation failed: ${error.message}`)
      }
    }
  }

  async generateDraft({
    topic,
    type,
    style,
    outline,
    locale = 'id',
    length = 2000,
  }: {
    topic: string
    type: string
    style?: string
    outline?: string[]
    locale?: string
    length?: number
  }) {
    const systemPrompt = `Kamu adalah asisten akademik AI yang membantu menulis ${type} berkualitas tinggi.
    Gunakan bahasa ${locale === 'id' ? 'Indonesia' : 'Inggris'} yang formal dan akademis.
    ${style ? `Gunakan gaya sitasi ${style}.` : ''}
    Pastikan konten original, informatif, dan terstruktur dengan baik.`

    const userPrompt = outline
      ? `Tulis draft untuk topik "${topic}" dengan outline berikut:\n${outline.join('\n')}`
      : `Tulis draft untuk topik "${topic}"`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      maxTokens: length,
    })

    return response.choices[0].message.content
  }

  async paraphrase({
    text,
    tone = 'formal',
    locale = 'id',
  }: {
    text: string
    tone?: string
    locale?: string
  }) {
    const systemPrompt = `Kamu adalah asisten yang membantu menyusun ulang teks dengan mempertahankan makna asli.
    Gunakan bahasa ${locale === 'id' ? 'Indonesia' : 'Inggris'} dengan nada ${tone}.`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Parafrase teks berikut:\n\n${text}` },
      ],
      maxTokens: text.length * 2,
    })

    return response.choices[0].message.content
  }

  async checkGrammar({
    text,
    locale = 'id',
  }: {
    text: string
    locale?: string
  }) {
    const systemPrompt = `Kamu adalah asisten yang memeriksa dan memperbaiki kesalahan tata bahasa.
    Periksa teks dalam bahasa ${locale === 'id' ? 'Indonesia' : 'Inggris'}.
    Berikan teks yang sudah diperbaiki dan daftar koreksi yang dilakukan.`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Periksa dan perbaiki tata bahasa:\n\n${text}` },
      ],
    })

    return response.choices[0].message.content
  }

  async summarize({
    text,
    length = 'medium',
    locale = 'id',
  }: {
    text: string
    length?: 'short' | 'medium' | 'detailed'
    locale?: string
  }) {
    const lengthInstruction = {
      short: '2-3 paragraf singkat',
      medium: '4-5 paragraf sedang',
      detailed: 'ringkasan lengkap dengan semua poin penting',
    }

    const systemPrompt = `Kamu adalah asisten yang membuat ringkasan dokumen akademik.
    Gunakan bahasa ${locale === 'id' ? 'Indonesia' : 'Inggris'}.
    Buat ringkasan dalam ${lengthInstruction[length]}.`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Ringkas teks berikut:\n\n${text}` },
      ],
    })

    return response.choices[0].message.content
  }

  async generateOutline({
    topic,
    type,
    locale = 'id',
  }: {
    topic: string
    type: string
    locale?: string
  }) {
    const systemPrompt = `Kamu adalah asisten yang membuat outline untuk penulisan ${type}.
    Gunakan bahasa ${locale === 'id' ? 'Indonesia' : 'Inggris'}.
    Buat outline yang terstruktur dengan bab dan sub-bab.`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Buat outline untuk topik: ${topic}` },
      ],
    })

    return response.choices[0].message.content
  }

  async chatCompletion({
    messages,
    mode = 'general',
    model,
  }: {
    messages: ChatMessage[]
    mode?: 'general' | 'eli5' | 'academic'
    model?: ModelType
  }) {
    const systemPrompts = {
      general: 'Kamu adalah asisten AI yang membantu mahasiswa dan dosen dengan pertanyaan akademik.',
      eli5: 'Kamu adalah asisten yang menjelaskan konsep kompleks dengan bahasa sederhana dan analogi yang mudah dipahami.',
      academic: 'Kamu adalah asisten akademik yang memberikan jawaban mendalam dengan referensi dan penjelasan ilmiah.',
    }

    const allMessages = [
      { role: 'system', content: systemPrompts[mode] },
      ...messages,
    ] as ChatMessage[]

    const response = await this.generateCompletion({
      messages: allMessages,
      model: model,
    })

    return response.choices[0].message.content
  }

  async generateSlides({
    content,
    title,
  }: {
    content: string
    title: string
  }) {
    const systemPrompt = `Kamu adalah asisten yang membuat outline presentasi dari konten akademik.
    Buat struktur slide yang menarik dengan poin-poin utama.
    Format output dalam JSON dengan struktur: { slides: [{ title, content, notes }] }`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Buat outline presentasi untuk:\nJudul: ${title}\n\nKonten:\n${content}` },
      ],
    })

    try {
      return JSON.parse(response.choices[0].message.content)
    } catch {
      return { slides: [] }
    }
  }

  async analyzeData({
    data,
    analysisType,
  }: {
    data: any
    analysisType: string
  }) {
    const systemPrompt = `Kamu adalah asisten yang membantu analisis data statistik.
    Berikan interpretasi dan insight dari hasil analisis ${analysisType}.`

    const response = await this.generateCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analisis data berikut dengan metode ${analysisType}:\n${JSON.stringify(data)}` },
      ],
    })

    return response.choices[0].message.content
  }
}

export const aiClient = new AIClient()
