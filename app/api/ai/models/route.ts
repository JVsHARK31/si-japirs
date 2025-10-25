import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiClient } from '@/lib/ai-client'

// GET: Get available models and current model
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const models = aiClient.getAvailableModels()
    const currentModel = aiClient.getCurrentModel()

    return NextResponse.json({
      models,
      currentModel,
    })
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

// POST: Set current model
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { model } = await request.json()

    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      )
    }

    // Validate model
    const availableModels = aiClient.getAvailableModels()
    const isValidModel = availableModels.some(m => m.key === model)

    if (!isValidModel) {
      return NextResponse.json(
        { error: 'Invalid model selected' },
        { status: 400 }
      )
    }

    const newModel = aiClient.setModel(model)

    return NextResponse.json({
      success: true,
      currentModel: newModel,
      modelName: aiClient.getModelDisplayName(model)
    })
  } catch (error) {
    console.error('Error setting model:', error)
    return NextResponse.json(
      { error: 'Failed to set model' },
      { status: 500 }
    )
  }
}
