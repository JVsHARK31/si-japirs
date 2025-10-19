"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  FileText, 
  Search, 
  PresentationIcon, 
  CheckCircle, 
  BarChart3, 
  MessageSquare,
  Sparkles,
  Users,
  Award,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: "AI Penulis Akademik",
    description: "Generate outline, draft, dan perbaiki tata bahasa dengan AI",
    href: "/writer",
    color: "text-blue-500"
  },
  {
    icon: BookOpen,
    title: "Ringkasan & Pemahaman",
    description: "Upload PDF dan dapatkan ringkasan serta Q&A interaktif",
    href: "/summarizer",
    color: "text-green-500"
  },
  {
    icon: Search,
    title: "Research Helper",
    description: "Cari referensi dan generate sitasi otomatis",
    href: "/research",
    color: "text-purple-500"
  },
  {
    icon: PresentationIcon,
    title: "Presentasi & Visualisasi",
    description: "Buat slide presentasi dan diagram otomatis",
    href: "/slides",
    color: "text-orange-500"
  },
  {
    icon: CheckCircle,
    title: "Cek Plagiarisme",
    description: "Deteksi kemiripan dan dapatkan saran revisi",
    href: "/plagiarism",
    color: "text-red-500"
  },
  {
    icon: BarChart3,
    title: "Analisis Data",
    description: "Statistik dan analisis data untuk penelitian",
    href: "/stats",
    color: "text-indigo-500"
  },
  {
    icon: MessageSquare,
    title: "Konsultasi AI",
    description: "Chat dengan AI untuk bantuan akademik",
    href: "/consult",
    color: "text-pink-500"
  },
  {
    icon: Sparkles,
    title: "Dashboard Akademik",
    description: "Kelola tugas, deadline, dan aktivitas",
    href: "/dashboard",
    color: "text-yellow-500"
  }
]

const stats = [
  { label: "Pengguna Aktif", value: "10,000+" },
  { label: "Dokumen Diproses", value: "50,000+" },
  { label: "Universitas Partner", value: "100+" },
  { label: "Tingkat Kepuasan", value: "98%" }
]

const testimonials = [
  {
    name: "Rina Pratiwi",
    role: "Mahasiswa S1 Teknik Informatika",
    content: "Si-JAPIRS sangat membantu saya menyelesaikan skripsi tepat waktu. Fitur AI Writer-nya luar biasa!",
    avatar: "/avatar1.jpg"
  },
  {
    name: "Dr. Ahmad Yani",
    role: "Dosen Fakultas Ekonomi",
    content: "Tool yang sangat berguna untuk membantu mahasiswa dalam penulisan akademik. Highly recommended!",
    avatar: "/avatar2.jpg"
  },
  {
    name: "Budi Santoso",
    role: "Mahasiswa S2 Manajemen",
    content: "Fitur analisis data dan plagiarism checker sangat membantu dalam penelitian saya.",
    avatar: "/avatar3.jpg"
  }
]

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Si-JAPIRS Logo"
              width={32}
              height={32}
              className="rounded-lg sm:w-10 sm:h-10"
            />
            <span className="font-heading text-lg sm:text-xl font-bold">Si-JAPIRS</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="sm" className="sm:size-default">Masuk</Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="sm" className="sm:size-default">Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Academic Assistant
          </h1>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Platform AI terlengkap untuk membantu mahasiswa dan dosen dalam penulisan akademik, 
            riset, analisis data, dan presentasi. Selesaikan tugas akademik lebih cepat dan berkualitas!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth/sign-in">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Mulai Gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Lihat Fitur
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl" />
            <Image
              src="/logo.jpeg"
              alt="Si-JAPIRS Platform"
              width={1200}
              height={600}
              className="relative rounded-xl shadow-2xl border"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-2 sm:p-4"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Fitur Lengkap untuk Kebutuhan Akademik</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Semua tools yang Anda butuhkan untuk sukses dalam dunia akademik
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={feature.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                  <CardHeader>
                    <feature.icon className={`h-8 w-8 sm:h-10 sm:w-10 mb-2 ${feature.color}`} />
                    <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs sm:text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Mengapa Si-JAPIRS?</h2>
            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: Zap, title: "Cepat & Efisien", desc: "Selesaikan tugas akademik 10x lebih cepat" },
                { icon: Shield, title: "Aman & Terpercaya", desc: "Data Anda dilindungi dengan enkripsi tingkat tinggi" },
                { icon: Globe, title: "Multi-Bahasa", desc: "Dukung 6 bahasa internasional" },
                { icon: Clock, title: "24/7 Support", desc: "Bantuan kapan saja Anda butuhkan" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl" />
            <Image
              src="/logo.jpeg"
              alt="Benefits"
              width={600}
              height={400}
              className="relative rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Apa Kata Pengguna Kami</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Dipercaya oleh ribuan mahasiswa dan dosen di Indonesia</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Award className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="mb-4 text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
          <CardContent className="py-8 sm:py-12 text-center px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Siap Tingkatkan Produktivitas Akademik Anda?</h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg opacity-90 max-w-2xl mx-auto">
              Bergabung dengan ribuan pengguna yang sudah merasakan manfaatnya. 
              Gratis untuk 7 hari pertama!
            </p>
            <Link href="/auth/sign-in">
              <Button size="lg" variant="secondary" className="gap-2">
                Mulai Trial Gratis <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 mt-12 sm:mt-16 md:mt-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Image
                  src="/logo.jpeg"
                  alt="Si-JAPIRS"
                  width={28}
                  height={28}
                  className="rounded-lg sm:w-8 sm:h-8"
                />
                <span className="font-heading font-bold text-sm sm:text-base">Si-JAPIRS</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                AI Academic Assistant untuk mahasiswa & dosen Indonesia
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Produk</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/writer" className="hover:text-foreground">AI Writer</Link></li>
                <li><Link href="/summarizer" className="hover:text-foreground">Summarizer</Link></li>
                <li><Link href="/research" className="hover:text-foreground">Research</Link></li>
                <li><Link href="/stats" className="hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Perusahaan</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">Tentang</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Karir</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Kontak</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privasi</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2025 Si-JAPIRS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
