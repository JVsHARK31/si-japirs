"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Loader2, 
  BookOpen,
  Copy,
  Download,
  ExternalLink,
  Calendar,
  Users,
  Quote,
  FileText,
  Filter,
  ChevronRight,
  Star,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { scholarAPI, type ScholarResult } from '@/lib/scholar'

const citationStyles = [
  { value: 'APA', label: 'APA' },
  { value: 'MLA', label: 'MLA' },
  { value: 'IEEE', label: 'IEEE' },
  { value: 'BibTeX', label: 'BibTeX' },
]

export default function ResearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [query, setQuery] = useState('')
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')
  const [language, setLanguage] = useState('id')
  const [citationStyle, setCitationStyle] = useState('APA')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScholarResult[]>([])
  const [savedCitations, setSavedCitations] = useState<ScholarResult[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  useEffect(() => {
    // Load saved citations from localStorage
    const saved = localStorage.getItem('savedCitations')
    if (saved) {
      setSavedCitations(JSON.parse(saved))
    }
  }, [])

  const searchScholar = async () => {
    if (!query.trim()) {
      toast.error('Masukkan kata kunci pencarian')
      return
    }

    setLoading(true)
    try {
      const searchResults = await scholarAPI.search({
        query,
        yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
        yearTo: yearTo ? parseInt(yearTo) : undefined,
        language,
        limit: 20
      })
      
      setResults(searchResults)
      toast.success(`Ditemukan ${searchResults.length} hasil`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Gagal melakukan pencarian')
    } finally {
      setLoading(false)
    }
  }

  const saveCitation = (result: ScholarResult) => {
    const newSaved = [...savedCitations, result]
    setSavedCitations(newSaved)
    localStorage.setItem('savedCitations', JSON.stringify(newSaved))
    toast.success('Sitasi berhasil disimpan')
  }

  const removeCitation = (index: number) => {
    const newSaved = savedCitations.filter((_, i) => i !== index)
    setSavedCitations(newSaved)
    localStorage.setItem('savedCitations', JSON.stringify(newSaved))
    toast.success('Sitasi dihapus')
  }

  const copyCitation = async (result: ScholarResult) => {
    const citation = await scholarAPI.getCitation(result, citationStyle as any)
    navigator.clipboard.writeText(citation)
    toast.success('Sitasi berhasil disalin')
  }

  const exportAllCitations = async () => {
    if (savedCitations.length === 0) {
      toast.error('Tidak ada sitasi yang disimpan')
      return
    }

    let allCitations = ''
    for (const result of savedCitations) {
      const citation = await scholarAPI.getCitation(result, citationStyle as any)
      allCitations += citation + '\n\n'
    }

    const blob = new Blob([allCitations], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `citations_${citationStyle.toLowerCase()}.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    toast.success('Sitasi berhasil diexport')
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
          <Search className="h-8 w-8 text-primary" />
          Research Helper
        </h1>
        <p className="text-muted-foreground mt-2">
          Cari referensi ilmiah dan generate sitasi otomatis
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Pencarian
          </TabsTrigger>
          <TabsTrigger value="saved">
            <BookOpen className="mr-2 h-4 w-4" />
            Sitasi Tersimpan ({savedCitations.length})
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle>Cari Referensi Ilmiah</CardTitle>
              <CardDescription>
                Temukan paper, jurnal, dan publikasi akademik dari berbagai sumber
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan kata kunci pencarian..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchScholar()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button onClick={searchScholar} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="yearFrom">Tahun Mulai</Label>
                        <Input
                          id="yearFrom"
                          type="number"
                          placeholder="2020"
                          value={yearFrom}
                          onChange={(e) => setYearFrom(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearTo">Tahun Akhir</Label>
                        <Input
                          id="yearTo"
                          type="number"
                          placeholder="2024"
                          value={yearTo}
                          onChange={(e) => setYearTo(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Bahasa</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="id">Indonesia</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Citation Style Selector */}
              <div className="flex items-center gap-2">
                <Label>Format Sitasi:</Label>
                <div className="flex gap-2">
                  {citationStyles.map(style => (
                    <Button
                      key={style.value}
                      variant={citationStyle === style.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCitationStyle(style.value)}
                    >
                      {style.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Hasil Pencarian</CardTitle>
                <CardDescription>
                  Ditemukan {results.length} referensi yang relevan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg leading-tight flex-1">
                            {result.link ? (
                              <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors flex items-start gap-2"
                              >
                                {result.title}
                                <ExternalLink className="h-4 w-4 mt-1 flex-shrink-0" />
                              </a>
                            ) : (
                              result.title
                            )}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveCitation(result)}
                            disabled={savedCitations.some(s => s.title === result.title)}
                          >
                            <Star className={`h-4 w-4 ${
                              savedCitations.some(s => s.title === result.title) 
                                ? 'fill-yellow-500 text-yellow-500' 
                                : ''
                            }`} />
                          </Button>
                        </div>

                        {/* Authors */}
                        {result.authors && result.authors.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{result.authors.join(', ')}</span>
                          </div>
                        )}

                        {/* Publication Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {result.publication && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>{result.publication}</span>
                            </div>
                          )}
                          {result.year && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{result.year}</span>
                            </div>
                          )}
                          {result.citedBy && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>Dikutip {result.citedBy} kali</span>
                            </div>
                          )}
                        </div>

                        {/* Snippet */}
                        {result.snippet && (
                          <p className="text-sm text-muted-foreground italic">
                            "{result.snippet}"
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyCitation(result)}
                          >
                            <Quote className="mr-2 h-4 w-4" />
                            Copy {citationStyle}
                          </Button>
                          {result.link && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={result.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Buka Paper
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && query && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Belum ada hasil pencarian. Coba kata kunci lain.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Citations Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sitasi Tersimpan</CardTitle>
              <CardDescription>
                Kelola referensi yang telah Anda simpan
              </CardDescription>
              {savedCitations.length > 0 && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={exportAllCitations}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Semua ({citationStyle})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSavedCitations([])
                      localStorage.removeItem('savedCitations')
                      toast.success('Semua sitasi dihapus')
                    }}
                  >
                    Hapus Semua
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {savedCitations.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Belum ada sitasi yang disimpan. Lakukan pencarian dan simpan referensi yang relevan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCitations.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg"
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold">{result.title}</h3>
                        {result.authors && (
                          <p className="text-sm text-muted-foreground">
                            {result.authors.join(', ')} • {result.year}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyCitation(result)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy {citationStyle}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCitation(index)}
                          >
                            Hapus
                          </Button>
                        </div>
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
  )
}
