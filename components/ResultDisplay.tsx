
import React from 'react';
import { CortexaOutput } from '../types';
import { CheckCircle2, Copy, RefreshCw, Layers, Terminal, Sparkles, Hash } from 'lucide-react';

interface ResultDisplayProps {
  result: CortexaOutput;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Silent success for professional feel or a subtle toast if implemented
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Executive Summary
          </h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Core concepts prioritized for maximum retention.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => copyToClipboard(result.summary.join('\n'))}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all text-xs font-bold"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy All
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.summary.map((point, i) => (
          <div 
            key={i} 
            className="group bg-white border border-slate-200/60 p-5 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors">
              0{i + 1}
            </div>
            <p className="text-slate-700 text-sm font-semibold leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            <Layers className="w-3.5 h-3.5" />
            Heuristic UI Neutralization
          </div>
          <div className="bg-slate-900 p-5 rounded-3xl font-mono text-xs border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-2">
                <Hash className="w-3 h-3" /> Targeted Selectors
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              </div>
            </div>
            <div className="max-h-[140px] overflow-y-auto space-y-1 text-indigo-300">
              {result.hideElements.length > 0 ? (
                result.hideElements.map((sel, i) => <div key={i} className="hover:bg-indigo-500/10 px-1 rounded transition-colors">{sel}</div>)
              ) : (
                <div className="text-slate-600 italic">No distractions identified.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            <Terminal className="w-3.5 h-3.5" />
            Applied Focus CSS
          </div>
          <div className="bg-slate-900 p-5 rounded-3xl font-mono text-xs border border-slate-800 shadow-xl">
             <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-slate-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Runtime Styles
              </span>
              <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Copy Rule</button>
            </div>
            <div className="max-h-[140px] overflow-y-auto whitespace-pre-wrap text-emerald-400 leading-relaxed">
              {result.css || '/* Standard optimization applied */'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
