"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  Sparkles, 
  Download, 
  Save,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  Edit3,
  Copy,
  RefreshCw,
  Book,
  Wand2,
  Settings,
  AlertCircle,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Outline {
  id: string
  title: string
  level: number
  content?: string
}

const documentTypes = [
  { value: 'skripsi', label: 'Skripsi' },
  { value: 'jurnal', label: 'Jurnal Ilmiah' },
  { value: 'kti', label: 'Karya Tulis Ilmiah' },
  { value: 'makalah', label: 'Makalah' },
  { value: 'essay', label: 'Essay Akademik' },
  { value: 'proposal', label: 'Proposal Penelitian' },
]

const citationStyles = [
  { value: 'APA', label: 'APA (American Psychological Association)' },
  { value: 'MLA', label: 'MLA (Modern Language Association)' },
  { value: 'IEEE', label: 'IEEE' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Harvard', label: 'Harvard' },
]

const languages = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
]

export default function WriterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeStep, setActiveStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  // Step 1: Basic Info
  const [title, setTitle] = useState('')
  const [documentType, setDocumentType] = useState('skripsi')
  const [field, setField] = useState('')
  const [citationStyle, setCitationStyle] = useState('APA')
  const [language, setLanguage] = useState('id')
  const [targetWords, setTargetWords] = useState('5000')
  
  // Step 2: Outline
  const [outline, setOutline] = useState<Outline[]>([])
  const [editingOutline, setEditingOutline] = useState(false)
  
  // Step 3: Draft
  const [draft, setDraft] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [editingDraft, setEditingDraft] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  const generateOutline = async () => {
    if (!title || !field) {
      toast.error('Mohon isi judul dan bidang studi terlebih dahulu')
      return
    }

    setGenerating(true)
    try {
      const response = await axios.post('/api/ai/writer/outline', {
        title,
        documentType,
        field,
        language
      })

      const generatedOutline = response.data.outline
      setOutline(generatedOutline)
      toast.success('Outline berhasil dibuat!')
      setActiveStep(2)
    } catch (error) {
      console.error('Error generating outline:', error)
      // Use mock data for demo
      const mockOutline: Outline[] = [
        { id: '1', title: 'Abstrak', level: 1 },
        { id: '2', title: 'BAB I: PENDAHULUAN', level: 1 },
        { id: '2.1', title: 'Latar Belakang', level: 2 },
        { id: '2.2', title: 'Rumusan Masalah', level: 2 },
        { id: '2.3', title: 'Tujuan Penelitian', level: 2 },
        { id: '2.4', title: 'Manfaat Penelitian', level: 2 },
        { id: '3', title: 'BAB II: TINJAUAN PUSTAKA', level: 1 },
        { id: '3.1', title: 'Landasan Teori', level: 2 },
        { id: '3.2', title: 'Penelitian Terkait', level: 2 },
        { id: '3.3', title: 'Kerangka Konseptual', level: 2 },
        { id: '4', title: 'BAB III: METODOLOGI', level: 1 },
        { id: '4.1', title: 'Jenis Penelitian', level: 2 },
        { id: '4.2', title: 'Metode Pengumpulan Data', level: 2 },
        { id: '4.3', title: 'Teknik Analisis Data', level: 2 },
        { id: '5', title: 'BAB IV: HASIL DAN PEMBAHASAN', level: 1 },
        { id: '5.1', title: 'Hasil Penelitian', level: 2 },
        { id: '5.2', title: 'Pembahasan', level: 2 },
        { id: '6', title: 'BAB V: KESIMPULAN DAN SARAN', level: 1 },
        { id: '6.1', title: 'Kesimpulan', level: 2 },
        { id: '6.2', title: 'Saran', level: 2 },
        { id: '7', title: 'DAFTAR PUSTAKA', level: 1 },
      ]
      setOutline(mockOutline)
      setActiveStep(2)
    } finally {
      setGenerating(false)
    }
  }

  const generateDraft = async (sectionId?: string) => {
    setGenerating(true)
    try {
      const response = await axios.post('/api/ai/writer/draft', {
        title,
        documentType,
        field,
        citationStyle,
        language,
        outline: outline.map(o => o.title),
        targetWords,
        sectionId
      })

      const generatedDraft = response.data.draft
      setDraft(prev => prev + '\n\n' + generatedDraft)
      toast.success('Draft berhasil dibuat!')
      
      if (!sectionId) {
        setActiveStep(3)
      }
    } catch (error) {
      console.error('Error generating draft:', error)
      // Use mock data for demo
      const mockDraft = `# ${title}

## Abstrak

Penelitian ini bertujuan untuk ${title.toLowerCase()} dalam bidang ${field}. Metode yang digunakan adalah pendekatan kualitatif dengan teknik pengumpulan data melalui observasi, wawancara, dan studi dokumentasi. Hasil penelitian menunjukkan bahwa implementasi sistem ini dapat meningkatkan efisiensi dan efektivitas dalam proses pembelajaran. Kesimpulan dari penelitian ini adalah perlunya pengembangan lebih lanjut untuk mengoptimalkan hasil yang telah dicapai.

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang

Di era digital saat ini, perkembangan teknologi informasi telah membawa perubahan signifikan dalam berbagai aspek kehidupan, termasuk dalam bidang ${field}. ${title} menjadi salah satu topik yang menarik untuk diteliti karena relevansinya dengan kebutuhan saat ini.

Perkembangan teknologi yang pesat mendorong berbagai inovasi dalam ${field}. Hal ini menciptakan peluang sekaligus tantangan yang perlu diatasi melalui penelitian yang komprehensif dan mendalam.

### 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah dalam penelitian ini adalah:
1. Bagaimana implementasi ${title.toLowerCase()} dalam konteks ${field}?
2. Apa saja faktor-faktor yang mempengaruhi keberhasilan implementasi tersebut?
3. Bagaimana dampak implementasi terhadap efektivitas dan efisiensi proses?

### 1.3 Tujuan Penelitian

Penelitian ini bertujuan untuk:
1. Menganalisis implementasi ${title.toLowerCase()} dalam bidang ${field}
2. Mengidentifikasi faktor-faktor kunci keberhasilan
3. Mengevaluasi dampak implementasi terhadap kinerja keseluruhan

### 1.4 Manfaat Penelitian

Manfaat dari penelitian ini meliputi:
- **Manfaat Teoretis**: Menambah khazanah pengetahuan dalam bidang ${field}
- **Manfaat Praktis**: Memberikan rekomendasi implementasi yang dapat diterapkan
- **Manfaat Akademis**: Menjadi referensi untuk penelitian selanjutnya`
      
      setDraft(mockDraft)
      setActiveStep(3)
    } finally {
      setGenerating(false)
    }
  }

  const paraphraseText = async (text: string) => {
    try {
      const response = await axios.post('/api/ai/writer/paraphrase', {
        text,
        tone: 'formal',
        locale: language
      })
      return response.data.paraphrased
    } catch (error) {
      console.error('Error paraphrasing:', error)
      toast.error('Gagal melakukan parafrase')
      return text
    }
  }

  const checkGrammar = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/ai/writer/grammar', {
        text: draft,
        locale: language
      })
      setDraft(response.data.corrected)
      toast.success('Pemeriksaan tata bahasa selesai!')
    } catch (error) {
      console.error('Error checking grammar:', error)
      toast.error('Gagal memeriksa tata bahasa')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/documents/save', {
        title,
        type: documentType,
        content: draft,
        outline,
        metadata: {
          field,
          citationStyle,
          language,
          targetWords
        }
      })
      toast.success('Draft berhasil disimpan!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Gagal menyimpan draft')
    } finally {
      setLoading(false)
    }
  }

  const exportDocument = async (format: 'docx' | 'pdf') => {
    setLoading(true)
    try {
      const response = await axios.post('/api/export', {
        content: draft,
        format,
        title
      }, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${title}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success(`Dokumen berhasil diexport sebagai ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error exporting document:', error)
      toast.error('Gagal mengexport dokumen')
    } finally {
      setLoading(false)
    }
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          AI Penulis Akademik
        </h1>
        <p className="text-muted-foreground mt-2">
          Buat draft akademik berkualitas dengan bantuan AI
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Informasi Dasar', icon: Settings },
            { step: 2, label: 'Outline', icon: Book },
            { step: 3, label: 'Draft & Polish', icon: Edit3 }
          ].map((item, index) => (
            <div key={item.step} className="flex-1 flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: activeStep >= item.step ? 1 : 0.8 }}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  activeStep >= item.step 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-background border-muted-foreground/30'
                }`}
              >
                {activeStep > item.step ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
              </motion.div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  activeStep >= item.step ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </p>
              </div>
              {index < 2 && (
                <div className={`h-0.5 w-full mx-4 ${
                  activeStep > item.step ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Basic Information */}
        {activeStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar Dokumen</CardTitle>
                <CardDescription>
                  Masukkan informasi dasar untuk memulai pembuatan dokumen akademik
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul/Topik *</Label>
                    <Input
                      id="title"
                      placeholder="Contoh: Implementasi Machine Learning untuk Prediksi..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Jenis Dokumen *</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field">Bidang Studi *</Label>
                    <Input
                      id="field"
                      placeholder="Contoh: Teknik Informatika, Manajemen, dll"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citation">Gaya Sitasi</Label>
                    <Select value={citationStyle} onValueChange={setCitationStyle}>
                      <SelectTrigger id="citation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {citationStyles.map(style => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Bahasa</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="words">Target Jumlah Kata</Label>
                    <Input
                      id="words"
                      type="number"
                      placeholder="5000"
                      value={targetWords}
                      onChange={(e) => setTargetWords(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={generateOutline} disabled={generating || !title || !field}>
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Membuat Outline...
                      </>
                    ) : (
                      <>
                        Generate Outline
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Outline */}
        {activeStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Outline Dokumen</CardTitle>
                <CardDescription>
                  Review dan edit outline yang telah dibuat oleh AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {outline.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors ${
                        item.level === 1 ? 'ml-0 font-semibold' : 'ml-8'
                      }`}
                    >
                      {editingOutline ? (
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            setOutline(prev => prev.map(o => 
                              o.id === item.id ? { ...o, title: e.target.value } : o
                            ))
                          }}
                        />
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(1)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingOutline(!editingOutline)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      {editingOutline ? 'Selesai Edit' : 'Edit Outline'}
                    </Button>
                    
                    <Button onClick={() => generateDraft()} disabled={generating}>
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Membuat Draft...
                        </>
                      ) : (
                        <>
                          Generate Draft
                          <Wand2 className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Draft & Polish */}
        {activeStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Draft & Polish</CardTitle>
                <CardDescription>
                  Edit, perbaiki, dan sempurnakan draft Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="space-y-4">
                    <div className="flex justify-end gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={checkGrammar}
                        disabled={loading}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Periksa Grammar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(draft)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="min-h-[500px] font-mono text-sm"
                      placeholder="Draft akan muncul di sini..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="prose prose-sm max-w-none dark:prose-invert min-h-[500px] p-4 border rounded-lg">
                      <div dangerouslySetInnerHTML={{ __html: draft.replace(/\n/g, '<br />') }} />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep(2)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Kembali ke Outline
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={saveDraft}
                      disabled={loading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Draft
                    </Button>
                    
                    <Button
                      onClick={() => exportDocument('docx')}
                      disabled={loading}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export DOCX
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
