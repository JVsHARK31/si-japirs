import axios from 'axios'

const GPT_API_URL = process.env.GPT_API_URL || 'https://ai.sumopod.com/v1'
const GPT_API_KEY = process.env.GPT_API_KEY || ''
const GPT_MODEL = process.env.GPT_MODEL || 'gpt-4.1-nano'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface GenerateOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

class AIClient {
  private apiUrl: string
  private apiKey: string
  private model: string

  constructor() {
    this.apiUrl = GPT_API_URL
    this.apiKey = GPT_API_KEY
    this.model = GPT_MODEL
  }

  async generateCompletion(options: GenerateOptions) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
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
        }
      )

      return response.data
    } catch (error) {
      console.error('AI generation error:', error)
      throw error
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
  }: {
    messages: ChatMessage[]
    mode?: 'general' | 'eli5' | 'academic'
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
