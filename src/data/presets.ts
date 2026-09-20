import { PresetSample } from '../types';

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'chronopost-colis',
    name: 'Colis bloqué Chronopost (Faux frais)',
    badge: 'Phishing Fréquent',
    type: 'email',
    expectedRisk: 'critical',
    sender: 'service-livraison@chronopost-suivi-express.top',
    subject: 'URGENT : Votre colis N°FR-893240 est en attente de dédouanement',
    content: `Bonjour cher client,

Votre colis N°FR-893240 ne peut pas être livré en raison de frais de douane impayés de 1,99 €.

ATTENTION : Vous disposez d'un délai strict de 24 heures pour régulariser la situation, sans quoi votre colis sera définitivement retourné à l'expéditeur et des frais de pénalité de 45€ vous seront appliqués.

Veuillez cliquer immédiatement sur le lien sécurisé ci-dessous pour payer les frais et saisir vos coordonnées bancaires :
http://chronopost-reglement-securise.top/paiement/FR893240

Munissez-vous de votre carte bancaire et de votre code confidentiel pour valider le dédouanement.

Cordialement,
Le Service Client La Poste / Chronopost`,
    description: 'Combine fausse urgence (24h), usurpation de Chronopost sur un TLD .top et demande de numéro de carte bancaire.',
  },
  {
    id: 'microsoft-365-password',
    name: 'Alerte sécurité Microsoft 365 (Mot de passe)',
    badge: 'Vol d’identifiants',
    type: 'email',
    expectedRisk: 'critical',
    sender: 'no-reply@security-alert-microsoft365.cc',
    subject: 'Action requise : Votre mot de passe Office 365 expire dans 2 heures',
    content: `Avis de l'administrateur système Microsoft Office 365,

Votre mot de passe professionnel expire aujourd'hui à 18h00. Si vous ne renouvelez pas votre session immédiatement, l'accès à vos emails Outlook, documents OneDrive et sessions Teams sera totalement suspendu.

Pour conserver votre mot de passe actuel sans interruption de service :
Rendez-vous sur le portail d'authentification unique :
https://login.microsoftonline.com.portal-auth-id982.xyz/auth/login

Vous devez entrer votre adresse email professionnelle ainsi que votre mot de passe actuel afin de vérifier votre identité.

Microsoft Security Operations Center
© 2026 Microsoft Corporation. Tous droits réservés.`,
    description: 'Faux sous-domaine trompeur imitant Microsoft, menaces de suspension immédiate sous 2 heures et vol de mot de passe.',
  },
  {
    id: 'impots-remboursement',
    name: 'Remboursement Impôts.gouv',
    badge: 'Arnaque financière',
    type: 'email',
    expectedRisk: 'high',
    sender: 'remboursement@dgfip-impots-direction.net',
    subject: 'Notification de remboursement d\'impôt en votre faveur (347,50 €)',
    content: `Direction Générale des Finances Publiques (DGFiP)

Après les derniers calculs de votre déclaration de revenus de l'année précédente, il apparaît que vous avez un solde créditeur de 347,50 € en attente de virement.

Afin de procéder au versement automatique sur votre compte sous 48 heures, veuillez confirmer votre identité fiscale et renseigner les informations de votre carte bancaire ainsi que votre numéro fiscal sur notre formulaire officiel :
http://impots-gouv-fr.virement-declaration.online/dossier/347

Remarque : Les demandes non complétées avant 48 heures seront annulées définitivement.

Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique.`,
    description: 'Usurpation d’identité de l’État français (DGFiP), demande de carte bancaire pour un soi-disant remboursement.',
  },
  {
    id: 'url-paypal-typosquatting',
    name: 'URL Typosquattée PayPal',
    badge: 'Domaine Piégé',
    type: 'url',
    expectedRisk: 'critical',
    content: 'https://paypa1-security-verification-login.com.account-update.buzz/auth?token=928410',
    description: 'Homoglyphe (chiffre 1 remplaçant la lettre l dans paypal), sous-domaines empilés et extension .buzz malveillante.',
  },
  {
    id: 'url-ameli-piege',
    name: 'URL Fausse Carte Vitale Ameli',
    badge: 'Smishing SMS',
    type: 'url',
    expectedRisk: 'critical',
    content: 'http://ameli-renouvellement-v8-vitale.cfd/carte-vitale/espace-assure',
    description: 'Extension .cfd hautement suspecte, protocole HTTP non sécurisé et domaine usurpant l’Assurance Maladie.',
  },
  {
    id: 'legitimate-notification',
    name: 'Email Officiel Légitime (Exemple sain)',
    badge: 'Email Sain',
    type: 'email',
    expectedRisk: 'safe',
    sender: 'notifications@github.com',
    subject: 'Security alert: New sign-in detected on your account',
    content: `Hi developer,

We noticed a new sign-in to your GitHub account from a new IP address in Paris, France on September 19, 2026.

Device: Chrome on macOS
IP Address: 194.254.12.8

If this was you, you can ignore this email. No further action is required.
If you do not recognize this activity, please sign in to your GitHub account by going to https://github.com/settings/security directly from your browser and review your active sessions.

We will never ask you for your password or verification codes by email.

Thanks,
The GitHub Team`,
    description: 'Email légitime de GitHub : indique explicitement qu’aucun mot de passe ne sera demandé, invite à aller directement sur github.com.',
  },
];
