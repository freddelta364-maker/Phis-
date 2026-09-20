import React from 'react';
import { Eye, Copy, Check } from 'lucide-react';
import { WarningSignal } from '../types';

interface HighlightedViewerProps {
  content: string;
  sender?: string;
  subject?: string;
  signals: WarningSignal[];
}

export const HighlightedViewer: React.FC<HighlightedViewerProps> = ({
  content,
  sender,
  subject,
  signals,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText([sender ? `De: ${sender}` : '', subject ? `Objet: ${subject}` : '', content].filter(Boolean).join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collect text snippets to highlight
  const highlights = signals
    .filter(s => s.matchedText && s.matchedText.length > 2)
    .map(s => ({
      text: s.matchedText as string,
      category: s.category,
      title: s.title,
    }));

  // Simple highlighter logic: split and color matching segments
  const renderHighlightedText = (text: string) => {
    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    // Escape regex
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(${highlights.map(h => escapeRegExp(h.text)).join('|')})`,
      'gi'
    );

    const parts = text.split(pattern);

    return parts.map((part, index) => {
      const match = highlights.find(h => h.text.toLowerCase() === part.toLowerCase());
      if (match) {
        let badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
        if (match.category === 'domain_spoofing' || match.category === 'suspicious_link') {
          badgeColor = 'bg-red-500/25 text-red-300 border-red-500/40';
        } else if (match.category === 'credential_theft') {
          badgeColor = 'bg-rose-500/25 text-rose-300 border-rose-500/40';
        }

        return (
          <mark
            key={index}
            className={`px-1 py-0.5 rounded border text-xs font-mono font-medium mx-0.5 inline-block ${badgeColor}`}
            title={`Signal : ${match.title}`}
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div id="highlighted-viewer-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-950/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>Inspection Visuelle du Message</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Surlignage des éléments de manipulation psychologique et pièges techniques identifiés.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier le texte</span>
            </>
          )}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 my-3 text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Légende :</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          Urgence artificielle & Menaces
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          Demande d'identifiants & CB
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          Domaine / URL frauduleuse
        </span>
      </div>

      {/* Message envelope */}
      <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-4 space-y-3 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
        {sender && (
          <div className="pb-2 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">De :</span>
            <span className="text-slate-200">{renderHighlightedText(sender)}</span>
          </div>
        )}

        {subject && (
          <div className="pb-2 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-sans">Objet :</span>
            <span className="text-slate-200 font-bold">{renderHighlightedText(subject)}</span>
          </div>
        )}

        <div className="whitespace-pre-wrap font-sans text-slate-200 pt-1">
          {renderHighlightedText(content)}
        </div>
      </div>
    </div>
  );
};
