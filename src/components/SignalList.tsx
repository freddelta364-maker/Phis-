import React, { useState } from 'react';
import { 
  Flame, 
  Globe2, 
  KeyRound, 
  Link2, 
  UserX, 
  FileCode, 
  AlertOctagon, 
  CheckCircle, 
  Filter
} from 'lucide-react';
import { WarningSignal, SignalCategory, ThreatSeverity } from '../types';

interface SignalListProps {
  signals: WarningSignal[];
}

export const SignalList: React.FC<SignalListProps> = ({ signals }) => {
  const [filter, setFilter] = useState<string>('all');

  const getCategoryIcon = (cat: SignalCategory) => {
    switch (cat) {
      case 'urgency':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'domain_spoofing':
        return <Globe2 className="w-4 h-4 text-red-400" />;
      case 'credential_theft':
        return <KeyRound className="w-4 h-4 text-rose-400" />;
      case 'suspicious_link':
        return <Link2 className="w-4 h-4 text-purple-400" />;
      case 'sender_anomaly':
        return <UserX className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertOctagon className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSeverityBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
            Critique
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
            Élevé
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Moyen
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Info
          </span>
        );
    }
  };

  const filteredSignals = signals.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return s.severity === 'critical' || s.severity === 'high';
    return s.category === filter;
  });

  return (
    <div id="signals-breakdown-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-950/40">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <span>Signaux d'Alerte Détectés</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
              {signals.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Éléments concrets d'ingénierie sociale et indicateurs de compromission identifiés.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({signals.length})
          </button>
          <button
            onClick={() => setFilter('urgency')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'urgency'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Urgence</span>
          </button>
          <button
            onClick={() => setFilter('domain_spoofing')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'domain_spoofing'
                ? 'bg-red-950/70 text-red-300 border border-red-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3 h-3 text-red-400" />
            <span>Faux Domaine</span>
          </button>
          <button
            onClick={() => setFilter('credential_theft')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'credential_theft'
                ? 'bg-rose-950/70 text-rose-300 border border-rose-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3 h-3 text-rose-400" />
            <span>Identifiants</span>
          </button>
        </div>
      </div>

      {/* Signal Cards List */}
      {filteredSignals.length === 0 ? (
        <div className="py-8 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400/80 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-200">Aucun signal d'alerte dans cette catégorie</p>
          <p className="text-xs text-slate-400 mt-1">Le contenu analysé ne présente pas cette typologie de menace.</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getCategoryIcon(signal.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{signal.title}</h4>
                      {getSeverityBadge(signal.severity)}
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {signal.description}
                    </p>

                    {/* Matched excerpt / evidence quote */}
                    {signal.matchedText && (
                      <div className="mt-2.5 flex items-start gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-xs">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <div className="overflow-hidden">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Preuve identifiée dans le message :</span>
                          <code className="text-amber-300 font-mono break-all text-xs bg-slate-950 px-1.5 py-0.5 rounded">
                            "{signal.matchedText}"
                          </code>
                        </div>
                      </div>
                    )}

                    {/* Technical details badge if available */}
                    {signal.technicalDetails && (
                      <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>Détail technique : {signal.technicalDetails}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
