import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiClient } from '@/lib/ai-client'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { messages, mode } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    const content = await aiClient.chatCompletion({
      messages,
      mode: mode || 'general',
    })

    // Save chat to database
    try {
      await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: messages[0]?.content?.substring(0, 50) || 'New Chat',
          messages: messages,
          mode: mode || 'general',
        }
      })
    } catch (dbError) {
      console.error('Error saving chat to database:', dbError)
      // Continue even if save fails
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
