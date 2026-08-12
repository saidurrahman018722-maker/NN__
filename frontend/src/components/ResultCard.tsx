import React from 'react';
import { Shield, Sparkles, FileText } from 'lucide-react';

interface Character {
  id: number;
  name: string;
  description: string;
  class_type: string;
}

interface ResultCardProps {
  imagePreviewUrl: string;
  character: Character;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ imagePreviewUrl, character, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-ark-gray rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="flex flex-col md:flex-row">
        {/* Left: Image Preview */}
        <div className="md:w-2/5 relative bg-black/50">
          <img 
            src={imagePreviewUrl} 
            alt="Uploaded operator" 
            className="w-full h-full object-cover min-h-[300px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ark-gray via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Right: Character Details */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-ark-accent mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider uppercase">Operator Identified</span>
              </div>
              <h2 className="text-4xl font-black text-white capitalize tracking-tight flex items-center space-x-3">
                <span>{character.name}</span>
                <span className="px-3 py-1 rounded-full bg-ark-blue/20 text-ark-blue text-sm border border-ark-blue/30 font-medium flex items-center space-x-1 uppercase">
                  <Shield className="w-4 h-4 mr-1" />
                  {character.class_type}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-300">
                <FileText className="w-6 h-6 text-ark-blue shrink-0 mt-1" />
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  {/* Split description by newlines to render paragraphs properly */}
                  {character.description.split('\\n').map((paragraph, idx) => {
                     // Basic markdown parsing for bold text
                     const parts = paragraph.split(/(\\*\\*.*?\\*\\*)/g);
                     return (
                        <p key={idx} className="mb-2">
                          {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="text-white">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </p>
                     )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <button 
              onClick={onReset}
              className="px-6 py-3 bg-ark-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-ark-blue/20 hover:shadow-ark-blue/40 transform hover:-translate-y-0.5"
            >
              Identify Another Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
