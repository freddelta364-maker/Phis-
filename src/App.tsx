import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AnalysisForm } from './components/AnalysisForm';
import { RiskScoreCard } from './components/RiskScoreCard';
import { SignalList } from './components/SignalList';
import { HighlightedViewer } from './components/HighlightedViewer';
import { ActionPlan } from './components/ActionPlan';
import { CyberGuide } from './components/CyberGuide';
import { AnalysisType, RiskAnalysis } from './types';
import { analyzeContent } from './services/analyzer';
import { ShieldCheck, ShieldAlert, Sparkles, Lock, ArrowDown } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (
    input: string,
    type: AnalysisType,
    sender?: string,
    subject?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await analyzeContent(input, type, sender, subject);
      setAnalysis(result);

      // Auto-scroll to results smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Error during analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navbar */}
      <Navbar
        onOpenGuide={() => setShowGuide(!showGuide)}
        onScrollToForm={handleScrollToForm}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden py-10 sm:py-14 px-4 sm:px-6 border-b border-slate-900 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-5 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-emerald-400">Phis Guard</span>
            <span className="text-slate-500">•</span>
            <span>Sécurité & Analyse d'Hameçonnage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Détecteur de tentatives de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">phishing</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Analysez instantanément un email suspect ou une URL. Phis Guard démasque
            les <strong className="text-amber-300 font-semibold">urgences artificielles</strong>, les <strong className="text-red-300 font-semibold">domaines imitant des marques</strong> et les <strong className="text-rose-300 font-semibold">demandes d'identifiants</strong> avec un score de risque précis.
          </p>

          {/* Core Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Urgence artificielle & stress
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Faux domaines & Typosquatting
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Vol d'identifiants & CB
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Score de Risque 0-100
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Educational Guide Toggleable */}
        {showGuide && (
          <CyberGuide onClose={() => setShowGuide(false)} />
        )}

        {/* Form Container */}
        <div ref={formRef}>
          <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Results Container */}
        {analysis && (
          <div ref={resultsRef} className="space-y-8 pt-4">
            {/* Divider with anchor label */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Résultats de l'Audit Cyber
              </span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* 1. Global Score & Verdict */}
            <RiskScoreCard analysis={analysis} />

            {/* 2. Detected Warning Signals List */}
            <SignalList signals={analysis.signals} />

            {/* 3. Highlighted Message Inspector */}
            <HighlightedViewer
              content={analysis.inputContent}
              sender={analysis.sender}
              subject={analysis.subject}
              signals={analysis.signals}
            />

            {/* 4. Action Plan & Incident Response */}
            <ActionPlan analysis={analysis} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 mt-16 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Phis Guard</span>
            <span>— Plateforme de détection et prévention du cyber-risque</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Données non stockées</span>
            <span>•</span>
            <span>Moteur heuristique conforme RGPD</span>
            <span>•</span>
            <button
              onClick={() => setShowGuide(true)}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Guide Phishing
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
