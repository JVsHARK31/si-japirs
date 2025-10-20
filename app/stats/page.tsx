"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDropzone } from 'react-dropzone'
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Upload,
  Download,
  FileSpreadsheet,
  Calculator,
  Loader2,
  Info,
  AlertCircle,
  CheckCircle,
  Database,
  Sigma,
  Activity,
  Target,
  Sparkles,
  FileText,
  Copy
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Dataset {
  name: string
  data: any[]
  columns: string[]
  rows: number
}

interface AnalysisResult {
  descriptive: {
    mean: number
    median: number
    mode: number
    stdDev: number
    variance: number
    min: number
    max: number
    range: number
    count: number
  }
  correlation?: number[][]
  regression?: {
    equation: string
    r2: number
    coefficients: number[]
  }
  hypothesis?: {
    tValue: number
    pValue: number
    significant: boolean
    conclusion: string
  }
  visualization?: {
    type: string
    data: any
  }
}

const analysisTypes = [
  { value: 'descriptive', label: 'Statistik Deskriptif', icon: Calculator },
  { value: 'correlation', label: 'Analisis Korelasi', icon: Activity },
  { value: 'regression', label: 'Regresi Linear', icon: TrendingUp },
  { value: 'hypothesis', label: 'Uji Hipotesis', icon: Target },
  { value: 'anova', label: 'ANOVA', icon: BarChart3 },
  { value: 'timeseries', label: 'Time Series', icon: LineChart }
]

