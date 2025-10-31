'use client';

import { useCallback, useState } from 'react';
import { Upload, File, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileUploadAreaProps {
  onFileUpload: (files: File[]) => void;
  files: File[];
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
}

export function FileUploadArea({
  onFileUpload,
  files,
  onRemoveFile,
  disabled = false,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 30 * 1024 * 1024 // 30MB
}: FileUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUpload(acceptedFiles);
    setDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: true,
    disabled
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    if (file.type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <File className="h-4 w-4" />;
  };

  const isFileSizeValid = (file: File): boolean => {
    return file.size <= maxSize;
  };

  const isFileTypeValid = (file: File): boolean => {
    const validTypes = accept.split(',').map(type => type.trim());
    const fileName = file.name.toLowerCase();
    return validTypes.some(type => {
      if (type.startsWith('.')) {
        return fileName.endsWith(type.toLowerCase());
      }
      return file.type === type;
    });
  };

  const validateFiles = (files: File[]): File[] => {
    return files.filter(file => {
      if (!isFileSizeValid(file)) {
        console.warn(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return false;
      }
      if (!isFileTypeValid(file)) {
        console.warn(`File ${file.name} has invalid type. Accepted types: ${accept}`);
        return false;
      }
      return true;
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = validateFiles(selectedFiles);
    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive || isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className="text-center space-y-4"
          >
            <input {...getInputProps()} />
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {dragActive || isDragActive
                  ? 'Lepaskan file di sini'
                  : 'Drag & drop file di sini'
                }
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                atau klik untuk memilih file
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Format yang didukung: {accept.replace(/\./g, '').toUpperCase()}
              <br />
              Maksimal ukuran: {formatFileSize(maxSize)}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('file-input')?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Pilih File
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            id="file-input"
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">File yang Diupload:</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFile(index)}
                    disabled={disabled}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Preview for images */}
                {file.type.startsWith('image/') && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-20 w-auto object-cover rounded border"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips Upload:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pastikan foto soal jelas dan terang</li>
          <li>• Hindari bayangan dan blur</li>
          <li>• Upload dalam format JPG/PNG untuk hasil OCR terbaik</li>
          <li>• Untuk dokumen multi-halaman, gunakan format PDF</li>
          <li>• Pastikan teks dapat dibaca dengan jelas</li>
        </ul>
      </div>
    </div>
  );
}