import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzePhishingLocally } from './src/services/analyzer.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Phis Guard Security Engine',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Cyber analysis endpoint
  app.post('/api/analyze', async (req, res) => {
    const { input, type, sender, subject } = req.body;

    if (!input || typeof input !== 'string') {
      res.status(400).json({ error: 'Contenu manquant ou invalide' });
      return;
    }

    // Always compute deterministic heuristic analysis first
    const heuristicResult = analyzePhishingLocally(input, type || 'email', sender, subject);

    // If Gemini key is available, enrich with Gemini AI Cyber-Intelligence
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Tu es un expert en cybersécurité senior et analyste SOC spécialisé dans la détection des attaques de phishing / ingénierie sociale / hameçonnage.
Analyse en profondeur le contenu suivant :
Type : ${type}
Expéditeur déclaré : ${sender || 'Non spécifié'}
Objet / Sujet : ${subject || 'Non spécifié'}
Contenu / URL :
"""
${input}
"""

Examine spécifiquement :
1. "urgence" : Y a-t-il une urgence artificielle (délais sous 24h, menaces d'interruption, blocage de compte, sanctions) ?
2. "domaine_usurpe" : Y a-t-il un domaine usurpant ou imitant une marque connue (typosquatting, TLD suspect, sous-domaine trompeur, homoglyphes, marque contrefaite) ?
3. "identifiants" : Y a-t-il une demande ou formulaire pour extorquer des identifiants (mot de passe, carte bancaire, code 2FA/SMS, numéro de sécurité sociale) ?
4. Autres signaux malveillants : incohérence d'adresse, fautes suspectes, liens vers IP brute.

Fournis un score de risque de 0 à 100 (0 = 100% légitime, 100 = attaque de phishing critique confirmée), un résumé clair en français pour l'utilisateur, et la liste des signaux d'alerte identifiés.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: {
                  type: Type.NUMBER,
                  description: 'Score global de risque entre 0 et 100',
                },
                threatLevel: {
                  type: Type.STRING,
                  description: 'Niveau de menace: critical, high, medium, safe',
                },
                verdictTitle: {
                  type: Type.STRING,
                  description: 'Titre concis du verdict de sécurité',
                },
                summaryExplanation: {
                  type: Type.STRING,
                  description: 'Explication détaillée et pédagogique en français des risques et du stratagème',
                },
                targetedBrands: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Marques ou institutions ciblées ou usurpées',
                },
                signals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: {
                        type: Type.STRING,
                        description: 'Catégorie: urgency, domain_spoofing, credential_theft, suspicious_link, sender_anomaly, syntax_grammar',
                      },
                      title: { type: Type.STRING },
                      severity: { type: Type.STRING, description: 'critical, high, medium, low' },
                      description: { type: Type.STRING },
                      matchedText: { type: Type.STRING },
                      technicalDetails: { type: Type.STRING },
                    },
                    required: ['category', 'title', 'severity', 'description'],
                  },
                },
                immediateActions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Actions immédiates recommandées pour l\'utilisateur',
                },
              },
              required: ['riskScore', 'threatLevel', 'verdictTitle', 'summaryExplanation', 'signals'],
            },
          },
        });

        const rawAiText = response.text;
        if (rawAiText) {
          const parsedAi = JSON.parse(rawAiText);

          // Merge AI signals with heuristic signals to avoid duplicates while maximizing coverage
          const combinedSignals = [...heuristicResult.signals];
          if (Array.isArray(parsedAi.signals)) {
            for (const s of parsedAi.signals) {
              const alreadyExists = combinedSignals.some(
                cs => cs.category === s.category && cs.matchedText === s.matchedText
              );
              if (!alreadyExists) {
                combinedSignals.push({
                  id: `ai-${Math.random().toString(36).substring(2, 8)}`,
                  category: s.category || 'suspicious_link',
                  title: s.title || 'Signal détecté par IA',
                  severity: s.severity || 'high',
                  description: s.description || '',
                  matchedText: s.matchedText,
                  technicalDetails: s.technicalDetails || 'Détection IA Gemini',
                });
              }
            }
          }

          // Compute unified score taking the max of heuristic and AI
          const finalScore = Math.max(
            heuristicResult.riskScore,
            typeof parsedAi.riskScore === 'number' ? parsedAi.riskScore : heuristicResult.riskScore
          );

          let finalThreatLevel = heuristicResult.threatLevel;
          if (finalScore >= 75) finalThreatLevel = 'critical';
          else if (finalScore >= 50) finalThreatLevel = 'high';
          else if (finalScore >= 25) finalThreatLevel = 'medium';
          else finalThreatLevel = 'safe';

          const enrichedResult = {
            ...heuristicResult,
            riskScore: finalScore,
            threatLevel: finalThreatLevel,
            verdictTitle: parsedAi.verdictTitle || heuristicResult.verdictTitle,
            summaryExplanation: parsedAi.summaryExplanation || heuristicResult.summaryExplanation,
            signals: combinedSignals,
            targetedBrands: Array.from(new Set([...heuristicResult.targetedBrands, ...(parsedAi.targetedBrands || [])])),
            recommendations: {
              ...heuristicResult.recommendations,
              immediateActions: parsedAi.immediateActions?.length
                ? parsedAi.immediateActions
                : heuristicResult.recommendations.immediateActions,
            },
            aiEnhanced: true,
          };

          res.json(enrichedResult);
          return;
        }
      } catch (geminiError) {
        console.error('Gemini API analysis error, returning heuristic result:', geminiError);
      }
    }

    // Heuristic fallback response
    res.json(heuristicResult);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Phis Guard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
