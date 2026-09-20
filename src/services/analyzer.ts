import { AnalysisType, RiskAnalysis, ThreatSeverity, WarningSignal } from '../types';

// Known popular brands frequently targeted in phishing attacks
const MONITORED_BRANDS = [
  { name: 'PayPal', patterns: [/paypal/i, /paypa1/i, /pay-pal/i, /paiement-paypal/i], officialDomains: ['paypal.com', 'paypal.fr'] },
  { name: 'Microsoft 365 / Outlook', patterns: [/microsoft/i, /micros0ft/i, /office365/i, /outlook/i, /onedrive/i, /sharepoint/i, /ms-login/i], officialDomains: ['microsoft.com', 'office.com', 'live.com', 'outlook.com'] },
  { name: 'Impôts / DGFiP', patterns: [/impots?(\.gouv)?/i, /dgfip/i, /finances-publiques/i, /fiscal(ite)?/i], officialDomains: ['impots.gouv.fr', 'economie.gouv.fr'] },
  { name: 'Ameli / Assurance Maladie', patterns: [/ameli/i, /carte-vitale/i, /assurance-maladie/i, /secu(rite)?-sociale/i], officialDomains: ['ameli.fr'] },
  { name: 'Chronopost / La Poste / Colissimo', patterns: [/chronopost/i, /colissimo/i, /laposte/i, /suivi-colis/i, /douane-colis/i], officialDomains: ['laposte.fr', 'chronopost.fr', 'colissimo.fr'] },
  { name: 'Google / Gmail', patterns: [/google/i, /g00gle/i, /gmail/i, /google-drive/i], officialDomains: ['google.com', 'google.fr', 'accounts.google.com'] },
  { name: 'Apple / iCloud', patterns: [/apple/i, /icloud/i, /appleid/i, /itunes/i], officialDomains: ['apple.com', 'icloud.com'] },
  { name: 'Netflix', patterns: [/netflix/i, /netf1ix/i], officialDomains: ['netflix.com'] },
  { name: 'Amazon', patterns: [/amazon/i, /amaz0n/i, /prime-video/i], officialDomains: ['amazon.fr', 'amazon.com'] },
  { name: 'Banque (Société Générale, BNP, CA)', patterns: [/societe-generale/i, /bnp/i, /credit-agricole/i, /caisse-epargne/i, /banque-postale/i], officialDomains: ['societegenerale.fr', 'mabanque.bnpparibas', 'credit-agricole.fr'] },
];

const HIGH_RISK_TLDS = ['.top', '.xyz', '.cfd', '.buzz', '.cc', '.tk', '.ml', '.ga', '.cf', '.gq', '.click', '.site', '.online', '.rest', '.icu', '.work', '.support', '.live'];

