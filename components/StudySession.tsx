
import React, { useState } from 'react';
// Fix: Added missing Brain icon to the lucide-react import list.
import { Wand2, Loader2, AlertCircle, FileText, Layers, MousePointer2, Brain } from 'lucide-react';
import { UserMood } from '../types';

interface StudySessionProps {
  onDistill: (text: string, mood: UserMood) => void;
  isProcessing: boolean;
  error: string | null;
  currentMood: UserMood;
}

const StudySession: React.FC<StudySessionProps> = ({ onDistill, isProcessing, error, currentMood }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length < 50) {
      alert("Please enter a bit more content to distill (at least 50 characters).");
      return;
    }
    onDistill(text, currentMood);
  };

  const handlePasteSample = () => {
    const sample = `
      Deep learning models have evolved rapidly, with Transformers becoming the backbone of natural language processing. 
      The core mechanism is self-attention, which allows a model to weigh the significance of different parts of the input data.
      Crucial exam topics:
      - Architecture of LLMs: Encoding vs Decoding layers.
      - Tokenization strategies: WordPiece vs BPE.
      - Optimization techniques: Gradient descent and adaptive learning rates.
      - Quantization: Reducing model precision (e.g., from FP32 to INT8) for edge deployment.
      - Zero-shot vs Few-shot learning paradigms.
      - Ethical considerations in AI: Bias mitigation and data provenance.
      Important: Ignore the sidebar "Buy Credits" banner and the social media feed on the right side of the learning portal.
    `;
    setText(sample.trim());
  };

  return (
    <div className="h-full flex flex-col space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Focus Laboratory</h2>
        <p className="text-slate-500 text-base max-w-md mx-auto leading-relaxed">
          Input your raw study content. Cortexa will distill it and neutralize UI noise.
        </p>
      </div>

      <div className="flex-1 relative group">
        <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl -m-1 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste complex notes, research papers, or documentation..."
          className="w-full h-full min-h-[350px] p-6 bg-white border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 outline-none resize-none transition-all font-medium text-slate-700 leading-relaxed shadow-sm relative z-10"
          disabled={isProcessing}
        />
        {!text && !isProcessing && (
          <button 
            onClick={handlePasteSample}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 bg-slate-50 hover:bg-white text-indigo-600 border border-slate-200 rounded-2xl text-xs font-bold tracking-tight shadow-sm flex items-center gap-2 transition-all z-20 group"
          >
            <MousePointer2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Paste Sample Context
          </button>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl z-30 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <Brain className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-900 font-extrabold mt-6 tracking-tight">Calibrating Focus Logic</p>
            <p className="text-slate-400 text-xs mt-1 font-semibold uppercase tracking-widest">Applying {currentMood} constraints</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !text.trim()}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-extrabold text-sm tracking-tight transition-all active:scale-95 ${
            isProcessing || !text.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 border border-slate-900'
          }`}
        >
          <Wand2 className={`w-5 h-5 ${isProcessing ? 'animate-pulse' : ''}`} />
          {isProcessing ? 'Processing Engine...' : 'Run Distillation'}
        </button>
      </div>

      <div className="flex items-center gap-8 text-slate-300 text-[10px] justify-center uppercase tracking-[0.2em] font-black pt-2">
        <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Research Grade</span>
        <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> UI Neuralizer</span>
      </div>
    </div>
  );
};

export default StudySession;
