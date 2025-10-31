import { ocrService } from './ocr';
import { exerciseAIService } from './exercise-ai';
import { uploadFile } from './storage';
import {
  ExerciseSession,
  ExerciseProblem,
  ExerciseSolution,
  ExerciseSubmission,
  OCRResult,
  ProblemAnalysis
} from '@/lib/types/exercise';

export class ExerciseProcessor {
  async processSubmission(
    submission: ExerciseSubmission,
    userId: string
  ): Promise<ExerciseSession> {
    try {
      // Create exercise session
      const session = await this.createExerciseSession(submission, userId);

      // Process uploaded files
      const ocrResults = await this.processFiles(submission.files);

      // Process captured images
      const imageOcrResults = await this.processImages(submission.images);

      // Combine all OCR results
      const allOcrResults = [...ocrResults, ...imageOcrResults];

      // Extract and analyze problems
      const problems = await this.extractProblemsFromOCR(allOcrResults, session.id);

      // Generate solutions for each problem
      const solutions = await this.generateSolutionsForProblems(problems);

      // Update session status
      await this.updateSessionStatus(session.id, 'completed');

      return {
        ...session,
        problems: problems.map((problem, index) => ({
          ...problem,
          solutions: solutions[index] ? [solutions[index]] : []
        }))
      };
    } catch (error) {
      console.error('Exercise processing failed:', error);
      throw new Error('Failed to process exercise submission');
    }
  }

