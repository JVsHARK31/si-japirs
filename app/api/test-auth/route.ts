import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const config = {
      google_client_configured: !!process.env.GOOGLE_CLIENT_ID,
      google_secret_configured: !!process.env.GOOGLE_CLIENT_SECRET,
      nextauth_secret_configured: !!process.env.NEXTAUTH_SECRET,
      nextauth_url_configured: !!process.env.NEXTAUTH_URL,
      google_client_id_length: process.env.GOOGLE_CLIENT_ID?.length || 0,
      session_exists: !!session,
      user_logged_in: !!session?.user,
      user_email: session?.user?.email || 'Not logged in',
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Auth configuration check',
      config,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check auth configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
