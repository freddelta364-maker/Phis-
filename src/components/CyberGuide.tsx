import React from 'react';
import { BookOpen, ShieldCheck, Flame, Globe, Key, CheckCircle, XCircle } from 'lucide-react';

interface CyberGuideProps {
  onClose: () => void;
}

export const CyberGuide: React.FC<CyberGuideProps> = ({ onClose }) => {
  return (
    <div id="cyber-guide-modal" className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Guide Réflexe Anti-Phishing</h3>
            <p className="text-xs text-slate-400">
              Comment repérer les 3 pièges majeurs exploités par les cybercriminels.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Fermer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Signal 1: Urgence Artificielle */}
        <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Flame className="w-4 h-4" />
            <span>1. L'Urgence Artificielle</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Le pirate cherche à neutraliser votre esprit critique en provoquant de la panique ou de la précipitation.
          </p>
          <div className="space-y-2 text-[11px] pt-1 border-t border-slate-800">
            <div className="flex items-start gap-1.5 text-red-300">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>« Action sous 24h », « Compte suspendu ce soir », « Frais de pénalité immédiats »</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Les vraies institutions laissent des délais légaux et contactent par courrier ou espace client sécurisé.</span>
            </div>
          </div>
        </div>

        {/* Signal 2: Domaine Imitant une Marque */}
        <div className="bg-slate-950/70 border border-red-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>2. Le Domaine Usurpé</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Les attaquants achètent des domaines ressemblants (typosquatting, homoglyphes, faux sous-domaines).
          </p>
          <div className="space-y-2 text-[11px] pt-1 border-t border-slate-800">
            <div className="flex items-start gap-1.5 text-red-300 font-mono">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
              <span>paypa1-security.xyz (le vrai domaine est xyz, pas PayPal !)</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>Regardez toujours ce qui se trouve juste avant la première barre oblique (/).</span>
            </div>
          </div>
        </div>

        {/* Signal 3: Demande d'Identifiants */}
        <div className="bg-slate-950/70 border border-rose-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Key className="w-4 h-4" />
            <span>3. Demande d'Identifiant</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Le but final est d'extorquer votre mot de passe, numéro de CB ou code reçu par SMS.
          </p>
          <div className="space-y-2 text-[11px] pt-1 border-t border-slate-800">
            <div className="flex items-start gap-1.5 text-red-300">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
              <span>« Confirmez votre mot de passe », « Saisissez votre code SMS 2FA pour annuler »</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
              <span>Règle d'or : votre banque ou votre administrateur IT ne vous demandera JAMAIS votre mot de passe.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anatomy of an URL visual graphic */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
        <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Anatomie d'une URL : Savoir lire la véritable destination
        </h4>
        <div className="bg-slate-900 p-3 rounded-lg font-mono text-[12px] overflow-x-auto">
          <span className="text-slate-400">https://</span>
          <span className="text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded">login.microsoft.com.</span>
          <span className="text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800">
            serveur-piege.xyz
          </span>
          <span className="text-slate-400">/auth/signin</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          💡 <strong>Attention :</strong> Même si "microsoft.com" est écrit au début, le <strong>seul et unique site réel</strong> vers lequel vous allez est <strong className="text-red-400">serveur-piege.xyz</strong>. Tout ce qui précède n'est qu'un sous-domaine trompeur créé par le pirate.
        </p>
      </div>
    </div>
  );
};
