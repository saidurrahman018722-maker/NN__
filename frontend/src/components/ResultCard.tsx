import React, { useState } from 'react';
import { Shield, Sparkles, FileText, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  description: string;
  class_type: string;
}

interface ResultCardProps {
  imagePreviewUrl: string;
  imageBase64: string | null;
  character: Character;
  onReset: () => void;
}

const ALL_CHARACTERS = [
  "amiya", "ch'en", "exusiai", "lappland", "logos",
  "myrtle", "silverash", "surtr", "texas", "thorns"
];

export const ResultCard: React.FC<ResultCardProps> = ({ imagePreviewUrl, imageBase64, character, onReset }) => {
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState('');

  const submitFeedback = async (isCorrect: boolean, correctName: string) => {
    if (!imageBase64) return;
    setFeedbackStatus('submitting');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.post(`${apiUrl}/api/feedback`, {
        correctCharacter: isCorrect ? character.name : correctName,
        predictedCharacter: character.name,
        imageData: imageBase64
      });
      setFeedbackStatus('success');
    } catch (err) {
      console.error(err);
      setFeedbackStatus('error');
    }
  };

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
                <div className="prose prose-invert max-w-none text-sm leading-relaxed max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {character.description.split('\\n').map((paragraph, idx) => {
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

          <div className="mt-8 pt-6 border-t border-white/10">
            {/* Feedback Section */}
            {feedbackStatus === 'success' ? (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center text-green-400 space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Feedback saved! The model will learn from this in the next training cycle.</span>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-sm text-gray-400 mb-3 font-medium">Was this prediction correct?</p>
                {!showCorrection ? (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => submitFeedback(true, character.name)}
                      disabled={feedbackStatus === 'submitting'}
                      className="flex-1 py-2 px-4 bg-white/5 hover:bg-green-500/20 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm border border-white/10 hover:border-green-500/30"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Yes, it is {character.name}</span>
                    </button>
                    <button 
                      onClick={() => setShowCorrection(true)}
                      className="flex-1 py-2 px-4 bg-white/5 hover:bg-red-500/20 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm border border-white/10 hover:border-red-500/30"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>No, it's wrong</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-gray-400">Help the model improve! Who is this actually?</p>
                    <div className="flex space-x-2">
                      <select 
                        value={selectedCorrection}
                        onChange={(e) => setSelectedCorrection(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 text-sm text-white focus:border-ark-blue outline-none capitalize"
                      >
                        <option value="" disabled>Select Operator...</option>
                        {ALL_CHARACTERS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <button 
                        disabled={!selectedCorrection || feedbackStatus === 'submitting'}
                        onClick={() => submitFeedback(false, selectedCorrection)}
                        className="px-4 py-2 bg-ark-blue hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
                {feedbackStatus === 'error' && (
                  <p className="text-red-400 text-xs mt-2">Failed to submit feedback. Backend may be unreachable.</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
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
    </div>
  );
};
