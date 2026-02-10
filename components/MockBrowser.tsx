
import React, { useState } from 'react';
import { Eye, EyeOff, Info, Globe, ShieldCheck } from 'lucide-react';

interface MockBrowserProps {
  css: string;
  hideSelectors: string[];
  originalText: string;
}

const MockBrowser: React.FC<MockBrowserProps> = ({ css, hideSelectors, originalText }) => {
  const [isApplied, setIsApplied] = useState(false);

  // Mock site structure
  const mockElements = [
    { type: 'header', content: 'Academic Portal 2024', selector: 'header' },
    { type: 'nav', content: 'Home | Profile | Courses | Billing | Logout', selector: 'nav' },
    { type: 'aside', content: '🔥 FLASH SALE! 50% OFF PRO VERSION!', selector: 'aside', isDistraction: true },
    { type: 'ad', content: 'ADVERTISEMENT: Cheap textbook rentals here!', selector: '.ad', isDistraction: true },
    { type: 'main', content: originalText || 'No content provided.', selector: 'main' },
    { type: 'footer', content: '© 2024 University Docs. Newsletter Signup below.', selector: 'footer' },
    { type: 'popup', content: 'SUBSCRIBE NOW!', selector: '.popup', isDistraction: true },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Focus Preview</h2>
          <p className="text-slate-500 text-sm">See how Cortexa's rules would clean up the page.</p>
        </div>
        <button
          onClick={() => setIsApplied(!isApplied)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            isApplied 
              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          }`}
        >
          {isApplied ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isApplied ? 'Disable Cleanup' : 'Preview Focus Mode'}
        </button>
      </div>

      <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 p-1 flex flex-col overflow-hidden">
        {/* Browser URL Bar */}
        <div className="bg-white px-4 py-2 flex items-center gap-3 rounded-t-lg border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-1 flex items-center gap-2 text-[10px] text-slate-400">
            <Globe className="w-3 h-3" />
            https://university-docs.edu/course-materials/gen-ai-fundamentals
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-6 overflow-y-auto space-y-4 relative">
          <style>
            {isApplied ? `
              ${hideSelectors.join(',\n')} { display: none !important; }
              ${css}
            ` : ''}
          </style>

          {mockElements.map((el, i) => (
            <div 
              key={i} 
              className={`p-4 rounded border transition-all duration-500 ${
                el.isDistraction ? 'bg-amber-50 border-amber-200 border-dashed text-amber-800' : 'bg-white border-slate-100 text-slate-700'
              } ${isApplied && (hideSelectors.includes(el.selector) || el.isDistraction) ? 'opacity-0 scale-95 pointer-events-none' : ''}`}
              style={{
                display: isApplied && (hideSelectors.includes(el.selector) || el.isDistraction) ? 'none' : 'block'
              }}
            >
              <div className="text-[10px] font-bold text-slate-300 uppercase mb-1">{el.selector}</div>
              <div className={el.type === 'main' ? 'text-sm' : 'text-xs'}>
                {el.content}
              </div>
            </div>
          ))}

          {!isApplied && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <div className="bg-indigo-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-xl border border-indigo-700/50">
                <Info className="w-4 h-4" />
                Distractions detected. Toggle preview to hide.
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[11px] text-slate-400">
          The preview demonstrates how Cortexa dynamically modifies the DOM and applies specific focus-oriented styling.
        </p>
      </div>
    </div>
  );
};

export default MockBrowser;
