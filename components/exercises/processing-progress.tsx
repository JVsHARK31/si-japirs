'use client';

import { Loader2, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingProgressProps {
  progress: number;
  currentStep: number;
  steps: string[];
}

export function ProcessingProgress({ progress, currentStep, steps }: ProcessingProgressProps) {
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          />
        </div>
        <div className="absolute right-0 -top-6 text-sm text-gray-600">
          {progress}%
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 transition-all duration-300",
                isActive && "scale-105",
                isCompleted && "opacity-75",
                isPending && "opacity-50"
              )}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isActive && "font-medium text-blue-600",
                  isCompleted && "text-gray-600",
                  isPending && "text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Processing message */}
      {currentStep < steps.length && (
        <div className="text-center text-sm text-gray-600 mt-4">
          Mohon tunggu, sistem sedang memproses soal Anda...
        </div>
      )}
    </div>
  );
}