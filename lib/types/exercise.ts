export interface ExerciseSession {
  id: string;
  userId: string;
  title: string;
  subject?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  problems?: ExerciseProblem[];
}

export interface ExerciseProblem {
  id: string;
  sessionId: string;
  problemText?: string;
  problemType?: 'multiple_choice' | 'essay' | 'math' | 'coding' | 'short_answer';
  difficulty?: 'easy' | 'medium' | 'hard';
  questionNumber?: number;
  extractedText?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  solutions?: ExerciseSolution[];
}

export interface ExerciseSolution {
  id: string;
  problemId: string;
  solutionText: string;
  explanationText?: string;
  steps?: SolutionStep[];
  confidenceScore?: number;
  processingTime?: number;
  modelUsed?: string;
  createdAt: Date;
  updatedAt: Date;
  interactions?: ExerciseInteraction[];
}

export interface ExerciseInteraction {
  id: string;
  solutionId: string;
  question: string;
  answer: string;
  interactionType: 'clarification' | 'alternative' | 'hint' | 'follow_up';
  createdAt: Date;
}

export interface SolutionStep {
  stepNumber: number;
  description: string;
  formula?: string;
  explanation?: string;
  result?: string;
}

export interface ExerciseSubmission {
  title: string;
  subject?: string;
  files: File[];
  images: File[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  boxes?: OCRBox[];
}

export interface OCRBox {
  text: string;
  box: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  confidence: number;
}

export interface ProblemAnalysis {
  problemText: string;
  problemType: string;
  difficulty: string;
  subject: string;
  keywords: string[];
  context: string;
}

export interface ExerciseProcessingJob {
  sessionId: string;
  files: string[];
  ocrResults: OCRResult[];
  analysis: ProblemAnalysis[];
}

export const EXERCISE_SUBJECTS = [
  { value: 'math', label: 'Matematika', icon: 'Calculator' },
  { value: 'science', label: 'Sains', icon: 'Microscope' },
  { value: 'programming', label: 'Pemrograman', icon: 'Code' },
  { value: 'language', label: 'Bahasa', icon: 'Languages' },
  { value: 'physics', label: 'Fisika', icon: 'Atom' },
  { value: 'chemistry', label: 'Kimia', icon: 'Beaker' },
  { value: 'biology', label: 'Biologi', icon: 'Dna' },
  { value: 'history', label: 'Sejarah', icon: 'BookOpen' },
  { value: 'geography', label: 'Geografi', icon: 'Globe' },
  { value: 'economics', label: 'Ekonomi', icon: 'TrendingUp' },
  { value: 'literature', label: 'Sastra', icon: 'Book' },
  { value: 'general', label: 'Umum', icon: 'FileQuestion' }
] as const;

export const PROBLEM_TYPES = [
  { value: 'multiple_choice', label: 'Pilihan Ganda', icon: 'List' },
  { value: 'essay', label: 'Esai', icon: 'FileText' },
  { value: 'math', label: 'Matematika', icon: 'Calculator' },
  { value: 'coding', label: 'Pemrograman', icon: 'Code' },
  { value: 'short_answer', label: 'Jawaban Pendek', icon: 'MessageSquare' }
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Mudah', color: 'green' },
  { value: 'medium', label: 'Sedang', color: 'yellow' },
  { value: 'hard', label: 'Sulit', color: 'red' }
] as const;

export type ExerciseSubject = typeof EXERCISE_SUBJECTS[number]['value'];
export type ProblemType = typeof PROBLEM_TYPES[number]['value'];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]['value'];