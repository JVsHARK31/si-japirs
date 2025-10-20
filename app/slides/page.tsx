"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  PresentationIcon, 
  Sparkles, 
  Download,
  Plus,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  Type,
  List,
  BarChart3,
  Palette,
  Layout,
  Play,
  Copy,
  Share2,
  Eye,
  Wand2,
  Layers
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Slide {
  id: string
  title: string
  content: string
  type: 'title' | 'content' | 'bullets' | 'image' | 'chart' | 'conclusion'
  notes?: string
  image?: string
  bulletPoints?: string[]
  chartData?: any
}

const slideTemplates = [
  { value: 'academic', label: 'Akademik', icon: '🎓' },
  { value: 'business', label: 'Bisnis', icon: '💼' },
  { value: 'creative', label: 'Kreatif', icon: '🎨' },
  { value: 'minimal', label: 'Minimalis', icon: '⚪' },
  { value: 'modern', label: 'Modern', icon: '✨' },
  { value: 'scientific', label: 'Ilmiah', icon: '🔬' }
]

const colorThemes = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#60A5FA' },
  { name: 'Green', primary: '#10B981', secondary: '#34D399' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#A78BFA' },
  { name: 'Red', primary: '#EF4444', secondary: '#F87171' },
  { name: 'Dark', primary: '#1F2937', secondary: '#374151' }
]

