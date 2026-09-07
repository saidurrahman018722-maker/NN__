import { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';

interface Character {
  id: number;
  name: string;
  description: string;
  class_type: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Character | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Prevent browser's default behavior of opening files when dropped outside the dropzone
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setImageBase64(null);

    // Create a preview URL for the image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Convert file to base64 for potential feedback submission
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.character);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        'An error occurred while communicating with the server. Please ensure the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-ark-dark text-white p-6 md:p-12 font-sans selection:bg-ark-blue selection:text-white flex flex-col items-center">
      
      {/* Header */}
      <header className="mb-12 text-center space-y-4 max-w-3xl flex flex-col items-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <img src="/favicon.svg" alt="Arknights Rhodes Island Logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-transform hover:scale-105" />
          <div className="inline-block px-4 py-1.5 rounded-full bg-ark-gray border border-white/10 text-ark-blue text-sm font-semibold tracking-widest uppercase shadow-xl">
            Rhodes Island Terminal
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
          Operator Identification System
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Upload an image of an operator to run a neural network scan and retrieve their classified personnel file.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center flex-1">
        {!result ? (
          <div className="w-full">
            <UploadZone onUpload={handleUpload} isLoading={isLoading} />
            
            {/* Global Error Display */}
            {error && (
              <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center space-x-3 text-red-200">
                <span className="font-semibold">Error:</span>
                <span>{typeof error === 'string' ? error : JSON.stringify(error)}</span>
              </div>
            )}
          </div>
        ) : (
          <ResultCard 
            imagePreviewUrl={previewUrl!} 
            imageBase64={imageBase64}
            character={result} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>PRTS System &copy; 2026 Rhodes Island Pharmaceuticals.</p>
        <p className="mt-1 text-gray-600">Strictly for authorized personnel only.</p>
      </footer>
    </div>
  );
}

export default App;
