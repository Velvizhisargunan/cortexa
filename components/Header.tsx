
import React from 'react';
import { Brain, Sparkles, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">Cortexa</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Focus Intelligence Engine</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {['Dashboard', 'Library', 'Insights', 'Community'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full">
              <Settings className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-900 rounded-full hover:bg-slate-800 transition-all group">
              <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Premium Account</span>
            </button>
          </div>
        </div>

        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
