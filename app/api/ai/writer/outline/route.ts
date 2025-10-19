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

    const { title, documentType, field, language } = await request.json()

    if (!title || !documentType || !field) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const outlineText = await aiClient.generateOutline({
      topic: title,
      type: documentType,
      locale: language || 'id',
    })

    // Parse outline text into structured format
    const outlineLines = outlineText.split('\n').filter(line => line.trim())
    const outline = outlineLines.map((line, index) => {
      const level = line.startsWith('  ') ? 2 : 1
      const title = line.trim().replace(/^[-*\d.]+\s*/, '')
      return {
        id: `${index + 1}`,
        title,
        level,
      }
    })

    return NextResponse.json({ outline })
  } catch (error) {
    console.error('Error generating outline:', error)
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
