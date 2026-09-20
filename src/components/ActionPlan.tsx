import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  LifeBuoy,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { RiskAnalysis } from '../types';

interface ActionPlanProps {
  analysis: RiskAnalysis;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ analysis }) => {
  const [copiedReport, setCopiedReport] = useState(false);

  const generateReportText = () => {
    return `--- RAPPORT D'AUDIT DE SÉCURITÉ PHIS GUARD ---
Date: ${new Date(analysis.timestamp).toLocaleString()}
Type: ${analysis.type.toUpperCase()}
Score de Risque: ${analysis.riskScore}/100 [${analysis.threatLevel.toUpperCase()}]
Verdict: ${analysis.verdictTitle}

SYNTHÈSE:
${analysis.summaryExplanation}

SIGNAUX D'ALERTE IDENTIFIÉS (${analysis.signals.length}):
${analysis.signals.map(s => `- [${s.severity.toUpperCase()}] ${s.title}: ${s.description}${s.matchedText ? ` (Preuve: "${s.matchedText}")` : ''}`).join('\n')}

MARQUES CIBLÉES: ${analysis.targetedBrands.join(', ') || 'Aucune identifiée'}
LIENS ANALYSÉS: ${analysis.extractedUrls.join(', ') || 'Aucun'}

RECOMMANDATIONS:
${analysis.recommendations.immediateActions.map(a => `* ${a}`).join('\n')}

PROCÉDURE D'URGENCE (SI COMPROMIS):
${analysis.recommendations.incidentResponse.map(r => `! ${r}`).join('\n')}

Audit généré par Phis Guard Cybersécurité
`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phis-guard-audit-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="action-plan-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-950/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-emerald-400" />
            <span>Protocole de Réponse & Conduite à Tenir</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mesures de neutralisation de la menace et plan d'action d'urgence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Rapport copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier rapport</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger .TXT</span>
          </button>
        </div>
      </div>

      {/* Immediate Actions vs What Not To Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ce qu'il faut faire */}
        <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Ce qu'il faut faire immédiatement
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-200">
            {analysis.recommendations.immediateActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ce qu'il ne faut PAS faire */}
        <div className="bg-slate-950/60 border border-red-500/20 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-3">
            <XCircle className="w-4 h-4" />
            À ne surtout pas faire
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-200">
            {analysis.recommendations.whatNotToDo.map((avoid, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{avoid}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Que faire en cas de compromission (J'ai cliqué ou donné mes identifiants) */}
      <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" />
          Procédure d'urgence : Vous avez déjà cliqué ou saisi des informations ?
        </h4>
        <p className="text-xs text-slate-300 mb-3">
          Pas de panique, mais agissez sans attendre. Suivez ces étapes selon les données transmises :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-white block mb-1">1. Mots de passe</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Changez immédiatement le mot de passe sur le site officiel concerné et activez la double authentification (2FA).
            </p>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-white block mb-1">2. Données bancaires</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Appelez le centre d'opposition de votre banque pour bloquer votre carte bancaire ou surveiller les mouvements frauduleux.
            </p>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
            <span className="font-semibold text-white block mb-1">3. Analyse d'appareil</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Lancez un scan antivirus sur votre ordinateur ou smartphone si un fichier ou exécutable a été téléchargé.
            </p>
          </div>
        </div>
      </div>

      {/* Official Incident Reporting Hub */}
      <div className="pt-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Signaler officiellement cette tentative de fraude :
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            href="https://www.internet-signalement.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all group"
          >
            <div>
              <span className="font-bold block text-white group-hover:text-cyan-400">PHAROS (Ministère)</span>
              <span className="text-[11px] text-slate-400">Signalement officiel français</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://www.signal-spam.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all group"
          >
            <div>
              <span className="font-bold block text-white group-hover:text-emerald-400">Signal-Spam</span>
              <span className="text-[11px] text-slate-400">Plateforme nationale anti-spam</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0" />
          </a>

          <a
            href="https://www.cybermalveillance.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all group"
          >
            <div>
              <span className="font-bold block text-white group-hover:text-amber-400">Cybermalveillance</span>
              <span className="text-[11px] text-slate-400">Assistance aux victimes</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
