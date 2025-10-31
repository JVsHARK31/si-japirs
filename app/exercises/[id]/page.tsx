'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, MessageCircle, RefreshCw, ChevronDown, ChevronUp, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ExerciseSession, ExerciseProblem, ExerciseSolution } from '@/lib/types/exercise';
import { exerciseProcessor } from '@/lib/services/exercise-processor';
import { DifficultyLevel } from '@/lib/types/exercise';

export default function ExerciseResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [session, setSession] = useState<ExerciseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedProblems, setExpandedProblems] = useState<Set<number>>(new Set());
  const [followUpQuestions, setFollowUpQuestions] = useState<Record<string, string>>({});
  const [generatingAnswers, setGeneratingAnswers] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    loadSession();
  }, [params.id]);

  const loadSession = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from the database
      // For now, we'll simulate loading the session
      const mockSession: ExerciseSession = {
        id: params.id as string,
        userId: 'user-id-placeholder',
        title: 'Ujian Matematika Kelas 12',
        subject: 'math',
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        problems: [
          {
            id: 'problem1',
            sessionId: params.id as string,
            problemText: 'Jika 2x + 5 = 13, berapakah nilai x?',
            problemType: 'math',
            difficulty: 'easy',
            questionNumber: 1,
            extractedText: 'Jika 2x + 5 = 13, berapakah nilai x?',
            createdAt: new Date(),
            updatedAt: new Date(),
            solutions: [
              {
                id: 'solution1',
                problemId: 'problem1',
                solutionText: 'x = 4',
                explanationText: 'Untuk menyelesaikan persamaan linear 2x + 5 = 13, kita perlu mengisolasi variabel x.',
                steps: [
                  {
                    stepNumber: 1,
                    description: 'Kurangi kedua sisi dengan 5',
                    formula: '2x + 5 - 5 = 13 - 5',
                    explanation: 'Menghilangkan konstanta dari sisi kiri',
                    result: '2x = 8'
                  },
                  {
                    stepNumber: 2,
                    description: 'Bagi kedua sisi dengan 2',
                    formula: '2x / 2 = 8 / 2',
                    explanation: 'Mengisolasi variabel x',
                    result: 'x = 4'
                  }
                ],
                confidenceScore: 0.95,
                processingTime: 1200,
                modelUsed: 'gpt-4o-mini',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
          }
        ]
      };

      setSession(mockSession);
    } catch (error) {
      console.error('Failed to load session:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat hasil soal',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProblemExpansion = (problemIndex: number) => {
    setExpandedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemIndex)) {
        newSet.delete(problemIndex);
      } else {
        newSet.add(problemIndex);
      }
      return newSet;
    });
  };

  const regenerateSolution = async (problem: ExerciseProblem) => {
    try {
      // In a real implementation, this would call the API
      toast({
        title: 'Memperbarui solusi...',
        description: 'Sedang生成 ulang solusi untuk soal ini'
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Berhasil',
        description: 'Solusi telah diperbarui'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui solusi',
        variant: 'destructive'
      });
    }
  };

  const askFollowUp = async (problemId: string, question: string) => {
    if (!question.trim()) return;

    try {
      setGeneratingAnswers(prev => new Set(prev).add(problemId));

      // In a real implementation, this would call the API
      const answer = await exerciseProcessor.answerFollowupQuestion(
        problemId,
        question,
        {
          problemText: 'Contoh soal',
          solutionText: 'Contoh solusi'
        }
      );

      setFollowUpQuestions(prev => ({
        ...prev,
        [problemId]: answer
      }));

      toast({
        title: 'Jawaban tersedia',
        description: 'AI telah menjawab pertanyaan Anda'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menjawab pertanyaan',
        variant: 'destructive'
      });
    } finally {
      setGeneratingAnswers(prev => {
        const newSet = new Set(prev);
        newSet.delete(problemId);
        return newSet;
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Disalin!',
      description: 'Teks telah disalin ke clipboard'
    });
  };

  const downloadSolutions = () => {
    if (!session) return;

    const content = session.problems?.map((problem, index) => {
      const solution = problem.solutions?.[0];
      return `
Soal ${index + 1}: ${problem.problemText}

Jawaban: ${solution?.solutionText}

Penjelasan: ${solution?.explanationText}

Langkah-langkah:
${solution?.steps?.map(step => `${step.stepNumber}. ${step.description}\n   ${step.formula}\n   ${step.explanation}\n   Hasil: ${step.result}`).join('\n\n') || 'Tidak ada langkah-langkah'}

---
      `;
    }).join('\n') || 'Tidak ada soal';

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title}_solusi.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Berhasil',
      description: 'Solusi telah diunduh'
    });
  };

  const submitFeedback = (solutionId: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [solutionId]: type
    }));
    toast({
      title: 'Terima kasih!',
      description: `Feedback Anda (${type === 'up' ? '👍' : '👎'}) telah tersimpan`
    });
  };

  const getDifficultyColor = (difficulty?: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat hasil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hasil tidak ditemukan</h1>
          <Button onClick={() => router.push('/exercises')}>
            Kembali ke Solve Exercises
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/exercises')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
              <p className="text-gray-600">
                {session.problems?.length || 0} soal • Diproses pada {session.createdAt.toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <Button onClick={downloadSolutions} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Unduh Solusi
          </Button>
        </div>

        {/* Problems and Solutions */}
        <div className="space-y-6">
          {session.problems?.map((problem, problemIndex) => {
            const solution = problem.solutions?.[0];
            const isExpanded = expandedProblems.has(problemIndex);

            return (
              <Card key={problem.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleProblemExpansion(problemIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                        {problem.questionNumber || problemIndex + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {problem.problemText}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {problem.difficulty && (
                            <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty === 'easy' ? 'Mudah' : problem.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                            </Badge>
                          )}
                          {problem.problemType && (
                            <Badge variant="outline">
                              {problem.problemType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {isExpanded && solution && (
                  <CardContent className="space-y-6">
                    {/* Solution */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-green-800">Jawaban:</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(solution.solutionText)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => regenerateSolution(problem)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-lg font-medium text-green-900">
                        {solution.solutionText}
                      </p>
                    </div>

                    {/* Explanation */}
                    {solution.explanationText && (
                      <div>
                        <h3 className="font-semibold mb-2">Penjelasan:</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {solution.explanationText}
                        </p>
                      </div>
                    )}

                    {/* Steps */}
                    {solution.steps && solution.steps.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Langkah-langkah:</h3>
                        <div className="space-y-3">
                          {solution.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                {step.stepNumber}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step.description}</p>
                                {step.formula && (
                                  <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                                    {step.formula}
                                  </code>
                                )}
                                {step.explanation && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {step.explanation}
                                  </p>
                                )}
                                {step.result && (
                                  <p className="text-sm font-medium text-green-700 mt-1">
                                    Hasil: {step.result}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                      <div>
                        Confidence: {Math.round((solution.confidenceScore || 0) * 100)}% •
                        Model: {solution.modelUsed} •
                        Processing time: {solution.processingTime}ms
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">Apakah ini membantu?</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => submitFeedback(solution.id, 'up')}
                          className={feedback[solution.id] === 'up' ? 'text-green-600' : ''}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => submitFeedback(solution.id, 'down')}
                          className={feedback[solution.id] === 'down' ? 'text-red-600' : ''}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Follow-up Questions */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Tanya Tentang Solusi Ini
                      </h3>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Tanyakan sesuatu tentang solusi ini..."
                          value={followUpQuestions[solution.id]?.question || ''}
                          onChange={(e) => setFollowUpQuestions(prev => ({
                            ...prev,
                            [solution.id]: { ...prev[solution.id], question: e.target.value }
                          }))}
                          rows={2}
                        />
                        <Button
                          onClick={() => {
                            const question = followUpQuestions[solution.id]?.question;
                            if (question) {
                              askFollowUp(solution.id, question);
                            }
                          }}
                          disabled={!followUpQuestions[solution.id]?.question?.trim() || generatingAnswers.has(solution.id)}
                        >
                          {generatingAnswers.has(solution.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Berpikir...
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Tanya
                            </>
                          )}
                        </Button>

                        {followUpQuestions[solution.id]?.answer && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-900">
                              {followUpQuestions[solution.id].answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button variant="outline" onClick={() => router.push('/exercises')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Selesaikan Soal Lain
          </Button>
          <Button onClick={downloadSolutions}>
            <Download className="h-4 w-4 mr-2" />
            Unduh Semua Solusi
          </Button>
        </div>
      </motion.div>
    </div>
  );
}