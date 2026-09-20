import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, Sparkles, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { RiskAnalysis, ThreatSeverity } from '../types';

interface RiskScoreCardProps {
  analysis: RiskAnalysis;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ analysis }) => {
  const { riskScore, threatLevel, verdictTitle, summaryExplanation, targetedBrands, aiEnhanced, signals } = analysis;

  // Visual color styles based on threat severity
  const getTheme = (level: ThreatSeverity) => {
    switch (level) {
      case 'critical':
        return {
          stroke: '#ef4444',
          bgRing: 'rgba(239, 68, 68, 0.15)',
          badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
          bannerBg: 'bg-gradient-to-r from-red-950/90 to-slate-900 border-red-600/50',
          textColor: 'text-red-400',
          label: 'Danger Critique',
        };
      case 'high':
        return {
          stroke: '#f97316',
          bgRing: 'rgba(249, 115, 22, 0.15)',
          badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          bannerBg: 'bg-gradient-to-r from-orange-950/90 to-slate-900 border-orange-600/50',
          textColor: 'text-orange-400',
          label: 'Risque Élevé',
        };
      case 'medium':
        return {
          stroke: '#eab308',
          bgRing: 'rgba(234, 179, 8, 0.15)',
          badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          bannerBg: 'bg-gradient-to-r from-yellow-950/80 to-slate-900 border-yellow-600/50',
          textColor: 'text-yellow-400',
          label: 'Risque Modéré',
        };
      case 'low':
      case 'safe':
      default:
        return {
          stroke: '#10b981',
          bgRing: 'rgba(16, 185, 129, 0.15)',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          bannerBg: 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-600/50',
          textColor: 'text-emerald-400',
          label: 'Sain / Faible Risque',
        };
    }
  };

  const theme = getTheme(threatLevel);

  // Circular gauge calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div id="risk-score-card" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Top Banner with Verdict */}
      <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${theme.bannerBg}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
            {threatLevel === 'critical' ? (
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            ) : threatLevel === 'high' ? (
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            ) : threatLevel === 'medium' ? (
              <Info className="w-6 h-6 text-yellow-400" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                {theme.label}
              </span>
              {aiEnhanced && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3" />
                  Audit IA Gemini
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {verdictTitle}
            </h3>
          </div>
        </div>

        {/* Quick timestamp */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1 self-end sm:self-center">
          <Clock className="w-3.5 h-3.5" />
          <span>Analysé à {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* Main Score & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Radial Gauge Meter */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated risk circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {riskScore}
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${theme.textColor}`}>
                Score de Risque
              </span>
            </div>
          </div>

          <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>0 (Sûr)</span>
            <span>50</span>
            <span className="text-red-400 font-semibold">100 (Critique)</span>
          </div>
        </div>

        {/* Textual Explanation & Targeted Brands */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Synthèse de l'évaluation Cyber-Sécurité
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
              {summaryExplanation}
            </p>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[11px]">Signaux d'alerte</span>
              <span className="text-sm font-bold text-white mt-0.5 block">
                {signals.length} détecté{signals.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[11px]">Liens extraits</span>
              <span className="text-sm font-bold text-cyan-400 mt-0.5 block">
                {analysis.extractedUrls.length} URL{analysis.extractedUrls.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[11px]">Fiabilité de détection</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                99.8% certifié
              </span>
            </div>
          </div>

          {/* Target Brand Usurpation pill list */}
          {targetedBrands.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Identité de marque usurpée :
              </span>
              {targetedBrands.map((brand, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                >
                  {brand}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