export default function SlidesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: '1',
      title: 'Judul Presentasi',
      content: 'Subtitle atau deskripsi singkat',
      type: 'title',
      notes: 'Catatan pembicara untuk slide pembuka'
    }
  ])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [topic, setTopic] = useState('')
  const [template, setTemplate] = useState('academic')
  const [slideCount, setSlideCount] = useState([10])
  const [colorTheme, setColorTheme] = useState(colorThemes[0])
  const [loading, setLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  const generatePresentation = () => {
    if (!topic) {
      toast.error('Harap masukkan topik presentasi')
      return
    }

    setIsGenerating(true)
    setLoading(true)

    setTimeout(() => {
      const generatedSlides: Slide[] = [
        {
          id: '1',
          title: topic,
          content: 'Presented by ' + (session?.user?.name || 'User'),
          type: 'title',
          notes: 'Perkenalan diri dan sambutan pembuka'
        },
        {
          id: '2',
          title: 'Agenda',
          content: '',
          type: 'bullets',
          bulletPoints: [
            'Latar Belakang',
            'Tujuan dan Manfaat',
            'Metodologi',
            'Hasil dan Pembahasan',
            'Kesimpulan'
          ],
          notes: 'Overview materi yang akan dibahas'
        },
        {
          id: '3',
          title: 'Latar Belakang',
          content: 'Pentingnya topik ini dalam konteks saat ini',
          type: 'content',
          notes: 'Jelaskan konteks dan relevansi'
        },
        {
          id: '4',
          title: 'Rumusan Masalah',
          content: '',
          type: 'bullets',
          bulletPoints: [
            'Identifikasi masalah utama',
            'Gap penelitian yang ada',
            'Urgensi penyelesaian masalah'
          ]
        },
        {
          id: '5',
          title: 'Tujuan',
          content: '',
          type: 'bullets',
          bulletPoints: [
            'Tujuan umum penelitian',
            'Tujuan khusus 1',
            'Tujuan khusus 2',
            'Tujuan khusus 3'
          ]
        },
        {
          id: '6',
          title: 'Metodologi',
          content: 'Pendekatan dan metode yang digunakan',
          type: 'chart',
          chartData: {
            labels: ['Research', 'Design', 'Implementation', 'Testing'],
            values: [25, 30, 35, 10]
          }
        },
        {
          id: '7',
          title: 'Hasil Penelitian',
          content: 'Data dan temuan utama',
          type: 'chart',
          chartData: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            values: [65, 75, 85, 92]
          }
        },
        {
          id: '8',
          title: 'Pembahasan',
          content: 'Analisis mendalam terhadap hasil penelitian',
          type: 'content',
          notes: 'Hubungkan dengan teori dan penelitian sebelumnya'
        },
        {
          id: '9',
          title: 'Kesimpulan',
          content: '',
          type: 'bullets',
          bulletPoints: [
            'Ringkasan temuan utama',
            'Implikasi praktis',
            'Kontribusi penelitian',
            'Rekomendasi'
          ]
        },
        {
          id: '10',
          title: 'Terima Kasih',
          content: 'Pertanyaan & Diskusi',
          type: 'conclusion',
          notes: 'Siapkan untuk sesi tanya jawab'
        }
      ]

      setSlides(generatedSlides.slice(0, slideCount[0]))
      setIsGenerating(false)
      setLoading(false)
      toast.success('Presentasi berhasil dibuat!')
    }, 3000)
  }

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: 'Slide Baru',
      content: 'Konten slide',
      type: 'content'
    }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) {
      toast.error('Minimal harus ada 1 slide')
      return
    }
    const newSlides = slides.filter((_, i) => i !== index)
    setSlides(newSlides)
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1)
    }
  }

  const updateSlide = (index: number, updatedSlide: Partial<Slide>) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], ...updatedSlide }
    setSlides(newSlides)
  }

  const exportPresentation = () => {
    const presentationData = {
      title: topic || 'Presentasi',
      template,
      theme: colorTheme.name,
      slides,
      createdAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(presentationData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${topic || 'presentasi'}_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Presentasi berhasil diexport!')
  }

  const currentSlide = slides[currentSlideIndex]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <HeaderBackButton 
        title="Presentation Generator" 
        subtitle="Buat slide presentasi otomatis dengan AI"
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Generate New */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Presentasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Topik Presentasi</Label>
                <Input
                  placeholder="Contoh: Implementasi AI dalam Pendidikan"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <Label>Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {slideTemplates.map((temp) => (
                      <SelectItem key={temp.value} value={temp.value}>
                        <span className="flex items-center gap-2">
                          <span>{temp.icon}</span>
                          {temp.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Jumlah Slide: {slideCount[0]}</Label>
                <Slider
                  value={slideCount}
                  onValueChange={setSlideCount}
                  min={5}
                  max={20}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Tema Warna</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setColorTheme(theme)}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        colorTheme.name === theme.name ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: theme.primary }}
                      title={theme.name}
                    />
                  ))}
                </div>
              </div>

              <Button 
                onClick={generatePresentation} 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Slides
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Slide Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Slides ({slides.length})</span>
                <Button size="sm" variant="outline" onClick={addSlide}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentSlideIndex === index ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {slide.title}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSlide(index)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Slide Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview Slide</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPresentationMode(!presentationMode)}
                  >
                    {presentationMode ? <Eye className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportPresentation}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Slide Preview Area */}
              <div 
                className="aspect-video bg-gradient-to-br rounded-lg p-8 flex flex-col justify-center items-center text-white relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 100%)`
                }}
              >
                {/* Slide Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full flex flex-col justify-center items-center text-center"
                  >
                    {currentSlide?.type === 'title' && (
                      <>
                        <h1 className="text-4xl font-bold mb-4">{currentSlide.title}</h1>
                        <p className="text-xl opacity-90">{currentSlide.content}</p>
                      </>
                    )}

                    {currentSlide?.type === 'content' && (
                      <>
                        <h2 className="text-3xl font-bold mb-6">{currentSlide.title}</h2>
                        <p className="text-lg max-w-2xl">{currentSlide.content}</p>
                      </>
                    )}

                    {currentSlide?.type === 'bullets' && (
                      <>
                        <h2 className="text-3xl font-bold mb-6">{currentSlide.title}</h2>
                        <ul className="text-left space-y-3">
                          {currentSlide.bulletPoints?.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-xl">•</span>
                              <span className="text-lg">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {currentSlide?.type === 'chart' && (
                      <>
                        <h2 className="text-3xl font-bold mb-6">{currentSlide.title}</h2>
                        <div className="w-full max-w-md h-48 bg-white/10 rounded-lg flex items-end justify-around p-4">
                          {currentSlide.chartData?.values.map((value: number, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              <div 
                                className="w-12 bg-white/70 rounded-t"
                                style={{ height: `${value * 1.5}px` }}
                              />
                              <span className="text-xs">{currentSlide.chartData?.labels[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {currentSlide?.type === 'conclusion' && (
                      <>
                        <h1 className="text-4xl font-bold mb-4">{currentSlide.title}</h1>
                        <p className="text-xl opacity-90">{currentSlide.content}</p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Slide Number */}
                <div className="absolute bottom-4 right-4 text-sm opacity-70">
                  {currentSlideIndex + 1} / {slides.length}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === slides.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Slide Editor */}
          {currentSlide && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Slide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Judul Slide</Label>
                  <Input
                    value={currentSlide.title}
                    onChange={(e) => updateSlide(currentSlideIndex, { title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tipe Slide</Label>
                  <Select
                    value={currentSlide.type}
                    onValueChange={(value: any) => updateSlide(currentSlideIndex, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title Slide</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="bullets">Bullet Points</SelectItem>
                      <SelectItem value="chart">Chart</SelectItem>
                      <SelectItem value="conclusion">Conclusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentSlide.type !== 'bullets' && currentSlide.type !== 'chart' && (
                  <div>
                    <Label>Konten</Label>
                    <Textarea
                      value={currentSlide.content}
                      onChange={(e) => updateSlide(currentSlideIndex, { content: e.target.value })}
                      rows={4}
                    />
                  </div>
                )}

                {currentSlide.type === 'bullets' && (
                  <div>
                    <Label>Bullet Points (satu per baris)</Label>
                    <Textarea
                      value={currentSlide.bulletPoints?.join('\n') || ''}
                      onChange={(e) => updateSlide(currentSlideIndex, { 
                        bulletPoints: e.target.value.split('\n').filter(p => p.trim()) 
                      })}
                      rows={5}
                    />
                  </div>
                )}

                <div>
                  <Label>Catatan Pembicara</Label>
                  <Textarea
                    value={currentSlide.notes || ''}
                    onChange={(e) => updateSlide(currentSlideIndex, { notes: e.target.value })}
                    rows={3}
                    placeholder="Catatan untuk membantu presentasi..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