const URGENCY_TRIGGERS = [
  { regex: /\b(24\s*h(eures)?|48\s*h(eures)?|2\s*h(eures)?|imm[eé]diat(ement)?|sans d[eé]lai)\b/i, label: 'Délai d\'action très court (2h à 48h)' },
  { regex: /\b(d[eé]finitivement\s+suspendu|cl[oô]ture|suppression d[eé]finitive|interruption)\b/i, label: 'Menace de suspension ou suppression de compte' },
  { regex: /\b(derni[eè]re\s+sommation|p[eé]nalit[eé]|amende|huissier|sanction)\b/i, label: 'Menaces de sanctions financières ou judiciaires' },
  { regex: /\b(action\s+requise|urgent|avertissement|alerte\s+critique)\b/i, label: 'Ton alarmiste et impératif' },
  { regex: /\b(expir(e|era)\s+aujourd'hui|expire\s+dans)\b/i, label: 'Expiration artificielle' },
];

const CREDENTIAL_TRIGGERS = [
  { regex: /\b(mot\s+de\s+passe|password|code\s+confidentiel|code\s+secret)\b/i, label: 'Demande de mot de passe ou code confidentiel' },
  { regex: /\b(carte\s+bancaire|num[eé]ro\s+de\s+carte|cvv|cryptogramme|expiration\s+cb)\b/i, label: 'Demande d\'informations de carte bancaire' },
  { regex: /\b(code\s+(sms|2fa|otp|re[cç]u\s+par\s+t[eé]l[eé]phone))\b/i, label: 'Tentative de récupération de code 2FA / SMS' },
  { regex: /\b(num[eé]ro\s+fiscal|num[eé]ro\s+de\s+s[eé]curit[eé]\s+sociale|pi[eè]ce\s+d'identit[eé]|carte\s+vitale)\b/i, label: 'Collecte de données personnelles sensibles (PII)' },
];

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\\^`]+|www\.[^\s<>"'{}|\\^`]+|[a-zA-Z0-9-]+\.(?:com|fr|org|net|top|xyz|cfd|buzz|online|site|cc|info)\b[^\s<>"'{}|\\^`]*)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches.map(u => u.startsWith('http') ? u : `https://${u}`)));
}

export function parseDomain(urlStr: string): { hostname: string; protocol: string; isIp: boolean; tld: string; subdomains: string[] } {
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    const hostname = parsed.hostname.toLowerCase();
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    const parts = hostname.split('.');
    const tld = parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
    const subdomains = parts.slice(0, -2);
    return {
      hostname,
      protocol: parsed.protocol,
      isIp,
      tld,
      subdomains,
    };
  } catch {
    return {
      hostname: urlStr,
      protocol: 'http:',
      isIp: false,
      tld: '',
      subdomains: [],
    };
  }
}

/**
 * Heuristic fallback and fast evaluation engine
 */
export function analyzePhishingLocally(
  input: string,
  type: AnalysisType,
  sender?: string,
  subject?: string
): RiskAnalysis {
  const fullText = [sender || '', subject || '', input].join('\n');
  const extractedUrls = extractUrls(fullText);
  const signals: WarningSignal[] = [];
  const targetedBrands: string[] = [];

  let riskScore = 0;

  // 1. SIGNAL: Urgence artificielle & pression psychologique
  let urgencyCount = 0;
  for (const trigger of URGENCY_TRIGGERS) {
    const match = fullText.match(trigger.regex);
    if (match) {
      urgencyCount++;
      signals.push({
        id: `urgency-${urgencyCount}`,
        category: 'urgency',
        title: 'Urgence artificielle détectée',
        severity: urgencyCount > 1 ? 'critical' : 'high',
        description: `Le message applique une pression temporelle pour forcer une action précipitée : "${match[0]}". C'est l'un des leviers psychologiques les plus courants en ingénierie sociale.`,
        matchedText: match[0],
        technicalDetails: trigger.label,
      });
    }
  }
  if (urgencyCount > 0) {
    riskScore += Math.min(35, urgencyCount * 18);
  }

  // 2. SIGNAL: Demande d'identifiants & données bancaires
  let credCount = 0;
  for (const trigger of CREDENTIAL_TRIGGERS) {
    const match = fullText.match(trigger.regex);
    if (match) {
      credCount++;
      signals.push({
        id: `cred-${credCount}`,
        category: 'credential_theft',
        title: 'Collecte d\'informations sensibles',
        severity: 'critical',
        description: `Le message sollicite des identifiants confidentiels ou des moyens de paiement (${trigger.label}) : "${match[0]}". Aucune institution légitime (banque, impôts, service IT) ne réclame ces informations par email.`,
        matchedText: match[0],
        technicalDetails: trigger.label,
      });
    }
  }
  if (credCount > 0) {
    riskScore += Math.min(45, credCount * 25);
  }

  // 3. SIGNAL: Analyse des marques & Domaine imitant une marque / Typosquatting
  for (const brand of MONITORED_BRANDS) {
    const mentionsBrand = brand.patterns.some(p => p.test(fullText));
    if (mentionsBrand) {
      targetedBrands.push(brand.name);

      // Check sender domain if provided
      if (sender) {
        const senderDomain = sender.split('@')[1]?.toLowerCase() || '';
        const isOfficial = brand.officialDomains.some(od => senderDomain.endsWith(od));
        if (!isOfficial && senderDomain) {
          signals.push({
            id: `brand-sender-${brand.name}`,
            category: 'sender_anomaly',
            title: `Usurpation d'expéditeur (${brand.name})`,
            severity: 'critical',
            description: `Le message prétend émaner de "${brand.name}", mais l'adresse réelle de l'expéditeur (${sender}) n'appartient pas aux domaines officiels vérifiés (${brand.officialDomains.join(', ')}).`,
            matchedText: sender,
            technicalDetails: `Domaine réel : ${senderDomain}`,
          });
          riskScore += 35;
        }
      }

      // Check extracted URLs
      for (const url of extractedUrls) {
        const domainInfo = parseDomain(url);
        const isOfficialUrl = brand.officialDomains.some(od => domainInfo.hostname.endsWith(od));
        if (!isOfficialUrl) {
          signals.push({
            id: `brand-url-${brand.name}-${domainInfo.hostname}`,
            category: 'domain_spoofing',
            title: `Faux domaine imitant ${brand.name}`,
            severity: 'critical',
            description: `Lien suspect pointant vers "${domainInfo.hostname}". Ce domaine utilise le nom de la marque ${brand.name} dans un sous-domaine ou un libellé trompeur pour tromper la victime, mais le nom de domaine racine est illégitime.`,
            matchedText: url,
            technicalDetails: `Hôte analysé : ${domainInfo.hostname} (Protocole: ${domainInfo.protocol})`,
          });
          riskScore += 40;
        }
      }
    }
  }

  // 4. SIGNAL: Analyse technique des URLs (TLD suspect, IP brute, HTTP sans SSL, empilement sous-domaines)
  for (const url of extractedUrls) {
    const info = parseDomain(url);

    // IP directe
    if (info.isIp) {
      signals.push({
        id: `url-ip-${url}`,
        category: 'suspicious_link',
        title: 'Utilisation d\'une adresse IP directe',
        severity: 'critical',
        description: `Le lien utilise directement une adresse IP brute (${info.hostname}) au lieu d'un nom de domaine officiel. Technique typique pour masquer un serveur malveillant éphémère.`,
        matchedText: url,
        technicalDetails: `IP : ${info.hostname}`,
      });
      riskScore += 30;
    }

    // TLD risqué
    if (HIGH_RISK_TLDS.includes(info.tld.toLowerCase())) {
      signals.push({
        id: `url-tld-${info.tld}`,
        category: 'domain_spoofing',
        title: `Extension de domaine à haut risque (${info.tld})`,
        severity: 'high',
        description: `L'extension "${info.tld}" est massivement exploitée dans les campagnes de phishing en raison de son coût très bas ou de son anonymat.`,
        matchedText: url,
        technicalDetails: `TLD : ${info.tld}`,
      });
      riskScore += 25;
    }

    // Sous-domaines trompeurs (ex: login.microsoft.com.malicious.xyz)
    if (info.subdomains.length >= 2) {
      signals.push({
        id: `url-subdomain-${url}`,
        category: 'domain_spoofing',
        title: 'Chaîne de sous-domaines trompeuse',
        severity: 'high',
        description: `Le nom de domaine empile plusieurs sous-domaines pour induire en erreur sur la véritable destination : "${info.hostname}".`,
        matchedText: url,
        technicalDetails: `Structure : ${info.subdomains.join('.')} [Racine : ${info.hostname}]`,
      });
      riskScore += 20;
    }

    // Protocole non sécurisé pour une page sensible
    if (info.protocol === 'http:' && (credCount > 0 || urgencyCount > 0)) {
      signals.push({
        id: `url-no-ssl-${url}`,
        category: 'suspicious_link',
        title: 'Lien non sécurisé (HTTP sans chiffrement)',
        severity: 'medium',
        description: `Le lien utilise le protocole HTTP non chiffré. Tout site officiel de paiement ou d'authentification utilise obligatoirement HTTPS.`,
        matchedText: url,
        technicalDetails: 'Protocole HTTP non sécurisé',
      });
      riskScore += 15;
    }
  }

  // 5. SIGNAL: Salutations génériques impersonnelles
  const genericMatch = fullText.match(/\b(cher\s+client|cher\s+utilisateur|dear\s+customer|cher\s+abonn[eé]|avis\s+de\s+l'administrateur)\b/i);
  if (genericMatch && (urgencyCount > 0 || credCount > 0)) {
    signals.push({
      id: 'generic-greeting',
      category: 'generic_greeting',
      title: 'Salutation générique et impersonnelle',
      severity: 'low',
      description: `L'expéditeur s'adresse à vous par une formule générique ("${genericMatch[0]}") sans mentionner votre nom ou identifiant client nominatif, signe fréquent d'envoi massif de spam/phishing.`,
      matchedText: genericMatch[0],
    });
    riskScore += 10;
  }

  // 6. Si aucun signal et le contenu semble propre
  if (signals.length === 0) {
    if (type === 'url') {
      const parsed = parseDomain(input);
      if (['github.com', 'google.com', 'microsoft.com', 'apple.com', 'impots.gouv.fr', 'ameli.fr'].some(d => parsed.hostname.endsWith(d))) {
        riskScore = 5;
      } else {
        riskScore = 20; // Unverified external URL
      }
    } else {
      riskScore = 12; // Normal email
    }
  }

  // Cap risk score between 0 and 100
  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine threat severity level
  let threatLevel: ThreatSeverity = 'safe';
  let verdictTitle = 'Message probablement légitime';
  if (riskScore >= 75) {
    threatLevel = 'critical';
    verdictTitle = 'DANGER CRITIQUE : Tentative de Phishing Détectée';
  } else if (riskScore >= 50) {
    threatLevel = 'high';
    verdictTitle = 'RISQUE ÉLEVÉ : Forte présomption de malveillance';
  } else if (riskScore >= 25) {
    threatLevel = 'medium';
    verdictTitle = 'RISQUE MODÉRÉ : Éléments suspects à vérifier';
  } else {
    threatLevel = 'safe';
    verdictTitle = 'RISQUE FAIBLE : Aucun indicateur malveillant flagrant';
  }

  // Synthesize explanation
  let summaryExplanation = '';
  if (threatLevel === 'critical' || threatLevel === 'high') {
    summaryExplanation = `L'analyse de sécurité Phis Guard a révélé ${signals.length} signal(s) d'alerte critique(s). ${
      targetedBrands.length > 0 ? `Une tentative d'usurpation de l'identité de ${targetedBrands.join(', ')} a été identifiée. ` : ''
    }${urgencyCount > 0 ? 'Le message utilise une pression psychologique avec urgence artificielle. ' : ''}${
      credCount > 0 ? 'Il tente d\'extorquer des données confidentielles ou des identifiants bancaires. ' : ''
    }Il s'agit selon toute vraisemblance d'une attaque d'ingénierie sociale (hameçonnage / phishing). Ne cliquez sur aucun lien.`;
  } else if (threatLevel === 'medium') {
    summaryExplanation = `Certains indicateurs appellent à la vigilance (${signals.map(s => s.title).join(', ')}). Vérifiez toujours la source auprès de l'organisme officiel par vos propres moyens avant toute action.`;
  } else {
    summaryExplanation = `Aucun schéma malveillant agressif (urgence anormale, vol de mot de passe, domaine trompeur) n'a été repéré dans ce contenu. Gardez toutefois vos réflexes de cyber-vigilance habituels.`;
  }

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    inputContent: input,
    sender,
    subject,
    riskScore,
    threatLevel,
    verdictTitle,
    summaryExplanation,
    signals,
    extractedUrls,
    targetedBrands: Array.from(new Set(targetedBrands)),
    recommendations: {
      immediateActions: [
        'Ne cliquez sur aucun lien présent dans ce message.',
        'Ne répondez pas à l\'expéditeur et ne téléchargez aucune pièce jointe.',
        'Si l\'expéditeur prétend être un organisme officiel, rendez-vous directement sur leur site via un favori ou en tapant l\'URL officielle.',
        'Signalez ce message sur la plateforme officielle PHAROS ou Signal-Spam.',
      ],
      whatNotToDo: [
        'Ne jamais fournir de mot de passe, de code SMS ou de numéro de carte bancaire.',
        'Ne pas appeler le numéro de téléphone éventuellement mentionné dans l\'email suspect.',
        'Ne pas transférer ce message à vos collègues sans avertissement clair.',
      ],
      incidentResponse: [
        'Si vous avez déjà cliqué et saisi un mot de passe : modifiez-le immédiatement depuis le site officiel et activez la double authentification (2FA).',
        'Si vous avez communiqué vos coordonnées bancaires : contactez immédiatement votre banque pour faire opposition sur votre carte.',
        'Lancez une analyse antivirus complète sur votre terminal.',
      ],
    },
    aiEnhanced: false,
  };
}

/**
 * Main analysis function: queries /api/analyze, fallback to local heuristics
 */
export async function analyzeContent(
  input: string,
  type: AnalysisType,
  sender?: string,
  subject?: string
): Promise<RiskAnalysis> {
  // Try server API first for AI-assisted deep analysis
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type, sender, subject }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.riskScore === 'number') {
        return data as RiskAnalysis;
      }
    }
  } catch (err) {
    console.warn('Backend API request failed, utilizing local cybersecurity heuristic scanner:', err);
  }

  // Graceful fallback to local cybersecurity heuristics
  return analyzePhishingLocally(input, type, sender, subject);
}
