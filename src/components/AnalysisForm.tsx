import React, { useState } from 'react';
import { Mail, Globe, Sparkles, Trash2, ClipboardPaste, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { AnalysisType, PresetSample } from '../types';
import { PRESET_SAMPLES } from '../data/presets';

interface AnalysisFormProps {
  onAnalyze: (input: string, type: AnalysisType, sender?: string, subject?: string) => void;
  isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<AnalysisType>('email');
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const handleApplyPreset = (preset: PresetSample) => {
    setSelectedPresetId(preset.id);
    setActiveTab(preset.type);
    setContent(preset.content);
    setSender(preset.sender || '');
    setSubject(preset.subject || '');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        setSelectedPresetId('');
      }
    } catch {
      // Ignore clipboard read permission failures
    }
  };

  const handleClear = () => {
    setContent('');
    setSender('');
    setSubject('');
    setSelectedPresetId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAnalyze(content.trim(), activeTab, sender.trim() || undefined, subject.trim() || undefined);
  };

  return (
    <div id="cyber-analysis-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-slate-950/60 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            Scanner de Contenu Suspect
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Collez le texte d'un email, un SMS ou une URL pour inspecter les signaux d'hameçonnage.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            id="tab-email-btn"
            type="button"
            onClick={() => {
              setActiveTab('email');
              setSelectedPresetId('');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'email'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email ou SMS</span>
          </button>
          <button
            id="tab-url-btn"
            type="button"
            onClick={() => {
              setActiveTab('url');
              setSelectedPresetId('');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL / Lien Web</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="my-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Exemples concrets à tester :
          </span>
          <span className="text-[11px] text-slate-400">1 clic pour charger</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_SAMPLES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.15)] text-white'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold truncate text-slate-200">{preset.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      preset.expectedRisk === 'critical'
                        ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                        : preset.expectedRisk === 'high'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'email' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-sender" className="block text-xs font-semibold text-slate-300 mb-1">
                Expéditeur (Optionnel mais recommandé)
              </label>
              <input
                id="input-sender"
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Ex: service@chronopost-suivi-express.top"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/40 transition-all font-mono"
              />
            </div>
            <div>
              <label htmlFor="input-subject" className="block text-xs font-semibold text-slate-300 mb-1">
                Objet / Titre du message (Optionnel)
              </label>
              <input
                id="input-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: URGENT : Votre colis est bloqué en douane"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/40 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-content" className="block text-xs font-semibold text-slate-300">
              {activeTab === 'email' ? 'Corps du message ou texte suspect :' : 'URL ou adresse web suspecte :'}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-paste-content"
                onClick={handlePaste}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                title="Coller depuis le presse-papier"
              >
                <ClipboardPaste className="w-3 h-3 text-cyan-400" />
                <span>Coller</span>
              </button>
              {content && (
                <button
                  type="button"
                  id="btn-clear-content"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition-colors"
                  title="Effacer le formulaire"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Effacer</span>
                </button>
              )}
            </div>
          </div>

          {activeTab === 'email' ? (
            <textarea
              id="input-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Collez ici l'intégralité du texte du message suspect (y compris les liens, formules d'urgence ou demandes de confirmation)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/40 transition-all font-sans leading-relaxed resize-y"
            />
          ) : (
            <input
              id="input-content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: https://paypa1-security-update.account-auth.buzz/login"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition-all font-mono"
            />
          )}

          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span>
              {content.length > 0 ? `${content.length} caractères saisis` : 'Aucun contenu'}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Analyse confidentielle et locale
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Ne cliquez jamais sur les liens avant que l'analyse soit terminée.</span>
          </div>

          <button
            id="btn-run-analysis"
            type="submit"
            disabled={!content.trim() || isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-lg ${
              !content.trim() || isLoading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Inspection en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyser avec Phis Guard</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
