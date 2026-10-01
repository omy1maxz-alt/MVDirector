import React from 'react';
import { LogEntry } from '@/types';

interface SystemStateProps {
  logs: LogEntry[];
  isGenerating: boolean;
  isSaving: boolean;
  isProcessing: boolean;
  queueSize: number;
}

export const SystemState: React.FC<SystemStateProps> = ({ logs = [], isGenerating = false, isSaving = false, isProcessing = false, queueSize = 0 }) => {
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;

  const getStatusColor = () => {
    if (isGenerating || isProcessing) return 'text-yellow-400';
    if (isSaving) return 'text-blue-400';
    if (lastLog?.type === 'error') return 'text-red-500';
    if (lastLog?.type === 'success') return 'text-green-500';
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (isGenerating) return `Generating... (Queue: ${queueSize})`;
    if (isProcessing) return 'Processing...';
    if (isSaving) return 'Saving...';
    if (lastLog) return lastLog.message;
    return 'System Ready';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm p-2 border-t border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center ${getStatusColor()}`}>
            <span className="relative flex h-2 w-2 mr-2">
              {(isGenerating || isProcessing) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
            <span>{getStatusText()}</span>
          </div>
          <div className="text-gray-500">
            <span>MV Director AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};