  async createExerciseSession(
    submission: ExerciseSubmission,
    userId: string
  ): Promise<ExerciseSession> {
    // In a real implementation, this would save to database
    // For now, return a mock session
    return {
      id: `session_${Date.now()}`,
      userId,
      title: submission.title,
      subject: submission.subject,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private async processFiles(files: File[]): Promise<OCRResult[]> {
    const results: OCRResult[] = [];

    for (const file of files) {
      try {
        if (file.type.startsWith('image/')) {
          const result = await ocrService.extractFromImage(file);
          results.push(result);
        } else if (file.type === 'application/pdf') {
          const pdfResults = await ocrService.extractFromPDF(file);
          results.push(...pdfResults);
        } else {
          console.warn(`Unsupported file type: ${file.type}`);
        }
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
      }
    }

    return results;
  }

  private async processImages(images: File[]): Promise<OCRResult[]> {
    try {
      return await ocrService.extractMultipleImages(images);
    } catch (error) {
      console.error('Failed to process images:', error);
      return [];
    }
  }

  private async extractProblemsFromOCR(
    ocrResults: OCRResult[],
    sessionId: string
  ): Promise<ExerciseProblem[]> {
    const problems: ExerciseProblem[] = [];
    let questionNumber = 1;

    for (const ocrResult of ocrResults) {
      // Split text into individual problems
      const problemTexts = this.splitTextIntoProblems(ocrResult.text);

      for (const problemText of problemTexts) {
        if (problemText.trim().length < 10) continue; // Skip very short texts

        // Analyze the problem
        const analysis = await exerciseAIService.analyzeProblem(problemText);

        // Upload original image if available
        let imageUrl: string | undefined;
        if (ocrResults.length === 1) {
          // If single image, store reference
          imageUrl = await this.storeImageReference(ocrResult);
        }

        const problem: ExerciseProblem = {
          id: `problem_${Date.now()}_${questionNumber}`,
          sessionId,
          problemText,
          problemType: analysis.problemType as any,
          difficulty: analysis.difficulty as any,
          questionNumber,
          extractedText: problemText,
          imageUrl,
          metadata: {
            ocrConfidence: ocrResult.confidence,
            keywords: analysis.keywords,
            context: analysis.context
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        problems.push(problem);
        questionNumber++;
      }
    }

    return problems;
  }

  private splitTextIntoProblems(text: string): string[] {
    // Common patterns that indicate separate problems
    const problemSeparators = [
      /\n\s*\d+\./,           // Numbered questions (1., 2., etc.)
      /\n\s*[a-z]\)/,        // Lettered questions (a), b), etc.)
      /\n\s*Pertanyaan\s*\d+/i,  // "Pertanyaan 1", "Pertanyaan 2"
      /\n\s*Soal\s*\d+/i,     // "Soal 1", "Soal 2"
      /\n\s*Question\s*\d+/i, // "Question 1", "Question 2"
      /\n\s*-\s+/,           // Bullet points with dash
      /\n\s*\*\s+/,          // Bullet points with asterisk
      /\n\s*➊|\n\s*➋|\n\s*➌|\n\s*➍|\n\s*➎/  // Numbered circles
    ];

    let problems = [text];

    // Apply each separator pattern
    for (const separator of problemSeparators) {
      const newProblems: string[] = [];
      for (const problem of problems) {
        const split = problem.split(separator);
        if (split.length > 1) {
          // Add the separator back to each problem except the first
          for (let i = 0; i < split.length; i++) {
            if (i > 0) {
              split[i] = separator.source + split[i];
            }
            if (split[i].trim()) {
              newProblems.push(split[i].trim());
            }
          }
        } else {
          newProblems.push(problem);
        }
      }
      problems = newProblems;
    }

    // Clean up and filter problems
    return problems
      .map(p => p.replace(/^[\n\r\s]+|[\n\r\s]+$/g, '')) // Trim whitespace
      .filter(p => p.length > 10) // Filter out very short problems
      .filter(p => !this.isLikelyHeader(p)); // Filter out headers/metadata
  }

  private isLikelyHeader(text: string): boolean {
    const headerPatterns = [
      /^nama\s*:/i,
      /^kelas\s*:/i,
      /^tanggal\s*:/i,
      /^ujian\s*:/i,
      /^mata pelajaran\s*:/i,
      /^school\s*:/i,
      /^subject\s*:/i,
      /^name\s*:/i,
      /^class\s*:/i,
      /^date\s*:/i
    ];

    return headerPatterns.some(pattern => pattern.test(text));
  }

  private async storeImageReference(ocrResult: OCRResult): Promise<string> {
    // In a real implementation, this would upload the image to storage
    // and return the URL. For now, return a placeholder
    return `image_${Date.now()}.jpg`;
  }

  private async generateSolutionsForProblems(
    problems: ExerciseProblem[]
  ): Promise<ExerciseSolution[]> {
    const solutions: ExerciseSolution[] = [];

    for (const problem of problems) {
      try {
        // Recreate analysis for solution generation
        const analysis: ProblemAnalysis = {
          problemText: problem.problemText || '',
          problemType: problem.problemType || 'essay',
          difficulty: problem.difficulty || 'medium',
          subject: problem.metadata?.subject || 'general',
          keywords: problem.metadata?.keywords || [],
          context: problem.metadata?.context || ''
        };

        // Generate solution
        const solution = await exerciseAIService.generateSolution(analysis);

        // Link to problem
        solution.problemId = problem.id;

        solutions.push(solution);
      } catch (error) {
        console.error(`Failed to generate solution for problem ${problem.id}:`, error);
        // Create a placeholder solution
        solutions.push({
          id: `solution_failed_${problem.id}`,
          problemId: problem.id,
          solutionText: 'Maaf, tidak dapat生成 solusi untuk soal ini saat ini.',
          explanationText: 'Silakan coba lagi atau hubungi admin untuk bantuan.',
          confidenceScore: 0,
          processingTime: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return solutions;
  }

  private async updateSessionStatus(sessionId: string, status: 'completed' | 'failed'): Promise<void> {
    // In a real implementation, this would update the database
    console.log(`Session ${sessionId} status updated to: ${status}`);
  }

  async regenerateSolution(problemId: string, problemText: string): Promise<ExerciseSolution> {
    try {
      const analysis = await exerciseAIService.analyzeProblem(problemText);
      const solution = await exerciseAIService.generateSolution(analysis);
      solution.problemId = problemId;

      return solution;
    } catch (error) {
      console.error('Solution regeneration failed:', error);
      throw new Error('Failed to regenerate solution');
    }
  }

  async getAlternativeSolutions(solutionId: string, solution: ExerciseSolution, problemText: string): Promise<ExerciseSolution[]> {
    try {
      const analysis = await exerciseAIService.analyzeProblem(problemText);
      const alternatives = await exerciseAIService.provideAlternativeSolutions(solution, analysis);

      // Link alternatives to the original problem
      return alternatives.map(alt => ({
        ...alt,
        problemId: solution.problemId
      }));
    } catch (error) {
      console.error('Failed to get alternative solutions:', error);
      return [];
    }
  }

  async generateExplanation(
    solutionId: string,
    solution: ExerciseSolution,
    level: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<string> {
    try {
      return await exerciseAIService.generateExplanation(solution, level);
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      return 'Maaf, tidak dapat生成 penjelasan saat ini.';
    }
  }

  async answerFollowupQuestion(
    solutionId: string,
    question: string,
    context: { problemText: string; solutionText: string; previousExplanations?: string[] }
  ): Promise<string> {
    try {
      return await exerciseAIService.answerFollowup(question, context);
    } catch (error) {
      console.error('Failed to answer follow-up question:', error);
      return 'Maaf, saya tidak dapat menjawab pertanyaan tersebut saat ini.';
    }
  }
}

export const exerciseProcessor = new ExerciseProcessor();