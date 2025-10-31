import { AIClient } from '@/lib/ai-client';
import {
  ProblemAnalysis,
  ExerciseSolution,
  SolutionStep,
  ExerciseInteraction,
  ExerciseSubject,
  ProblemType
} from '@/lib/types/exercise';

export class ExerciseAIService {
  private aiClient: AIClient;

  constructor() {
    this.aiClient = new AIClient();
  }

  async analyzeProblem(problemText: string, subject?: string): Promise<ProblemAnalysis> {
    const prompt = this.buildAnalysisPrompt(problemText, subject);

    try {
      const response = await this.aiClient.chat([
        {
          role: 'system',
          content: 'You are an expert education AI that analyzes academic problems across all subjects. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.1
      });

      const analysis = this.parseAnalysisResponse(response);
      return analysis;
    } catch (error) {
      console.error('Problem analysis failed:', error);
      throw new Error('Failed to analyze problem');
    }
  }

  async generateSolution(analysis: ProblemAnalysis): Promise<ExerciseSolution> {
    const startTime = Date.now();

    try {
      const response = await this.aiClient.chat([
        {
          role: 'system',
          content: this.getSystemPromptForSubject(analysis.subject)
        },
        {
          role: 'user',
          content: this.buildSolutionPrompt(analysis)
        }
      ], {
        model: this.selectModelForProblem(analysis),
        temperature: 0.2
      });

      const solution = this.parseSolutionResponse(response);
      solution.processingTime = Date.now() - startTime;
      solution.modelUsed = this.selectModelForProblem(analysis);

      return solution;
    } catch (error) {
      console.error('Solution generation failed:', error);
      throw new Error('Failed to generate solution');
    }
  }

  async provideAlternativeSolutions(
    originalSolution: ExerciseSolution,
    problemAnalysis: ProblemAnalysis
  ): Promise<ExerciseSolution[]> {
    const prompt = `
    Berikan 3 solusi alternatif untuk soal berikut:

    Soal: ${problemAnalysis.problemText}
    Solusi asli: ${originalSolution.solutionText}

    Berikan solusi yang berbeda pendekatan/metodenya, misalnya:
    1. Metode visual/diagram
    2. Metode langkah berbeda
    3. Metode singkatan/pintasan

    Format setiap solusi dengan nomor dan penjelasan lengkap.
    `;

    try {
      const response = await this.aiClient.chat([
        {
          role: 'system',
          content: 'Anda adalah tutor ahli yang bisa memberikan berbagai metode penyelesaian soal.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        model: 'gpt-4o',
        temperature: 0.3
      });

      return this.parseAlternativeSolutions(response);
    } catch (error) {
      console.error('Alternative solutions generation failed:', error);
      return [];
    }
  }

  async generateExplanation(
    solution: ExerciseSolution,
    level: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<string> {
    const levelPrompts = {
      basic: 'Jelaskan dengan bahasa yang sangat sederhana, cocok untuk siswa SD.',
      intermediate: 'Jelaskan dengan bahasa standar, cocok untuk siswa SMA.',
      advanced: 'Jelaskan dengan konsep yang mendalam, cocok untuk mahasiswa.'
    };

    const prompt = `
    ${levelPrompts[level]}

    Soal: [Dapatkan dari konteks solusi]
    Solusi: ${solution.solutionText}

    Berikan penjelasan yang detail tentang:
    1. Konsep dasar yang digunakan
    2. Mengapa langkah-langkah ini dilakukan
    3. Cara memeriksa jawaban
    4. Tips untuk menyelesaikan soal serupa
    `;

    try {
      const response = await this.aiClient.chat([
        {
          role: 'system',
          content: 'Anda adalah tutor yang sangat sabar dan baik dalam menjelaskan konsep.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.4
      });

      return response;
    } catch (error) {
      console.error('Explanation generation failed:', error);
      return 'Maaf, tidak dapat生成 penjelasan saat ini.';
    }
  }

  async answerFollowup(
    question: string,
    context: { problem: string; solution: string; previousExplanations?: string[] }
  ): Promise<string> {
    const prompt = `
    Soal asli: ${context.problem}
    Solusi: ${context.solution}
    ${context.previousExplanations ? `Penjelasan sebelumnya: ${context.previousExplanations.join('\n')}` : ''}

    Pertanyaan follow-up: ${question}

    Jawab dengan jelas dan relevan dengan konteks soal dan solusi di atas.
    `;

    try {
      const response = await this.aiClient.chat([
        {
          role: 'system',
          content: 'Anda adalah tutor yang membantu siswa memahami solusi soal secara mendalam.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        model: 'gpt-4o-mini',
        temperature: 0.3
      });

      return response;
    } catch (error) {
      console.error('Follow-up answer failed:', error);
      return 'Maaf, saya tidak dapat menjawab pertanyaan tersebut saat ini.';
    }
  }

  private buildAnalysisPrompt(problemText: string, subject?: string): string {
    return `
    Analisis soal berikut dan berikan output dalam format JSON:

    Soal: "${problemText}"
    ${subject ? `Mata pelajaran: ${subject}` : ''}

    Format JSON:
    {
      "problemText": "teks soal yang dianalisis",
      "problemType": "multiple_choice|essay|math|coding|short_answer",
      "difficulty": "easy|medium|hard",
      "subject": "math|science|programming|language|physics|chemistry|biology|history|geography|economics|literature|general",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "context": "konteks atau domain spesifik dari soal"
    }

    Fokus pada:
    1. Identifikasi tipe soal yang tepat
    2. Estimasi tingkat kesulitan berdasarkan kompleksitas
    3. Ekstrak kata kunci penting
    4. Tentukan mata pelajaran yang paling relevan
    `;
  }

  private buildSolutionPrompt(analysis: ProblemAnalysis): string {
    return `
    Selesaikan soal berikut dengan langkah-langkah detail:

    Soal: ${analysis.problemText}
    Tipe: ${analysis.problemType}
    Kesulitan: ${analysis.difficulty}
    Mata pelajaran: ${analysis.subject}

    Berikan jawaban dalam format:
    1. Jawaban akhir (jelas dan singkat)
    2. Penjelasan konsep yang digunakan
    3. Langkah-langkah penyelesaian (detail)
    4. Cara memeriksa jawaban
    5. Tips untuk soal serupa

    Pastikan penjelasan mudah dipahami dan langkah-langkah logis.
    `;
  }

  private getSystemPromptForSubject(subject: string): string {
    const prompts = {
      math: 'Anda adalah ahli matematika yang bisa menjelaskan konsep matematis dengan jelas dan logis.',
      science: 'Anda adalah ahli sains yang menguasai konsep ilmiah dan metode penelitian.',
      programming: 'Anda adalah ahli pemrograman yang menguasai berbagai bahasa dan algoritma.',
      language: 'Anda adalah ahli bahasa yang menguasai tata bahasa, sastra, dan linguistik.',
      physics: 'Anda adalah ahli fisika yang menguasai konsep fisika dan perhitungannya.',
      chemistry: 'Anda adalah ahli kimia yang menguasai konsep kimia dan reaksinya.',
      biology: 'Anda adalah ahli biologi yang menguasai konsep kehidupan dan organisme.',
      history: 'Anda adalah ahli sejarah yang menguasai peristiwa historis dan konteksnya.',
      geography: 'Anda adalah ahli geografi yang menguasai konsep geografis dan spasial.',
      economics: 'Anda adalah ahli ekonomi yang menguasai teori ekonomi dan aplikasinya.',
      literature: 'Anda adalah ahli sastra yang menguasai analisis teks dan teori sastra.',
      general: 'Anda adalah tutor multidisiplin yang bisa membantu berbagai mata pelajaran.'
    };

    return prompts[subject as keyof typeof prompts] || prompts.general;
  }

  private selectModelForProblem(analysis: ProblemAnalysis): string {
    // Select appropriate model based on problem type and difficulty
    if (analysis.problemType === 'coding') {
      return 'deepseek-coder';
    }

    if (analysis.difficulty === 'hard' || analysis.subject === 'math') {
      return 'gpt-4o';
    }

    return 'gpt-4o-mini';
  }

  private parseAnalysisResponse(response: string): ProblemAnalysis {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: parse manually if JSON extraction fails
      return this.fallbackAnalysis(response);
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      return this.fallbackAnalysis(response);
    }
  }

  private parseSolutionResponse(response: string): ExerciseSolution {
    const steps: SolutionStep[] = [];
    const lines = response.split('\n').filter(line => line.trim());

    let currentStep = 1;
    let solutionText = '';
    let explanationText = '';

    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^Langkah\s*\d+/i)) {
        if (currentStep > 1) {
          steps[steps.length - 1].result = solutionText;
        }

        steps.push({
          stepNumber: currentStep++,
          description: line.replace(/^\d+\.\s*/, '').replace(/^Langkah\s*\d+:\s*/i, ''),
          explanation: '',
        });
      } else if (steps.length > 0) {
        steps[steps.length - 1].explanation += line + ' ';
      } else if (line.toLowerCase().includes('jawaban')) {
        solutionText = line.replace(/.*jawaban[:\s]*:?/i, '').trim();
      } else {
        explanationText += line + ' ';
      }
    }

    if (steps.length > 0 && solutionText) {
      steps[steps.length - 1].result = solutionText;
    }

    return {
      id: '', // Will be set by database
      problemId: '', // Will be set by database
      solutionText: solutionText || 'Solution processed',
      explanationText: explanationText.trim(),
      steps,
      confidenceScore: 0.85, // Default confidence
    };
  }

  private parseAlternativeSolutions(response: string): ExerciseSolution[] {
    const solutions: ExerciseSolution[] = [];
    const sections = response.split(/\d+\./).filter(section => section.trim());

    sections.forEach((section, index) => {
      const lines = section.trim().split('\n');
      const solutionText = lines[0] || `Alternative solution ${index + 1}`;
      const explanationText = lines.slice(1).join(' ').trim();

      solutions.push({
        id: '', // Will be set by database
        problemId: '', // Will be set by database
        solutionText,
        explanationText,
        steps: [], // Alternative solutions might not need detailed steps
        confidenceScore: 0.75,
      });
    });

    return solutions;
  }

  private fallbackAnalysis(response: string): ProblemAnalysis {
    // Simple fallback analysis
    return {
      problemText: response.slice(0, 200),
      problemType: 'essay',
      difficulty: 'medium',
      subject: 'general',
      keywords: response.split(' ').slice(0, 5),
      context: 'General education context'
    };
  }
}

export const exerciseAIService = new ExerciseAIService();