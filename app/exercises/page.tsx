'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Upload, FileText, Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ExerciseSubmission } from '@/lib/types/exercise';
import { exerciseProcessor } from '@/lib/services/exercise-processor';
import { EXERCISE_SUBJECTS } from '@/lib/types/exercise';
import { FileUploadArea } from '@/components/exercises/file-upload-area';
import { CameraCapture } from '@/components/exercises/camera-capture';
import { ProcessingProgress } from '@/components/exercises/processing-progress';

export default function ExercisesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<ExerciseSubmission>({
    title: '',
    subject: undefined,
    files: [],
    images: []
  });
  const [showCamera, setShowCamera] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleFileUpload = useCallback((files: File[]) => {
    setSubmission(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
    toast({
      title: "File berhasil ditambahkan",
      description: `${files.length} file telah ditambahkan`
    });
  }, [toast]);

  const handleImageCapture = useCallback((images: File[]) => {
    setSubmission(prev => ({
      ...prev,
      images: [...prev.images, ...images]
    }));
    setShowCamera(false);
    toast({
      title: "Foto berhasil ditambahkan",
      description: `${images.length} foto telah ditambahkan`
    });
  }, [toast]);

  const removeFile = useCallback((index: number, isImage: boolean = false) => {
    setSubmission(prev => {
      const key = isImage ? 'images' : 'files';
      const newArray = [...prev[key]];
      newArray.splice(index, 1);
      return { ...prev, [key]: newArray };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submission.title.trim()) {
      toast({
        title: "Error",
        description: "Judul harus diisi",
        variant: "destructive"
      });
      return;
    }

    if (submission.files.length === 0 && submission.images.length === 0) {
      toast({
        title: "Error",
        description: "Harap upload file atau foto soal",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setProcessingProgress(0);
    setCurrentStep(0);

    try {
      // Simulate processing steps
      const processingSteps = [
        { step: 'Mengupload file...', progress: 20 },
        { step: 'Mengekstrak teks dengan OCR...', progress: 40 },
        { step: 'Menganalisis soal...', progress: 60 },
        { step: '生成 solusi AI...', progress: 80 },
        { step: 'Menyelesaikan...', progress: 100 }
      ];

      // Update progress for each step
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        setProcessingProgress(processingSteps[i].progress);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Process the submission
      const result = await exerciseProcessor.processSubmission(submission, 'user-id-placeholder');

      toast({
        title: "Berhasil!",
        description: "Soal telah diproses dan solusi telah生成",
      });

      // Redirect to results page
      router.push(`/exercises/${result.id}`);

    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: "Error",
        description: "Gagal memproses soal. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setProcessingProgress(0);
      setCurrentStep(0);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Solve Exercises
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload foto atau dokumen soal, dan dapatkan solusi AI yang cerdas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informasi Soal
              </CardTitle>
              <CardDescription>
                Berikan informasi dasar tentang soal yang akan diproses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Soal *</Label>
                <Input
                  id="title"
                  placeholder="Contoh: Ujian Matematika Kelas 12"
                  value={submission.title}
                  onChange={(e) => setSubmission(prev => ({ ...prev, title: e.target.value }))}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Select
                  value={submission.subject}
                  onValueChange={(value) => setSubmission(prev => ({ ...prev, subject: value }))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXERCISE_SUBJECTS.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tambahkan deskripsi atau instruksi khusus..."
                  value={submission.description || ''}
                  onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File Soal
              </CardTitle>
              <CardDescription>
                Upload dokumen PDF, gambar, atau foto soal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadArea
                onFileUpload={handleFileUpload}
                files={submission.files}
                onRemoveFile={(index) => removeFile(index, false)}
                disabled={isSubmitting}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </CardContent>
          </Card>

          {/* Camera Capture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto Soal
              </CardTitle>
              <CardDescription>
                Ambil foto soal langsung dengan kamera
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showCamera ? (
                <CameraCapture
                  onCapture={handleImageCapture}
                  onCancel={() => setShowCamera(false)}
                />
              ) : (
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCamera(true)}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Buka Kamera
                  </Button>

                  {submission.images.length > 0 && (
                    <div className="space-y-2">
                      <Label>Foto yang Diupload:</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {submission.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Capture ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md border"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(index, true)}
                              disabled={isSubmitting}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Progress */}
          {isSubmitting && (
            <Card>
              <CardContent className="pt-6">
                <ProcessingProgress
                  progress={processingProgress}
                  currentStep={currentStep}
                  steps={[
                    'Mengupload file',
                    'Mengekstrak teks',
                    'Menganalisis soal',
                    '生成 solusi AI',
                    'Menyelesaikan'
                  ]}
                />
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || (!submission.title.trim() || (submission.files.length === 0 && submission.images.length === 0))}
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Proses Soal
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}