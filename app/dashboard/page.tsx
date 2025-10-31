"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeaderBackButton } from '@/components/back-button'
import { Progress } from '@/components/ui/progress'
import { LogoutButton } from '@/components/logout-button'
import {
  FileText,
  BookOpen,
  Search,
  PresentationIcon,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Loader2,
  Calculator,
  LogOut
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Task {
  id: string
  title: string
  dueAt: Date | null
  status: 'pending' | 'in_progress' | 'completed'
  category: string
}

interface RecentJob {
  id: string
  type: string
  title: string
  status: string
  createdAt: Date
}

const quickActions = [
  { icon: FileText, label: 'Tulis Draft Baru', href: '/writer', color: 'text-blue-500' },
  { icon: BookOpen, label: 'Upload PDF', href: '/summarizer', color: 'text-green-500' },
  { icon: Search, label: 'Cari Referensi', href: '/research', color: 'text-purple-500' },
  { icon: Calculator, label: 'Solve Exercises', href: '/exercises', color: 'text-orange-500' },
  { icon: MessageSquare, label: 'Chat AI', href: '/consult', color: 'text-pink-500' }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [stats, setStats] = useState({
    totalDocuments: 0,
    completedTasks: 0,
    totalCitations: 0,
    analysisRun: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in')
    }
  }, [status, router])

  useEffect(() => {
    // Simulate loading data
    if (session?.user) {
      setTimeout(() => {
        setTasks([
          {
            id: '1',
            title: 'Submit Proposal Skripsi',
            dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'in_progress',
            category: 'tugas'
          },
          {
            id: '2',
            title: 'Revisi Bab 2 - Tinjauan Pustaka',
            dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'pending',
            category: 'tugas'
          },
          {
            id: '3',
            title: 'Seminar Progress',
            dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'pending',
            category: 'seminar'
          }
        ])

        setRecentJobs([
          {
            id: '1',
            type: 'summarize',
            title: 'Ringkasan Paper Machine Learning',
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: '2',
            type: 'generate',
            title: 'Draft Bab 3 Metodologi',
            status: 'completed',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ])

        setStats({
          totalDocuments: 12,
          completedTasks: 8,
          totalCitations: 45,
          analysisRun: 6
        })

        setLoading(false)
      }, 1000)
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const completionRate = tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <HeaderBackButton 
          homeButton={true}
          label="Home"
          className="mb-4"
        />
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Selamat datang, {session.user.name}! 👋
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link href="/writer" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Dokumen Baru
                </Button>
              </Link>
              <LogoutButton 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                showIcon={true}
                showText={true}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 mb-6 sm:mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Dokumen</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">+2 minggu ini</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Tugas Selesai</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{stats.completedTasks}</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sitasi</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCitations}</div>
              <p className="text-xs text-muted-foreground">Dari 8 paper</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analisis Data</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.analysisRun}</div>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-3 pt-6">
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                    <span className="font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tugas Mendatang</span>
                  <Link href="/tasks">
                    <Button variant="ghost" size="sm">
                      Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  {pendingTasks.length} tugas menunggu penyelesaian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Belum ada tugas terjadwal
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {task.status === 'in_progress' ? (
                            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                          ) : (
                            <div className="h-2 w-2 bg-gray-400 rounded-full" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {task.dueAt ? formatDate(task.dueAt) : 'Tidak ada deadline'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {task.dueAt && new Date(task.dueAt).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000 && (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Aktivitas Terbaru</span>
                  <Link href="/history">
                    <Button variant="ghost" size="sm">
                      Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  Pekerjaan AI yang telah diselesaikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Belum ada aktivitas terbaru
                    </p>
                  ) : (
                    recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          {job.type === 'summarize' ? (
                            <BookOpen className="h-4 w-4 text-green-500" />
                          ) : job.type === 'generate' ? (
                            <FileText className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{job.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formatDate(job.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {job.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Productivity Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tips Produktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Gunakan fitur AI Writer untuk membuat outline terlebih dahulu sebelum menulis draft lengkap. 
                Ini akan membantu Anda tetap fokus dan terorganisir dalam penulisan akademik.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
