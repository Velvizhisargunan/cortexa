
import React, { useRef, useState, useEffect } from 'react';
import { UserMood } from '../types';
import { Camera, RefreshCw, Zap, Coffee, CloudRain, Smile, Frown, Loader2, ShieldCheck, Video } from 'lucide-react';
import { detectMoodFromImage } from '../geminiService';

interface FaceAnalysisPanelProps {
  currentMood: UserMood;
  onMoodDetected: (mood: UserMood) => void;
  disabled?: boolean;
}

const moodIcons: Record<UserMood, any> = {
  [UserMood.FOCUSED]: { icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  [UserMood.NEUTRAL]: { icon: Smile, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  [UserMood.TIRED]: { icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' },
  [UserMood.OVERWHELMED]: { icon: CloudRain, color: 'text-orange-500', bg: 'bg-orange-50' },
  [UserMood.STRESSED]: { icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50' },
};

const FaceAnalysisPanel: React.FC<FaceAnalysisPanelProps> = ({ currentMood, onMoodDetected, disabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Please allow camera access for face analysis.");
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];
      const mood = await detectMoodFromImage(base64Image);
      onMoodDetected(mood);
      setLastAnalysis(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    setIsAnalyzing(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const ActiveMood = moodIcons[currentMood];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Biometric Feed</p>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="relative group overflow-hidden rounded-[2rem] border-2 border-slate-100 bg-slate-900 shadow-inner aspect-[4/3]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transition-opacity duration-700 ${isCameraActive ? 'opacity-70' : 'opacity-0'}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-scan-line"></div>
          <div className="absolute inset-0 border-[12px] border-slate-900/40"></div>
          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40"></div>
        </div>

        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-2">
            <Video className="w-8 h-8 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Initializing Feed...</span>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Analyzing Patterns</span>
          </div>
        )}
      </div>

      {/* Analysis Results Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${ActiveMood.bg}`}>
              <ActiveMood.icon className={`w-5 h-5 ${ActiveMood.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">State Detected</p>
              <h4 className="text-sm font-extrabold text-slate-900">{currentMood}</h4>
            </div>
          </div>
          <button
            onClick={captureAndAnalyze}
            disabled={disabled || isAnalyzing}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all active:scale-95 group"
            title="Re-scan Face"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Focus Logic Applied</span>
          </div>
          {lastAnalysis && (
            <span className="text-[9px] font-mono text-slate-400">SYNC: {lastAnalysis}</span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0% }
          50% { top: 100% }
          100% { top: 0% }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FaceAnalysisPanel;
