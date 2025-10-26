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

    const { messages, mode, model } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    let content: string
    let usedModel = model
    
    try {
      // Try with requested model first
      content = await aiClient.chatCompletion({
        messages,
        mode: mode || 'general',
        model: model,
      })
    } catch (aiError: any) {
      console.error('AI Chat Error:', aiError)
      
      // If rate limit error and not already using GPT-3.5, try fallback
      if (aiError.message?.includes('limit') && model !== 'gpt-3.5') {
        console.log('Rate limit hit, falling back to GPT-3.5 Turbo...')
        try {
          content = await aiClient.chatCompletion({
            messages,
            mode: mode || 'general',
            model: 'gpt-3.5',
          })
          usedModel = 'gpt-3.5'
        } catch (fallbackError) {
          console.error('Fallback to GPT-3.5 also failed:', fallbackError)
          throw fallbackError
        }
      } else {
        throw aiError
      }
    }

    // Save chat to database (optional, continue if fails)
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

    return NextResponse.json({ 
      content,
      usedModel // Return which model was actually used
    })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process chat request'
    
    if (error.message?.includes('limit')) {
      errorMessage = 'Model rate limit reached. Please try using GPT-3.5 Turbo or wait until tomorrow.'
    } else if (error.message?.includes('API key') || error.message?.includes('401')) {
      // More specific API key error
      errorMessage = 'API authentication failed. The service is being fixed. Please try again in a moment or use GPT-3.5 Turbo model.'
      console.error('API Key Error - Check environment variables')
    } else if (error.message?.includes('connect')) {
      errorMessage = 'Unable to connect to AI service. Please check your internet connection.'
    } else if (error.message?.includes('Invalid API key')) {
      errorMessage = 'API service temporarily unavailable. Please try again in a moment.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
