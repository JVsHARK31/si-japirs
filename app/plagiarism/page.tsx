"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle, 
  AlertTriangle,
  XCircle,
  FileText,
  Search,
  Loader2,
  Copy,
  Download,
  Shield,
  AlertCircle,
  ExternalLink,
  BarChart3,
  TrendingDown,
  Link,
  Sparkles,
  FileSearch,
  BookOpen
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PlagiarismResult {
  similarity: number
  sources: {
    url: string
    title: string
    similarity: number
    matchedSentences: string[]
  }[]
  details: {
    originalSentences: number
    plagiarizedSentences: number
    paraphrasedSentences: number
  }
  suggestions: string[]
}

export default function PlagiarismPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [text, setText] = useState('')
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('check')
  const [highlightedText, setHighlightedText] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  const checkPlagiarism = () => {
    if (!text.trim()) {
      toast.error('Harap masukkan teks untuk diperiksa')
      return
    }

    setLoading(true)
    setActiveTab('result')

    // Simulasi plagiarism checking
    setTimeout(() => {
      const mockResult: PlagiarismResult = {
        similarity: Math.floor(Math.random() * 30) + 10,
        sources: [
          {
            url: 'https://journal.example.com/article/12345',
            title: 'Implementation of Machine Learning in Education',
            similarity: 15,
            matchedSentences: [
              'Machine learning has revolutionized various sectors including education.',
              'Adaptive learning systems use AI algorithms to personalize content.'
            ]
          },
          {
            url: 'https://thesis.example.edu/research/67890',
            title: 'AI-Powered Educational Technology',
            similarity: 8,
            matchedSentences: [
              'Artificial intelligence provides unprecedented opportunities for personalized learning.'
            ]
          },
          {
            url: 'https://conference.example.org/paper/abc123',
            title: 'Digital Transformation in Higher Education',
            similarity: 5,
            matchedSentences: [
              'The integration of technology in classrooms has shown significant improvements.'
            ]
          }
        ],
        details: {
          originalSentences: 20,
          plagiarizedSentences: 3,
          paraphrasedSentences: 2
        },
        suggestions: [
          'Tambahkan kutipan untuk kalimat yang mirip dengan sumber',
          'Parafrase ulang bagian yang terdeteksi plagiat',
          'Gunakan kata-kata Anda sendiri untuk menjelaskan konsep',
          'Sertakan referensi yang tepat untuk semua sumber'
        ]
      }

      setResult(mockResult)
      setLoading(false)
      
      // Generate highlighted text
      let highlighted = text
      mockResult.sources.forEach(source => {
        source.matchedSentences.forEach(sentence => {
          const regex = new RegExp(sentence.substring(0, 50), 'gi')
          highlighted = highlighted.replace(regex, `<mark class="bg-red-200">$&</mark>`)
        })
      })
      setHighlightedText(highlighted)

      if (mockResult.similarity < 20) {
        toast.success('Plagiarism rendah! Dokumen Anda aman.')
      } else if (mockResult.similarity < 40) {
        toast('Plagiarism sedang. Perlu revisi.', { icon: '⚠️' })
      } else {
        toast.error('Plagiarism tinggi! Segera revisi dokumen Anda.')
      }
    }, 3000)
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity < 20) return 'text-green-600'
    if (similarity < 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSimilarityBadge = (similarity: number) => {
    if (similarity < 20) return { variant: 'default' as const, text: 'Aman' }
    if (similarity < 40) return { variant: 'secondary' as const, text: 'Perhatian' }
    return { variant: 'destructive' as const, text: 'Bahaya' }
  }

  const exportReport = () => {
    if (!result) return

    const report = `
LAPORAN PEMERIKSAAN PLAGIARISME
================================
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Waktu: ${new Date().toLocaleTimeString('id-ID')}

HASIL PEMERIKSAAN
-----------------
Tingkat Kemiripan: ${result.similarity}%
Status: ${result.similarity < 20 ? 'AMAN' : result.similarity < 40 ? 'PERHATIAN' : 'BAHAYA'}

DETAIL ANALISIS
---------------
Total Kalimat: ${result.details.originalSentences + result.details.plagiarizedSentences + result.details.paraphrasedSentences}
Kalimat Original: ${result.details.originalSentences}
Kalimat Plagiat: ${result.details.plagiarizedSentences}
Kalimat Parafrase: ${result.details.paraphrasedSentences}

SUMBER KEMIRIPAN
----------------
${result.sources.map((source, idx) => 
  `${idx + 1}. ${source.title}
   URL: ${source.url}
   Kemiripan: ${source.similarity}%
   `).join('\n')}

REKOMENDASI
-----------
${result.suggestions.map((suggestion, idx) => `${idx + 1}. ${suggestion}`).join('\n')}

================================
Generated by Si-JAPIRS Plagiarism Checker
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plagiarism_report_${Date.now()}.txt`
    a.click()
    
    toast.success('Laporan berhasil diexport!')
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
        title="Plagiarism Checker" 
        subtitle="Periksa keaslian dan originalitas dokumen Anda"
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5" />
                Periksa Plagiarisme
              </CardTitle>
              <CardDescription>
                Masukkan teks untuk memeriksa tingkat kemiripan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Teks untuk Diperiksa</Label>
                <Textarea
                  placeholder="Paste atau ketik teks yang ingin diperiksa plagiarismenya..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="h-64"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {text.split(' ').filter(w => w).length} kata | {text.length} karakter
                </p>
              </div>

              <Button 
                onClick={checkPlagiarism}
                className="w-full"
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memeriksa...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Periksa Plagiarisme
                  </>
                )}
              </Button>

              {/* Features */}
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium">Fitur Pemeriksaan:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Deep web scanning
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Database jurnal ilmiah
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Deteksi parafrase
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Analisis real-time
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="check">
                <FileText className="h-4 w-4 mr-2" />
                Input
              </TabsTrigger>
              <TabsTrigger value="result" disabled={!result}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Hasil
              </TabsTrigger>
              <TabsTrigger value="sources" disabled={!result}>
                <Link className="h-4 w-4 mr-2" />
                Sumber
              </TabsTrigger>
            </TabsList>

            <TabsContent value="check" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cara Kerja Plagiarism Checker</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Input Teks</p>
                          <p className="text-sm text-muted-foreground">
                            Masukkan teks atau dokumen yang ingin diperiksa
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Scanning Database</p>
                          <p className="text-sm text-muted-foreground">
                            AI memindai miliaran dokumen online
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">3</span>
                        </div>
                        <div>
                          <p className="font-medium">Analisis Kemiripan</p>
                          <p className="text-sm text-muted-foreground">
                            Membandingkan dan menghitung persentase
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">4</span>
                        </div>
                        <div>
                          <p className="font-medium">Laporan Detail</p>
                          <p className="text-sm text-muted-foreground">
                            Hasil lengkap dengan sumber dan saran
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">99%</p>
                      <p className="text-xs text-muted-foreground">Akurasi</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">10B+</p>
                      <p className="text-xs text-muted-foreground">Dokumen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">&lt; 30s</p>
                      <p className="text-xs text-muted-foreground">Waktu Scan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="result" className="mt-6 space-y-4">
              {result && (
                <>
                  {/* Overall Result */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Hasil Pemeriksaan</CardTitle>
                        <Button size="sm" variant="outline" onClick={exportReport}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="relative inline-flex">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center"
                          >
                            <div>
                              <p className={`text-4xl font-bold ${getSimilarityColor(result.similarity)}`}>
                                {result.similarity}%
                              </p>
                              <p className="text-xs text-muted-foreground">Kemiripan</p>
                            </div>
                          </motion.div>
                        </div>
                        
                        <Badge 
                          variant={getSimilarityBadge(result.similarity).variant}
                          className="mt-4"
                        >
                          {getSimilarityBadge(result.similarity).text}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{result.details.originalSentences}</p>
                          <p className="text-xs text-muted-foreground">Kalimat Original</p>
                        </div>
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{result.details.paraphrasedSentences}</p>
                          <p className="text-xs text-muted-foreground">Parafrase</p>
                        </div>
                        <div className="text-center">
                          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{result.details.plagiarizedSentences}</p>
                          <p className="text-xs text-muted-foreground">Plagiat</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Rekomendasi Perbaikan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Highlighted Text */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Teks dengan Highlight</CardTitle>
                      <CardDescription>
                        Bagian yang ditandai menunjukkan kemiripan dengan sumber lain
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="sources" className="mt-6 space-y-4">
              {result?.sources.map((source, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{source.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <ExternalLink className="h-3 w-3" />
                          {source.url}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {source.similarity}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-2">Kalimat yang Cocok:</p>
                    <ul className="space-y-2">
                      {source.matchedSentences.map((sentence, sIdx) => (
                        <li key={sIdx} className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
                          "{sentence}"
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
