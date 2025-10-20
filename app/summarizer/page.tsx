"use client"

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  FileText, 
  Upload, 
  Download, 
  BookOpen,
  Brain,
  Sparkles,
  ChevronRight,
  Loader2,
  CheckCircle,
  Copy,
  Share2,
  FileUp,
  File,
  X,
  Zap,
  MessageSquare,
  Hash,
  List,
  Target,
  Eye,
  Languages
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  content?: string
}

interface Summary {
  brief: string
  detailed: string
  keyPoints: string[]
  keywords: string[]
  questions: { question: string; answer: string }[]
}

export default function SummarizerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [summaryLength, setSummaryLength] = useState([50])
  const [activeTab, setActiveTab] = useState('upload')
  const [question, setQuestion] = useState('')
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          content: reader.result as string
        }
        setUploadedFiles(prev => [...prev, newFile])
        setCurrentFile(newFile)
        toast.success(`File ${file.name} berhasil diupload!`)
      }
      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  const generateSummary = async () => {
    if (!currentFile) return
    
    setLoading(true)
    setActiveTab('result')
    
    // Simulasi generate summary
    setTimeout(() => {
      setSummary({
        brief: "Dokumen ini membahas tentang implementasi teknologi AI dalam pendidikan tinggi. Fokus utama adalah pada penggunaan machine learning untuk personalisasi pembelajaran dan meningkatkan hasil akademik mahasiswa.",
        detailed: "Penelitian ini mengeksplorasi berbagai aplikasi kecerdasan buatan (AI) dalam konteks pendidikan tinggi. Studi ini menunjukkan bahwa implementasi AI dapat meningkatkan efektivitas pembelajaran hingga 35%. Metode yang digunakan meliputi adaptive learning systems, automated grading, dan predictive analytics untuk identifikasi mahasiswa yang berisiko drop out. Hasil penelitian menunjukkan peningkatan signifikan dalam engagement mahasiswa dan hasil pembelajaran.",
        keyPoints: [
          "AI meningkatkan personalisasi pembelajaran",
          "Sistem adaptive learning mengurangi dropout rate sebesar 25%",
          "Automated grading menghemat waktu dosen hingga 40%",
          "Predictive analytics membantu intervensi dini",
          "Chatbot AI meningkatkan dukungan mahasiswa 24/7"
        ],
        keywords: ["Artificial Intelligence", "Machine Learning", "Pendidikan Tinggi", "Adaptive Learning", "Personalisasi", "EdTech", "Learning Analytics"],
        questions: [
          {
            question: "Apa manfaat utama implementasi AI dalam pendidikan?",
            answer: "Manfaat utama meliputi personalisasi pembelajaran, efisiensi penilaian, prediksi performa mahasiswa, dan dukungan 24/7 melalui chatbot."
          },
          {
            question: "Bagaimana AI dapat mengurangi dropout rate?",
            answer: "Melalui predictive analytics untuk identifikasi dini mahasiswa berisiko dan intervensi yang tepat waktu."
          }
        ]
      })
      setLoading(false)
      toast.success('Ringkasan berhasil dibuat!')
    }, 3000)
  }

  const askQuestion = () => {
    if (!question.trim()) return
    
    setLoading(true)
    setTimeout(() => {
      const answer = "Berdasarkan dokumen, " + question.toLowerCase().includes('manfaat') 
        ? "AI memberikan berbagai manfaat dalam pendidikan seperti personalisasi pembelajaran, efisiensi penilaian, dan dukungan mahasiswa 24/7."
        : "AI menggunakan algoritma machine learning untuk menganalisis pola belajar mahasiswa dan menyesuaikan materi pembelajaran sesuai kebutuhan individual."
      
      setQaHistory([...qaHistory, { q: question, a: answer }])
      setQuestion('')
      setLoading(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Teks berhasil disalin!')
  }

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
        title="PDF Summarizer & Q&A" 
        subtitle="Ringkas dokumen dan tanya jawab dengan AI"
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Upload Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                {isDragActive ? (
                  <p>Drop file di sini...</p>
                ) : (
                  <div>
                    <p className="text-sm font-medium">Drag & drop file atau klik untuk browse</p>
                    <p className="text-xs text-muted-foreground mt-2">PDF, DOC, DOCX, TXT (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>File Terupload:</Label>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setCurrentFile(file)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        currentFile?.id === file.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      {currentFile?.id === file.id && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Options */}
              {currentFile && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label>Panjang Ringkasan</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-muted-foreground">Singkat</span>
                      <Slider
                        value={summaryLength}
                        onValueChange={setSummaryLength}
                        max={100}
                        step={25}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground">Detail</span>
                    </div>
                  </div>

                  <Button 
                    onClick={generateSummary} 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Ringkasan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="result" disabled={!summary}>
                <BookOpen className="h-4 w-4 mr-2" />
                Ringkasan
              </TabsTrigger>
              <TabsTrigger value="qa" disabled={!summary}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Q&A
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cara Penggunaan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Upload Dokumen</p>
                      <p className="text-sm text-muted-foreground">Upload file PDF, DOC, DOCX, atau TXT yang ingin diringkas</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Atur Preferensi</p>
                      <p className="text-sm text-muted-foreground">Pilih panjang ringkasan sesuai kebutuhan</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Generate & Tanya Jawab</p>
                      <p className="text-sm text-muted-foreground">Dapatkan ringkasan dan ajukan pertanyaan tentang dokumen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="result" className="mt-6 space-y-4">
              {summary && (
                <>
                  {/* Brief Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Ringkasan Singkat
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(summary.brief)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{summary.brief}</p>
                    </CardContent>
                  </Card>

                  {/* Detailed Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Ringkasan Detail
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(summary.detailed)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed">{summary.detailed}</p>
                    </CardContent>
                  </Card>

                  {/* Key Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Poin-Poin Penting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Kata Kunci
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {summary.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tanya Jawab Interaktif</CardTitle>
                  <CardDescription>
                    Ajukan pertanyaan tentang dokumen yang telah diringkas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pre-made Questions */}
                  {summary?.questions && (
                    <div className="space-y-3">
                      <Label>Pertanyaan Tersedia:</Label>
                      {summary.questions.map((qa, idx) => (
                        <div key={idx} className="p-4 bg-muted rounded-lg space-y-2">
                          <p className="font-medium text-sm">{qa.question}</p>
                          <p className="text-sm text-muted-foreground">{qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ask Question */}
                  <div className="space-y-2">
                    <Label>Ajukan Pertanyaan Anda:</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ketik pertanyaan tentang dokumen..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                      />
                      <Button onClick={askQuestion} disabled={loading || !question.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Q&A History */}
                  {qaHistory.length > 0 && (
                    <div className="space-y-3">
                      <Label>Riwayat Tanya Jawab:</Label>
                      {qaHistory.map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs">Q</span>
                            </div>
                            <p className="text-sm font-medium">{item.q}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs">A</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.a}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
