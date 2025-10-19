import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Si-JAPIRS - AI Academic Assistant',
  description: 'Platform AI untuk membantu mahasiswa dan dosen dalam penulisan akademik, riset, dan analisis data',
  keywords: 'academic writing, AI assistant, research helper, plagiarism checker, data analysis, thesis, journal',
  authors: [{ name: 'Si-JAPIRS Team' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: 'https://si-japir.com',
    siteName: 'Si-JAPIRS',
    title: 'Si-JAPIRS - AI Academic Assistant',
    description: 'Platform AI untuk membantu mahasiswa dan dosen dalam penulisan akademik, riset, dan analisis data',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Si-JAPIRS - AI Academic Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Si-JAPIRS - AI Academic Assistant',
    description: 'Platform AI untuk membantu mahasiswa dan dosen dalam penulisan akademik',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
