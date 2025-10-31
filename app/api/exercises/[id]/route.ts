import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
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

    const { id } = params;

    // In a real implementation, this would fetch from the database
    // For now, return mock data
    const mockSession = {
      id,
      userId: session.user.id,
      title: 'Ujian Matematika Kelas 12',
      subject: 'math',
      status: 'completed',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:35:00Z'),
      problems: [
        {
          id: 'problem1',
          sessionId: id,
          problemText: 'Jika 2x + 5 = 13, berapakah nilai x?',
          problemType: 'math',
          difficulty: 'easy',
          questionNumber: 1,
          extractedText: 'Jika 2x + 5 = 13, berapakah nilai x?',
          metadata: {
            ocrConfidence: 0.95,
            keywords: ['persamaan', 'linear', 'variabel'],
            context: 'Aljabar dasar'
          },
          createdAt: new Date('2024-01-15T10:30:00Z'),
          updatedAt: new Date('2024-01-15T10:35:00Z'),
          solutions: [
            {
              id: 'solution1',
              problemId: 'problem1',
              solutionText: 'x = 4',
              explanationText: 'Untuk menyelesaikan persamaan linear 2x + 5 = 13, kita perlu mengisolasi variabel x dengan melakukan operasi matematika yang sama pada kedua sisi persamaan.',
              steps: [
                {
                  stepNumber: 1,
                  description: 'Kurangi kedua sisi dengan 5',
                  formula: '2x + 5 - 5 = 13 - 5',
                  explanation: 'Menghilangkan konstanta dari sisi kiri persamaan',
                  result: '2x = 8'
                },
                {
                  stepNumber: 2,
                  description: 'Bagi kedua sisi dengan 2',
                  formula: '2x / 2 = 8 / 2',
                  explanation: 'Mengisolasi variabel x dengan membagi koefisien',
                  result: 'x = 4'
                }
              ],
              confidenceScore: 0.95,
              processingTime: 1200,
              modelUsed: 'gpt-4o-mini',
              createdAt: new Date('2024-01-15T10:35:00Z'),
              updatedAt: new Date('2024-01-15T10:35:00Z')
            }
          ]
        },
        {
          id: 'problem2',
          sessionId: id,
          problemText: 'Sebuah segitiga memiliki alas 12 cm dan tinggi 8 cm. Berapakah luas segitiga tersebut?',
          problemType: 'math',
          difficulty: 'easy',
          questionNumber: 2,
          extractedText: 'Sebuah segitiga memiliki alas 12 cm dan tinggi 8 cm. Berapakah luas segitiga tersebut?',
          metadata: {
            ocrConfidence: 0.92,
            keywords: ['segitiga', 'luas', 'alas', 'tinggi'],
            context: 'Geometri dasar'
          },
          createdAt: new Date('2024-01-15T10:30:00Z'),
          updatedAt: new Date('2024-01-15T10:35:00Z'),
          solutions: [
            {
              id: 'solution2',
              problemId: 'problem2',
              solutionText: '48 cm²',
              explanationText: 'Luas segitiga dihitung dengan rumus L = 1/2 × alas × tinggi. Dalam soal ini, alas = 12 cm dan tinggi = 8 cm.',
              steps: [
                {
                  stepNumber: 1,
                  description: 'Tulis rumus luas segitiga',
                  formula: 'L = 1/2 × alas × tinggi',
                  explanation: 'Rumus standar untuk menghitung luas segitiga',
                  result: 'L = 1/2 × a × t'
                },
                {
                  stepNumber: 2,
                  description: 'Substitusi nilai yang diketahui',
                  formula: 'L = 1/2 × 12 cm × 8 cm',
                  explanation: 'Memasukkan nilai alas dan tinggi ke dalam rumus',
                  result: 'L = 1/2 × 96 cm²'
                },
                {
                  stepNumber: 3,
                  description: 'Hitung hasilnya',
                  formula: 'L = 48 cm²',
                  explanation: 'Membagi 96 dengan 2 untuk mendapatkan luas segitiga',
                  result: '48 cm²'
                }
              ],
              confidenceScore: 0.98,
              processingTime: 1500,
              modelUsed: 'gpt-4o-mini',
              createdAt: new Date('2024-01-15T10:35:00Z'),
              updatedAt: new Date('2024-01-15T10:35:00Z')
            }
          ]
        }
      ]
    };

    return NextResponse.json({
      success: true,
      session: mockSession
    });

  } catch (error) {
    console.error('Failed to fetch exercise session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id } = params;

    // In a real implementation, this would delete from the database
    console.log(`Deleting exercise session ${id} for user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Exercise session deleted successfully'
    });

  } catch (error) {
    console.error('Failed to delete exercise session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}