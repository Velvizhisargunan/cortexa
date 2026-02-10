
import React, { useState } from 'react';
import { Brain, Sparkles, BookOpen, Clock, Activity, Layout as LayoutIcon, ChevronRight } from 'lucide-react';
import { UserMood, StudySessionState, CortexaOutput } from './types';
import { distillContent } from './geminiService';
import Header from './components/Header';
import FaceAnalysisPanel from './components/EmotionCheck';
import StudySession from './components/StudySession';
import ResultDisplay from './components/ResultDisplay';
import MockBrowser from './components/MockBrowser';

const App: React.FC = () => {
  const [state, setState] = useState<StudySessionState>({
    pageText: '',
    mood: UserMood.NEUTRAL,
    isProcessing: false,
    result: null,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'distill' | 'preview'>('distill');

  const handleMoodDetected = (detectedMood: UserMood) => {
    setState(prev => ({ ...prev, mood: detectedMood }));
  };

  const handleStartDistillation = async (text: string, currentMood: UserMood) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null, pageText: text, mood: currentMood }));
    
    try {
      const result = await distillContent(text, currentMood);
      setState(prev => ({ ...prev, result, isProcessing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isProcessing: false }));
    }
  };

  const resetSession = () => {
    setState({
      pageText: '',
      mood: UserMood.NEUTRAL,
      isProcessing: false,
      result: null,
      error: null,
    });
    setActiveTab('distill');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Biometric Panel */}
          <div className="lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Activity className="w-5 h-5" />
                  <h2 className="font-bold text-base tracking-tight">Intelligence Panel</h2>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  Biometrics
                </div>
              </div>
              
              <FaceAnalysisPanel 
                currentMood={state.mood} 
                onMoodDetected={handleMoodDetected} 
                disabled={state.isProcessing}
              />

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Cognitive Pressure
                  </div>
                  <span className={`text-[11px] font-bold ${
                    state.mood === UserMood.STRESSED ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {state.mood === UserMood.STRESSED ? 'HIGH' : 'OPTIMAL'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      state.mood === UserMood.STRESSED ? 'w-full bg-rose-500' :
                      state.mood === UserMood.OVERWHELMED ? 'w-[85%] bg-orange-500' :
                      state.mood === UserMood.TIRED ? 'w-3/5 bg-amber-500' :
                      'w-[30%] bg-indigo-600'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium leading-relaxed">
                  {state.mood === UserMood.STRESSED 
                    ? 'Engine priority set to maximum simplification and aggressive filtering.'
                    : 'Standard distillation active with moderate UI filtering.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-20 h-20" />
              </div>
              <h3 className="font-extrabold text-lg mb-2 relative z-10">Cortexa Pro</h3>
              <p className="text-slate-400 text-xs leading-relaxed relative z-10 mb-4">
                Unlock multi-site focus synchronization and advanced document scanning.
              </p>
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-tight transition-colors flex items-center justify-center gap-2 group/btn">
                Upgrade Now
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Main Workspace - Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 overflow-hidden min-h-[700px] flex flex-col">
              
              <div className="flex border-b border-slate-100 bg-slate-50/40 p-2">
                <button 
                  onClick={() => setActiveTab('distill')}
                  className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                    activeTab === 'distill' 
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Distill Content
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                    activeTab === 'preview' 
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  } ${!state.result ? 'opacity-40 cursor-not-allowed' : ''}`}
                  disabled={!state.result}
                >
                  <LayoutIcon className="w-4 h-4" />
                  Interface Preview
                </button>
              </div>

              <div className="flex-1 p-8 lg:p-12">
                {activeTab === 'distill' ? (
                  state.result ? (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                      <ResultDisplay 
                        result={state.result} 
                        onReset={resetSession}
                      />
                    </div>
                  ) : (
                    <StudySession 
                      onDistill={handleStartDistillation} 
                      isProcessing={state.isProcessing}
                      error={state.error}
                      currentMood={state.mood}
                    />
                  )
                ) : (
                  <MockBrowser 
                    css={state.result?.css || ''} 
                    hideSelectors={state.result?.hideElements || []}
                    originalText={state.pageText}
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
