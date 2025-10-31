"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabaseAuth } from '@/lib/auth-supabase'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabaseAuth.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          toast.error('Authentication failed. Please try again.')
          router.push('/auth/sign-in')
          return
        }

        if (session) {
          // Authentication successful
          toast.success('Successfully signed in!')
          
          // Redirect to dashboard or home page
          router.push('/dashboard')
        } else {
          // No session found
          toast.error('No session found. Please sign in again.')
          router.push('/auth/sign-in')
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        toast.error('An unexpected error occurred.')
        router.push('/auth/sign-in')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
