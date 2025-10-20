import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      writer: true,
      summarizer: true,
      research: true,
      consult: true,
      slides: true,
      plagiarism: true,
      stats: true,
      auth: {
        google: true,
        credentials: true
      }
    },
    deployment: 'Netlify',
    message: 'Si-JAPIRS is running successfully!'
  })
}
