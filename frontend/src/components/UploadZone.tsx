import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid image file under 5MB.');
      return;
    }
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer p-12
          \${isDragActive ? 'border-ark-blue bg-ark-blue/10 scale-[1.02]' : 'border-ark-gray bg-ark-dark hover:border-ark-blue/50 hover:bg-ark-gray/30'}
          \${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {isLoading ? (
            <Loader2 className="w-16 h-16 text-ark-blue animate-spin" />
          ) : isDragActive ? (
            <UploadCloud className="w-16 h-16 text-ark-blue animate-bounce" />
          ) : (
            <ImageIcon className="w-16 h-16 text-gray-400 group-hover:text-ark-blue transition-colors" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isLoading ? 'Analyzing Operator...' : isDragActive ? 'Drop image here!' : 'Drag & Drop your image'}
            </h3>
            <p className="text-gray-400 text-sm">
              {!isLoading && 'or click to browse from your computer (Max 5MB, JPEG/PNG)'}
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}
    </div>
  );
};
