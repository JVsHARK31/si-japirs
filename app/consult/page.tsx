"use client"

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Loader2, 
  MessageSquare,
  Sparkles,
  Copy,
  RefreshCw,
  User,
  Bot,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Info,
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { cn } from '@/lib/utils'
import ModelSelector from '@/components/model-selector'
import { ModelType } from '@/lib/ai-client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMode {
  value: 'general' | 'eli5' | 'academic'
  label: string
  description: string
  icon: React.ComponentType<any>
  color: string
}

const chatModes: ChatMode[] = [
  {
    value: 'general',
    label: 'Umum',
    description: 'Diskusi bebas tentang topik akademik',
    icon: MessageSquare,
    color: 'text-blue-500'
  },
  {
    value: 'eli5',
    label: 'ELI5 (Explain Like I\'m 5)',
    description: 'Penjelasan sederhana dengan analogi mudah',
    icon: Lightbulb,
    color: 'text-yellow-500'
  },
  {
    value: 'academic',
    label: 'Akademik Mendalam',
    description: 'Jawaban detail dengan referensi ilmiah',
    icon: GraduationCap,
    color: 'text-purple-500'
  }
]

const suggestedQuestions = [
  "Jelaskan perbedaan penelitian kualitatif dan kuantitatif",
  "Bagaimana cara menulis abstrak yang baik?",
  "Apa itu machine learning dan bagaimana cara kerjanya?",
  "Tips untuk presentasi skripsi yang efektif",
  "Cara mencari referensi jurnal yang kredibel"
]

export default function ConsultPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'general' | 'eli5' | 'academic'>('general')
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelType | undefined>('gpt-3.5') // Default to GPT-3.5 (unlimited)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Halo! Saya Si-JAPIRS AI Assistant 🤖\n\nSaya siap membantu Anda dengan pertanyaan seputar akademik, penelitian, penulisan ilmiah, dan topik pembelajaran lainnya.\n\n💡 Tip: Saat ini menggunakan GPT-3.5 Turbo (unlimited requests). Untuk hasil lebih advanced, coba GPT-5 (limit 5x/hari) dari dropdown Model AI.\n\nSilakan tanyakan apa saja!`,
          timestamp: new Date()
        }
      ])
    }
  }, [])

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/ai/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        mode,
        model: selectedModel
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // If a different model was used (fallback), notify user
      if (response.data.usedModel && response.data.usedModel !== selectedModel) {
        toast.info(`Menggunakan ${response.data.usedModel} karena ${selectedModel} mencapai limit`)
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Get error message from response or use default
      const errorMessage = error.response?.data?.error || error.message || 'Terjadi kesalahan saat menghubungi AI.'
      
      // Suggest user to switch to GPT-3.5 if rate limit error
      let suggestion = ''
      if (errorMessage.includes('limit') && selectedModel !== 'gpt-3.5') {
        suggestion = '\n\n💡 Tip: Coba gunakan model GPT-3.5 Turbo (unlimited) dari dropdown Model AI di sidebar.'
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Error: ${errorMessage}${suggestion}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      
      // Show different toast based on error type
      if (errorMessage.includes('limit')) {
        toast.error('Model mencapai limit harian. Gunakan GPT-3.5 Turbo!')
      } else {
        toast.error('Gagal mengirim pesan ke AI')
      }
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }



  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Pesan berhasil disalin!')
  }

  const regenerateLastMessage = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      if (lastUserMessage) {
        setMessages(prev => prev.slice(0, -1))
        sendMessage(lastUserMessage.content)
      }
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Halo! Saya Si-JAPIRS AI Assistant 🤖\n\nSaya siap membantu Anda dengan pertanyaan seputar akademik, penelitian, penulisan ilmiah, dan topik pembelajaran lainnya.\n\n💡 Tip: Saat ini menggunakan GPT-3.5 Turbo (unlimited requests). Untuk hasil lebih advanced, coba GPT-5 (limit 5x/hari) dari dropdown Model AI.\n\nSilakan tanyakan apa saja!`,
        timestamp: new Date()
      }
    ])
    toast.success('Chat berhasil direset')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-4 max-w-6xl">
      {/* Back Button */}
      <HeaderBackButton 
        title="AI Consultation" 
        subtitle="Chat dengan AI untuk bantuan akademik"
        className="mb-4"
      />
      
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Mode Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mode Konsultasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {chatModes.map((chatMode) => (
                <button
                  key={chatMode.value}
                  onClick={() => {
                    setMode(chatMode.value)
                    toast.success(`Mode ${chatMode.label} aktif`)
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    mode === chatMode.value
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted border-transparent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <chatMode.icon className={cn("h-5 w-5 mt-0.5", chatMode.color)} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{chatMode.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {chatMode.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* AI Model Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Model AI</CardTitle>
            </CardHeader>
            <CardContent>
              <ModelSelector 
                onModelChange={(model) => {
                  setSelectedModel(model)
                  toast.success(`Model berhasil diganti ke ${model}`)
                }}
              />
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pertanyaan Populer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => sendMessage(question)}
                  disabled={loading}
                >
                  <span className="text-xs line-clamp-2">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearChat}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Si-JAPIRS AI Assistant</CardTitle>
                    <CardDescription>
                      Mode: <Badge variant="outline">{chatModes.find(m => m.value === mode)?.label}</Badge>
                    </CardDescription>
                  </div>
                </div>
                {messages.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={regenerateLastMessage}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
                <div className="py-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "flex gap-3",
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'assistant' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "max-w-[80%] rounded-lg px-4 py-3",
                          message.role === 'user'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.role === 'assistant' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => copyMessage(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {message.role === 'user' && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session?.user?.image || ''} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce" />
                          <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce delay-100" />
                          <div className="h-2 w-2 bg-foreground/40 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pertanyaan Anda..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading || !input.trim()}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2">
                  <Info className="h-3 w-3 inline mr-1" />
                  AI dapat membuat kesalahan. Selalu verifikasi informasi penting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
