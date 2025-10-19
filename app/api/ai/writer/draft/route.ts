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

    const { 
      title, 
      documentType, 
      field, 
      citationStyle, 
      language, 
      outline, 
      targetWords,
      sectionId 
    } = await request.json()

    if (!title || !documentType || !field) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const draft = await aiClient.generateDraft({
      topic: title,
      type: documentType,
      style: citationStyle,
      outline,
      locale: language || 'id',
      length: parseInt(targetWords) || 2000,
    })

    return NextResponse.json({ draft })
  } catch (error) {
    console.error('Error generating draft:', error)
    return NextResponse.json(
      { error: 'Failed to generate draft' },
      { status: 500 }
    )
  }
}
