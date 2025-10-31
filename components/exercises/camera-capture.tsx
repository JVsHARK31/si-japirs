'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, RotateCw, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onCapture: (images: File[]) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Initialize camera
  useEffect(() => {
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const initCamera = async () => {
    try {
      setIsLoading(true);
      setError('');

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError('Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera.');
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCaptures(prev => [...prev, url]);
      }
    }, 'image/jpeg', 0.95);
  }, []);

  const retakePhoto = useCallback((index: number) => {
    setCaptures(prev => prev.filter((_, i) => i !== index));
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const handleSubmit = useCallback(() => {
    if (captures.length === 0) return;

    // Convert captured URLs to Files
    Promise.all(
      captures.map(url =>
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], `capture_${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            return file;
          })
      )
    ).then(files => {
      // Cleanup URLs
      captures.forEach(url => URL.revokeObjectURL(url));
      onCapture(files);
    });
  }, [captures, onCapture]);

  const cancel = useCallback(() => {
    // Cleanup URLs
    captures.forEach(url => URL.revokeObjectURL(url));
    onCancel();
  }, [captures, onCancel]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                    <p>Memuat kamera...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center text-white p-4">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isLoading || error ? 'none' : 'block' }}
              />

              {/* Camera controls overlay */}
              {!isLoading && !error && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={switchCamera}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    onClick={capturePhoto}
                    className="bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={cancel}
                    className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Capture guidance */}
            {!error && (
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Pastikan soal terlihat jelas dan cukup cahaya. Usahakan foto tegak dan tidak blur.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Captured photos */}
      {captures.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Foto yang Diambil ({captures.length}):</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {captures.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Capture ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => retakePhoto(index)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Ulangi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancel}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="min-w-[120px]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Gunakan {captures.length} Foto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}