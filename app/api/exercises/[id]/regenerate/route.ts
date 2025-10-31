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

    const { id: problemId } = params;
    const { problemText } = await request.json();

    if (!problemText?.trim()) {
      return NextResponse.json(
        { error: 'Problem text is required' },
        { status: 400 }
      );
    }

    // Regenerate solution
    const newSolution = await exerciseProcessor.regenerateSolution(problemId, problemText);

    return NextResponse.json({
      success: true,
      solution: newSolution
    });

  } catch (error) {
    console.error('Failed to regenerate solution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}