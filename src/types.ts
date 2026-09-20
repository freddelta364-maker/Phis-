export type AnalysisType = 'email' | 'url';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export type SignalCategory =
  | 'urgency'            // Urgence artificielle & pression psychologique
  | 'domain_spoofing'   // Domaine imitant une marque / typosquatting
  | 'credential_theft'  // Demande d'identifiants, mot de passe, carte bancaire
  | 'suspicious_link'   // Liens cachés, raccourcisseurs, IP brutes
  | 'sender_anomaly'    // Incohérence expéditeur / adresse réelle
  | 'syntax_grammar'    // Fautes suspectes, traduction automatique
  | 'generic_greeting'; // Formule impersonnelle

export interface WarningSignal {
  id: string;
  category: SignalCategory;
  title: string;
  severity: ThreatSeverity;
  description: string;
  matchedText?: string;
  technicalDetails?: string;
}

export interface RiskAnalysis {
  id: string;
  timestamp: string;
  type: AnalysisType;
  inputContent: string;
  sender?: string;
  subject?: string;
  riskScore: number; // 0 to 100
  threatLevel: ThreatSeverity;
  verdictTitle: string;
  summaryExplanation: string;
  signals: WarningSignal[];
  extractedUrls: string[];
  targetedBrands: string[];
  recommendations: {
    immediateActions: string[];
    whatNotToDo: string[];
    incidentResponse: string[];
  };
  aiEnhanced?: boolean;
}

export interface PresetSample {
  id: string;
  name: string;
  badge: string;
  type: AnalysisType;
  expectedRisk: ThreatSeverity;
  sender?: string;
  subject?: string;
  content: string;
  description: string;
}
