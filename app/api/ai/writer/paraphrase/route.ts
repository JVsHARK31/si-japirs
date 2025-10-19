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

    const { text, tone, locale } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const paraphrased = await aiClient.paraphrase({
      text,
      tone: tone || 'formal',
      locale: locale || 'id',
    })

    return NextResponse.json({ paraphrased })
  } catch (error) {
    console.error('Error paraphrasing text:', error)
    return NextResponse.json(
      { error: 'Failed to paraphrase text' },
      { status: 500 }
    )
  }
}
