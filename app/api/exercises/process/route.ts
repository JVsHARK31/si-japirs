import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exerciseProcessor } from '@/lib/services/exercise-processor';
import { ExerciseSubmission } from '@/lib/types/exercise';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];
    const images = formData.getAll('images') as File[];

    // Validate input
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (files.length === 0 && images.length === 0) {
      return NextResponse.json(
        { error: 'At least one file or image is required' },
        { status: 400 }
      );
    }

    // Create submission object
    const submission: ExerciseSubmission = {
      title: title.trim(),
      subject: subject || undefined,
      description: description?.trim() || undefined,
      files,
      images
    };

    // Process the submission
    const result = await exerciseProcessor.processSubmission(submission, session.user.id);

    return NextResponse.json({
      success: true,
      sessionId: result.id,
      problemCount: result.problems?.length || 0
    });

  } catch (error) {
    console.error('Exercise processing failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's exercise sessions
    // In a real implementation, this would query the database
    const sessions = [
      {
        id: 'session1',
        title: 'Ujian Matematika Kelas 12',
        subject: 'math',
        status: 'completed',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        problemCount: 5
      },
      {
        id: 'session2',
        title: 'Latihan Fisika',
        subject: 'physics',
        status: 'completed',
        createdAt: new Date('2024-01-14T15:45:00Z'),
        problemCount: 3
      }
    ];

    return NextResponse.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Failed to fetch exercise sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}