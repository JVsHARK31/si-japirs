import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exerciseProcessor } from '@/lib/services/exercise-processor';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: solutionId } = params;
    const { question, problemText, solutionText } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!problemText || !solutionText) {
      return NextResponse.json(
        { error: 'Problem text and solution text are required' },
        { status: 400 }
      );
    }

    // Generate follow-up answer
    const answer = await exerciseProcessor.answerFollowupQuestion(
      solutionId,
      question,
      {
        problemText,
        solutionText,
        previousExplanations: []
      }
    );

    return NextResponse.json({
      success: true,
      answer,
      solutionId,
      question
    });

  } catch (error) {
    console.error('Failed to generate follow-up answer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}