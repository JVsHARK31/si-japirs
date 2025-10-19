import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiClient } from '@/lib/ai-client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { text, locale } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const corrected = await aiClient.checkGrammar({
      text,
      locale: locale || 'id',
    })

    return NextResponse.json({ corrected })
  } catch (error) {
    console.error('Error checking grammar:', error)
    return NextResponse.json(
      { error: 'Failed to check grammar' },
      { status: 500 }
    )
  }
}
