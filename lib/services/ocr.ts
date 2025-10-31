import { createWorker } from 'tesseract.js';
import { OCRResult, OCRBox } from '@/lib/types/exercise';

export class OCRService {
  private worker: Tesseract.Worker | null = null;

  async initializeWorker(): Promise<void> {
    if (this.worker) return;

    this.worker = await createWorker('ind', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
  }

  async extractFromImage(imageFile: File | string): Promise<OCRResult> {
    try {
      await this.initializeWorker();

      const imageUrl = typeof imageFile === 'string' ? imageFile : URL.createObjectURL(imageFile);

      const { data } = await this.worker!.recognize(imageUrl);

      // Clean up the object URL if we created one
      if (typeof imageFile !== 'string') {
        URL.revokeObjectURL(imageUrl);
      }

      const boxes: OCRBox[] = data.words.map(word => ({
        text: word.text,
        box: {
          x0: word.bbox.x0,
          y0: word.bbox.y0,
          x1: word.bbox.x1,
          y1: word.bbox.y1,
        },
        confidence: word.confidence,
      }));

      return {
        text: data.text,
        confidence: data.confidence,
        boxes,
      };
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async extractFromPDF(pdfFile: File): Promise<OCRResult[]> {
    // For PDF, we'll need to convert pages to images first
    // This is a simplified version - in production, you'd use a proper PDF-to-image library
    try {
      const results: OCRResult[] = [];

      // Convert PDF to images using canvas
      const images = await this.convertPDFToImages(pdfFile);

      for (const image of images) {
        const result = await this.extractFromImage(image);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('PDF OCR extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async convertPDFToImages(pdfFile: File): Promise<string[]> {
    // This is a placeholder for PDF to image conversion
    // In production, you'd use libraries like pdf.js or pdf-poppler
    // For now, we'll return an empty array
    console.warn('PDF to image conversion not implemented yet');
    return [];
  }

  async enhanceImageForOCR(imageFile: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply image enhancement
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

          // Apply threshold and contrast enhancement
          const enhanced = gray > 128 ? 255 : Math.max(0, gray - 50);

          data[i] = enhanced;     // Red
          data[i + 1] = enhanced; // Green
          data[i + 2] = enhanced; // Blue
          // Alpha channel remains unchanged
        }

        // Put enhanced image back
        ctx.putImageData(imageData, 0, 0);

        // Convert to blob and resolve
        canvas.toBlob((blob) => {
          if (blob) {
            const enhancedFile = new File([blob], imageFile.name, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            resolve(enhancedFile);
          } else {
            resolve(imageFile); // Fallback to original if enhancement fails
          }
        }, 'image/jpeg', 0.95);
      };

      img.src = URL.createObjectURL(imageFile);
    });
  }

  async extractMultipleImages(images: File[]): Promise<OCRResult[]> {
    const results: OCRResult[] = [];

    for (const image of images) {
      try {
        // Enhance image for better OCR results
        const enhancedImage = await this.enhanceImageForOCR(image);

        // Extract text
        const result = await this.extractFromImage(enhancedImage);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process image ${image.name}:`, error);
        // Continue with other images even if one fails
      }
    }

    return results;
  }

  async terminateWorker(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  // Alternative: Cloud-based OCR with Google Vision API
  async extractWithGoogleVision(imageFile: File): Promise<OCRResult> {
    try {
      // Convert file to base64
      const base64Image = await this.fileToBase64(imageFile);

      const response = await fetch('/api/ocr/google-vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          features: [
            { type: 'TEXT_DETECTION' },
            { type: 'DOCUMENT_TEXT_DETECTION' },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Google Vision API request failed');
      }

      const data = await response.json();

      return {
        text: data.fullTextAnnotation?.text || '',
        confidence: this.calculateAverageConfidence(data.textAnnotations || []),
        boxes: this.extractBoxesFromVision(data.textAnnotations || []),
      };
    } catch (error) {
      console.error('Google Vision OCR failed:', error);
      throw new Error('Failed to extract text using Google Vision');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private calculateAverageConfidence(annotations: any[]): number {
    if (annotations.length <= 1) return 0;

    const totalConfidence = annotations
      .slice(1) // Skip the first annotation (full text)
      .reduce((sum, annotation) => sum + (annotation.confidence || 0), 0);

    return totalConfidence / (annotations.length - 1);
  }

  private extractBoxesFromVision(annotations: any[]): OCRBox[] {
    return annotations.slice(1).map((annotation, index) => ({
      text: annotation.description || '',
      box: {
        x0: annotation.boundingPoly?.vertices?.[0]?.x || 0,
        y0: annotation.boundingPoly?.vertices?.[0]?.y || 0,
        x1: annotation.boundingPoly?.vertices?.[2]?.x || 0,
        y1: annotation.boundingPoly?.vertices?.[2]?.y || 0,
      },
      confidence: annotation.confidence || 0,
    }));
  }
}

// Singleton instance
export const ocrService = new OCRService();