export default function StatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [analysisType, setAnalysisType] = useState('descriptive')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')
  const [manualData, setManualData] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Parse CSV
          const text = e.target?.result as string
          const lines = text.split('\n').filter(line => line.trim())
          const headers = lines[0].split(',').map(h => h.trim())
          const data = lines.slice(1).map(line => {
            const values = line.split(',')
            return headers.reduce((obj, header, index) => {
              obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index])
              return obj
            }, {} as any)
          })

          setDataset({
            name: file.name,
            data,
            columns: headers,
            rows: data.length
          })
          setActiveTab('analysis')
          toast.success('Data berhasil diupload!')
        } catch (error) {
          toast.error('Error parsing file. Pastikan format CSV valid.')
        }
      }
      reader.readAsText(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  })

  const processManualData = () => {
    try {
      const lines = manualData.trim().split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        toast.error('Minimal harus ada header dan 1 baris data')
        return
      }

      const headers = lines[0].split(/[,\t]/).map(h => h.trim())
      const data = lines.slice(1).map(line => {
        const values = line.split(/[,\t]/)
        return headers.reduce((obj, header, index) => {
          obj[header] = isNaN(Number(values[index])) ? values[index] : Number(values[index])
          return obj
        }, {} as any)
      })

      setDataset({
        name: 'Manual Input',
        data,
        columns: headers,
        rows: data.length
      })
      setActiveTab('analysis')
      toast.success('Data berhasil diproses!')
    } catch (error) {
      toast.error('Error parsing data. Periksa format input.')
    }
  }

  const runAnalysis = () => {
    if (!dataset) {
      toast.error('Upload data terlebih dahulu')
      return
    }

    setLoading(true)
    
    // Simulasi analisis
    setTimeout(() => {
      const numericColumns = dataset.columns.filter(col => 
        dataset.data.every(row => !isNaN(Number(row[col])))
      )
      
      if (numericColumns.length === 0) {
        toast.error('Tidak ada kolom numerik untuk dianalisis')
        setLoading(false)
        return
      }

      const firstNumericCol = numericColumns[0]
      const values = dataset.data.map(row => Number(row[firstNumericCol]))
      
      // Calculate descriptive statistics
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const sorted = [...values].sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      const min = Math.min(...values)
      const max = Math.max(...values)
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
      const stdDev = Math.sqrt(variance)

      const mockResult: AnalysisResult = {
        descriptive: {
          mean: Number(mean.toFixed(2)),
          median: Number(median.toFixed(2)),
          mode: Number(values[0].toFixed(2)),
          stdDev: Number(stdDev.toFixed(2)),
          variance: Number(variance.toFixed(2)),
          min,
          max,
          range: max - min,
          count: values.length
        }
      }

      // Add analysis-specific results
      if (analysisType === 'correlation') {
        mockResult.correlation = [
          [1.00, 0.85, 0.72],
          [0.85, 1.00, 0.68],
          [0.72, 0.68, 1.00]
        ]
      } else if (analysisType === 'regression') {
        mockResult.regression = {
          equation: 'y = 2.5x + 10.3',
          r2: 0.89,
          coefficients: [10.3, 2.5]
        }
      } else if (analysisType === 'hypothesis') {
        mockResult.hypothesis = {
          tValue: 2.45,
          pValue: 0.018,
          significant: true,
          conclusion: 'Tolak H0. Terdapat perbedaan signifikan pada α = 0.05'
        }
      }

      mockResult.visualization = {
        type: 'histogram',
        data: {
          labels: ['0-10', '10-20', '20-30', '30-40', '40-50'],
          values: [5, 12, 18, 10, 8]
        }
      }

      setResult(mockResult)
      setLoading(false)
      setActiveTab('results')
      toast.success('Analisis selesai!')
    }, 2000)
  }

  const exportResults = () => {
    if (!result) return

    const report = `
LAPORAN ANALISIS STATISTIK
===========================
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Dataset: ${dataset?.name}
Tipe Analisis: ${analysisTypes.find(t => t.value === analysisType)?.label}

STATISTIK DESKRIPTIF
--------------------
Mean: ${result.descriptive.mean}
Median: ${result.descriptive.median}
Mode: ${result.descriptive.mode}
Std Dev: ${result.descriptive.stdDev}
Variance: ${result.descriptive.variance}
Min: ${result.descriptive.min}
Max: ${result.descriptive.max}
Range: ${result.descriptive.range}
Count: ${result.descriptive.count}

${result.regression ? `
ANALISIS REGRESI
----------------
Persamaan: ${result.regression.equation}
R²: ${result.regression.r2}
Koefisien: ${result.regression.coefficients.join(', ')}
` : ''}

${result.hypothesis ? `
UJI HIPOTESIS
-------------
t-Value: ${result.hypothesis.tValue}
p-Value: ${result.hypothesis.pValue}
Signifikan: ${result.hypothesis.significant ? 'Ya' : 'Tidak'}
Kesimpulan: ${result.hypothesis.conclusion}
` : ''}

===========================
Generated by Si-JAPIRS Statistics
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statistical_analysis_${Date.now()}.txt`
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
        title="Statistical Analysis" 
        subtitle="Analisis data dan statistik untuk penelitian"
        className="mb-6"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Data Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Input Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="manual">Input Manual</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                      isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop file di sini...' : 'Drag & drop atau klik'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV, XLS, XLSX (Max 5MB)
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="manual">
                  <div className="space-y-2">
                    <Label>Paste Data (CSV format)</Label>
                    <Textarea
                      placeholder="Header1,Header2,Header3
Value1,Value2,Value3
Value4,Value5,Value6"
                      value={manualData}
                      onChange={(e) => setManualData(e.target.value)}
                      className="h-32 font-mono text-xs"
                    />
                    <Button 
                      onClick={processManualData}
                      className="w-full"
                      disabled={!manualData.trim()}
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Process Data
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Dataset Info */}
          {dataset && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dataset Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nama:</span>
                  <span className="font-medium">{dataset.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Baris:</span>
                  <span className="font-medium">{dataset.rows}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kolom:</span>
                  <span className="font-medium">{dataset.columns.length}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Variabel:</p>
                  <div className="flex flex-wrap gap-1">
                    {dataset.columns.map((col, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {col}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tipe Analisis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysisTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setAnalysisType(type.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    analysisType === type.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:bg-muted'
                  }`}
                >
                  <type.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Button 
            onClick={runAnalysis}
            className="w-full"
            disabled={!dataset || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Data
              </TabsTrigger>
              <TabsTrigger value="analysis" disabled={!dataset}>
                <Calculator className="h-4 w-4 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Upload dataset Anda dalam format CSV, XLS, atau XLSX untuk memulai analisis statistik.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <h3 className="font-medium">Format Data:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Baris pertama harus berisi nama kolom/variabel
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Setiap baris berikutnya adalah satu observasi
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Pisahkan nilai dengan koma (CSV) atau tab
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Gunakan titik (.) untuk desimal
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Contoh Format:</p>
                    <pre className="text-xs font-mono">
{`Age,Score,Group
23,85,A
25,90,B
22,78,A
24,88,B`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6">
              {dataset && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                    <CardDescription>
                      Showing first 10 rows of {dataset.rows} total rows
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">#</th>
                            {dataset.columns.map((col, idx) => (
                              <th key={idx} className="text-left p-2 font-medium">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dataset.data.slice(0, 10).map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b">
                              <td className="p-2 text-muted-foreground">{rowIdx + 1}</td>
                              {dataset.columns.map((col, colIdx) => (
                                <td key={colIdx} className="p-2">
                                  {row[col]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {dataset.rows > 10 && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        ... and {dataset.rows - 10} more rows
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="mt-6 space-y-4">
              {result && (
                <>
                  {/* Descriptive Statistics */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Statistik Deskriptif</CardTitle>
                        <Button size="sm" variant="outline" onClick={exportResults}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-primary">{result.descriptive.mean}</p>
                          <p className="text-xs text-muted-foreground">Mean</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-primary">{result.descriptive.median}</p>
                          <p className="text-xs text-muted-foreground">Median</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-primary">{result.descriptive.stdDev}</p>
                          <p className="text-xs text-muted-foreground">Std Dev</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{result.descriptive.min}</p>
                          <p className="text-xs text-muted-foreground">Min</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{result.descriptive.max}</p>
                          <p className="text-xs text-muted-foreground">Max</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{result.descriptive.range}</p>
                          <p className="text-xs text-muted-foreground">Range</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Regression Results */}
                  {result.regression && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Hasil Regresi Linear</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg text-center">
                            <p className="text-lg font-mono font-semibold">{result.regression.equation}</p>
                            <p className="text-sm text-muted-foreground mt-1">Persamaan Regresi</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <p className="text-2xl font-bold text-primary">{result.regression.r2}</p>
                              <p className="text-xs text-muted-foreground">R² Score</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <p className="text-sm font-mono">{result.regression.coefficients.join(', ')}</p>
                              <p className="text-xs text-muted-foreground">Koefisien</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hypothesis Test Results */}
                  {result.hypothesis && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Hasil Uji Hipotesis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <p className="text-2xl font-bold">{result.hypothesis.tValue}</p>
                              <p className="text-xs text-muted-foreground">t-Value</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <p className="text-2xl font-bold">{result.hypothesis.pValue}</p>
                              <p className="text-xs text-muted-foreground">p-Value</p>
                            </div>
                          </div>
                          <Alert className={result.hypothesis.significant ? 'border-green-500' : 'border-yellow-500'}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Kesimpulan:</strong> {result.hypothesis.conclusion}
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Visualization */}
                  {result.visualization && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Visualisasi Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-end justify-around p-4 bg-muted rounded-lg">
                          {result.visualization?.data?.values?.map((value: number, idx: number) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              <div 
                                className="w-12 bg-primary rounded-t transition-all hover:bg-primary/80"
                                style={{ height: `${(value / Math.max(...(result.visualization?.data?.values || [1]))) * 200}px` }}
                              />
                              <span className="text-xs">{result.visualization?.data?.labels?.[idx]}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
