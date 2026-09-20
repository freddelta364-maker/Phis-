import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onScrollToForm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuide, onScrollToForm }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onScrollToForm}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo-btn"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-500/20 border border-emerald-500/40 text-emerald-400 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Phis <span className="text-emerald-400">Guard</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                v2.4 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Détecteur de Phishing & Analyse Cyber-Menaces
            </p>
          </div>
        </div>

        {/* Live Engine Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Moteur Heuristique & IA Prêt</span>
          </div>

          <button
            id="nav-guide-btn"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guide Réflexe</span>
          </button>

          <button
            id="nav-scan-cta"
            onClick={onScrollToForm}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_12px_rgba(52,211,153,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nouveau Scan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
