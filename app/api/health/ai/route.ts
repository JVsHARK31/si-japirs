import { NextResponse } from 'next/server'
import { aiClient } from '@/lib/ai-client'

export async function GET() {
  try {
    // Check environment variables
    const apiKeyStatus = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      NEXT_PUBLIC_OPENAI_API_KEY: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      OPENAI_API_BASE: process.env.OPENAI_API_BASE || 'not set',
      NEXT_PUBLIC_OPENAI_API_BASE: process.env.NEXT_PUBLIC_OPENAI_API_BASE || 'not set'
    }

    // Test API connection
    let apiTestResult = 'not tested'
    let apiTestError = null
    
    try {
      // Try a minimal API call
      const testResponse = await aiClient.chatCompletion({
        messages: [{ role: 'user', content: 'test' }],
        model: 'gpt-3.5'
      })
      apiTestResult = testResponse ? 'success' : 'failed'
    } catch (error: any) {
      apiTestResult = 'failed'
      apiTestError = error.message
    }

    // Get current model info
    const currentModel = aiClient.getCurrentModel()
    const availableModels = aiClient.getAvailableModels()

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        ...apiKeyStatus
      },
      ai: {
        currentModel,
        availableModels,
        apiTest: {
          result: apiTestResult,
          error: apiTestError
        }
      },
      message: 'AI health check endpoint'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
