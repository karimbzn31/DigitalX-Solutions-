import type {
  Module,
  Testimonial,
  FAQItem,
  ChatMessage,
  BlogPost,
  User,
  Video,
  Resource,
  CommunityPost,
  Conversation,
} from "@/types";

export const currentUser: User = {
  name: "Karim B.",
  initials: "KB",
  email: "karim@dx.academy",
  level: "Vibe Coder",
  totalProgress: 42,
  videosWatched: 18,
  totalVideos: 58,
  timeSpent: "24h",
  certificates: 1,
};

export const modules: Module[] = [
  {
    id: "1",
    title: "Maîtrisez l'IA comme un ingénieur senior",
    titleShort: "IA Gratuite",
    description: "Ce premier module pose les fondations de toute la formation. Vous apprendrez à installer et configurer VS Code avec les extensions IA les plus puissantes, à maîtriser les terminaux modernes (Antigravity et autres), et à accéder gratuitement à des modèles d'intelligence artificielle de niveau professionnel — comparables à Claude Opus ou GPT-4 — sans payer d'abonnement.\n\nMais surtout, vous apprendrez ce que la plupart des gens ignorent : tous les modèles IA ne se valent pas selon la tâche. Certains excellent en raisonnement logique et analyse complexe, d'autres sont spécialisés dans la génération de code, d'autres encore dans la recherche approfondie ou la créativité. Vous saurez exactement quel modèle activer selon ce que vous voulez accomplir — et comment les configurer pour obtenir des résultats de niveau expert.\n\nVous découvrirez également comment concevoir des agents IA dotés de compétences avancées — des assistants intelligents capables d'agir, d'analyser et de produire de manière autonome. Nous vous apprendrons à les configurer de A à Z : leurs instructions, leurs capacités, leur comportement selon le contexte.\n\nÀ l'issue de ce module, vous aurez entre les mains les LLM les plus puissants du marché, parfaitement configurés et prêts à être déployés dans vos projets — totalement gratuit, à vie. Votre environnement de travail sera identique à celui d'un ingénieur IA senior en 2025.",
    videos: 8,
    duration: "6h30",
    level: "Débutant",
    progress: 100,
    status: "completed",
    color: { from: "#6366F1", to: "#8B5CF6" },
  },
  {
    id: "2",
    title: "Vibe Coding & Projets Professionnels",
    titleShort: "Vibe Coding",
    description: "Ce module vous plonge dans l'art du Vibe Coding — une nouvelle façon de développer où vous et l'IA travaillez ensemble comme deux associés, l'un ayant la vision, l'autre l'exécution. Vous n'apprendrez pas juste à utiliser l'IA pour générer du code : vous apprendrez à la diriger, la cadrer et en extraire le meilleur selon votre projet et votre vision.\n\nVous aurez accès à notre bibliothèque exclusive de Master Prompts — des structures de prompts soigneusement conçues par notre équipe pour vous permettre de démarrer, structurer et faire évoluer n'importe quel projet professionnel avec une précision et une rapidité redoutables.\n\nVous apprendrez notamment :\n\n• Comment parler à l'IA pour obtenir exactement ce que vous voulez — pas des approximations, mais des résultats précis et professionnels\n• Comment la gérer selon votre projet — adapter votre communication selon que vous construisez un site, une application, un SaaS ou un agent IA\n• Comment maintenir votre vision tout au long du développement, sans perdre la cohérence ni la qualité\n• Toutes les techniques du Vibe Coding professionnel utilisées par les meilleurs développeurs et entrepreneurs tech en 2025\n\nÀ l'issue de ce module, vous serez capable de concevoir et livrer des projets qui prenaient autrefois des semaines — en quelques jours, voire quelques heures.",
    videos: 12,
    duration: "9h45",
    level: "Intermédiaire",
    progress: 67,
    status: "in-progress",
    color: { from: "#8B5CF6", to: "#EC4899" },
  },
  {
    id: "3",
    title: "Développez votre propre Agent IA autonome",
    titleShort: "Agents IA",
    description: "C'est le module que tout le monde attend. Celui qui change vraiment la donne.\n\nVous allez construire votre propre agent IA de A à Z — un assistant intelligent, autonome, capable de comprendre, raisonner et agir par lui-même. Pas un chatbot basique. Un véritable agent qui travaille pour vous, pendant que vous faites autre chose.\n\nEt le meilleur dans tout ça ? Vous ne paierez jamais rien. Ni pour l'hébergement, ni pour le modèle de langage, ni pour les appels API. Votre agent sera entièrement indépendant — vous en êtes le propriétaire absolu.\n\nVotre agent ne se limite pas au texte. Il sera capable de :\n\n👁️ Lire et analyser les images — il comprend ce qu'on lui envoie en photo, que ce soit un document, un produit, une capture d'écran ou n'importe quelle image\n🎙️ Comprendre les messages vocaux — il transcrit et interprète les audios envoyés par vos clients, dans n'importe quelle langue\n🇩🇿 Répondre en Darija — votre agent comprend et s'exprime en dialecte algérien, pour une communication naturelle et proche avec votre audience locale\n💬 Répondre par écrit ou par voix — il adapte son format de réponse selon le contexte et les préférences de l'utilisateur\n\nUne fois votre agent créé, vous apprendrez à le connecter à N8n pour l'automatiser entièrement :\n\nFacebook — il répond à vos messages, commentaires et interactions automatiquement\nInstagram — il gère vos conversations et engage votre audience 24h/24\nWhatsApp — il traite les messages de vos clients en temps réel, sans intervention humaine\n\nParce que votre agent est 100% indépendant, vous ne dépendrez d'aucune plateforme payante. Plus jamais d'abonnement N8n. Plus jamais de frais sur les modèles de langage. Votre infrastructure vous appartient, tourne sur vos propres serveurs, et fonctionne à vie sans coût supplémentaire.\n\nÀ l'issue de ce module, vous aurez entre les mains un agent IA opérationnel, déployé et connecté à vos plateformes — un véritable employé digital qui ne dort jamais.",
    videos: 9,
    duration: "7h15",
    level: "Avancé",
    progress: 0,
    status: "locked",
    color: { from: "#8B5CF6", to: "#6366F1" },
  },
  {
    id: "4",
    title: "Build ton SaaS de Zéro à Lancé",
    titleShort: "SaaS",
    description: "Avoir une idée, c'est bien. La transformer en un vrai produit utilisé par des clients, c'est une autre dimension. Ce module vous emmène exactement là — de la page blanche au SaaS en production, étape par étape, sans raccourcis et sans zone d'ombre.\n\nVous apprendrez à choisir et maîtriser la stack technique idéale pour votre projet : frontend moderne, backend robuste, base de données, authentification, paiements, APIs — chaque brique expliquée, intégrée et mise en place avec l'aide de l'IA.\n\nVous découvrirez comment :\n\n• Valider votre idée avant d'écrire une seule ligne de code — pour ne jamais construire quelque chose que personne ne veut\n• Concevoir votre MVP rapidement et intelligemment — le minimum qui convainc, pas le minimum qui déçoit\n• Déployer votre produit en ligne et le rendre accessible au monde entier, avec un environnement professionnel et sécurisé\n• Structurer votre architecture dès le départ pour que votre SaaS puisse grandir sans tout reconstruire\n• Scaler votre produit au fur et à mesure que vos utilisateurs arrivent — performance, stabilité, évolution\n\nCe module est 100% pratique. Vous construirez un vrai SaaS fonctionnel de A à Z, pas un projet d'exercice — un produit que vous pourrez vendre dès la fin de la formation.",
    videos: 10,
    duration: "8h20",
    level: "Avancé",
    progress: 33,
    status: "in-progress",
    color: { from: "#6366F1", to: "#EC4899" },
  },
  {
    id: "5",
    title: "Vibe Coding & Développement Full Stack",
    titleShort: "No Code",
    description: "Ce module vous transforme en développeur Full Stack moderne — pas en vous forçant à mémoriser des centaines de lignes de code, mais en vous apprenant à construire des produits complets et professionnels grâce au Vibe Coding.\n\nVous n'aurez plus besoin de choisir entre le design et la logique, entre l'interface et les données. Vous maîtriserez les deux côtés du développement — Frontend et Backend — et vous saurez les assembler pour créer des produits qui fonctionnent vraiment, de l'écran de l'utilisateur jusqu'au serveur.\n\nVous apprendrez à construire :\n\n• Des sites web modernes et responsives — rapides, élégants, optimisés pour tous les écrans\n• Des applications web interactives — avec une expérience utilisateur fluide et professionnelle\n• Des plateformes en ligne complètes — avec gestion des utilisateurs, des données, des contenus et des accès\n• Un Backend solide — APIs, bases de données, authentification, sécurité et logique métier\n\nMais aussi tout ce qui fait qu'un produit tient dans le temps :\n\n• Déploiement en ligne — mettre votre projet en production, accessible partout dans le monde\n• Sécurisation de vos applications — protéger vos données et vos utilisateurs\n• Optimisation des performances — des produits rapides, stables et scalables\n• Maintenance et évolution — faire grandir votre projet sans tout recasser\n\nÀ l'issue de ce module, vous serez capable de prendre n'importe quelle idée et de la transformer en un produit web complet, fonctionnel et prêt à accueillir de vrais utilisateurs — en une fraction du temps qu'il fallait avant l'IA.",
    videos: 11,
    duration: "8h",
    level: "Intermédiaire",
    progress: 0,
    status: "locked",
    color: { from: "#EC4899", to: "#8B5CF6" },
  },
  {
    id: "6",
    title: "Mindset Entrepreneurial & Startup",
    titleShort: "Startup",
    description: "Construire un produit, c'est une chose. Construire une entreprise, c'en est une autre.\n\nCe module est le module que la plupart des formations tech n'osent pas aborder — parce qu'il ne parle pas de code, mais de ce qui fait vraiment la différence entre un projet qui stagne et une startup qui décolle. Il vous donne le mindset, les outils et la stratégie des fondateurs qui réussissent.\n\nVous apprendrez à penser comme un entrepreneur, pas comme un développeur :\n\n• Trouver et valider une idée rentable — identifier un vrai problème, un vrai marché, une vraie opportunité — avant d'écrire une seule ligne de code\n• Atteindre le Product-Market Fit — comprendre quand votre produit répond vraiment à ce que le marché demande, et comment y arriver le plus vite possible\n• Acquérir vos premiers utilisateurs — les stratégies concrètes pour attirer, convaincre et retenir vos premiers clients sans budget publicitaire\n• Growth Hacking — les techniques de croissance rapide utilisées par les startups les plus ambitieuses pour scaler sans brûler leur trésorerie\n• Structurer votre projet comme une vraie entreprise — organisation, équipe, processus, vision long terme\n• Lever des fonds — comprendre comment fonctionne l'investissement, comment pitcher votre projet, et comment convaincre des investisseurs de croire en vous\n\nParce qu'au fond, la technologie n'est qu'un outil. Ce qui construit une startup, c'est une vision claire, une exécution rapide et un état d'esprit qui refuse d'abandonner.\n\nÀ l'issue de ce module, vous ne serez plus seulement quelqu'un qui sait coder avec l'IA — vous serez quelqu'un qui sait construire, lancer et faire grandir une entreprise technologique.",
    videos: 8,
    duration: "5h45",
    level: "Tous",
    progress: 0,
    status: "locked",
    color: { from: "#6366F1", to: "#8B5CF6" },
  },
];

export const videos: Video[] = [
  {
    id: "v1",
    moduleId: "1",
    title: "Introduction à l'IA moderne et aux LLMs",
    duration: "15:20",
    order: 1,
    completed: true,
  },
  {
    id: "v2",
    moduleId: "1",
    title: "Installation de VS Code et extensions IA",
    duration: "22:45",
    order: 2,
    completed: true,
  },
  {
    id: "v3",
    moduleId: "1",
    title: "Configuration de votre terminal de développement",
    duration: "18:10",
    order: 3,
    completed: true,
  },
  {
    id: "v4",
    moduleId: "1",
    title: "Accès gratuit aux modèles GPT-4, Claude et Gemini",
    duration: "25:30",
    order: 4,
    completed: true,
  },
  {
    id: "v5",
    moduleId: "1",
    title: "Choisir le bon modèle selon votre tâche",
    duration: "20:15",
    order: 5,
    completed: true,
  },
  {
    id: "v6",
    moduleId: "1",
    title: "Concevoir des assistants IA compétents",
    duration: "28:00",
    order: 6,
    completed: true,
  },
  {
    id: "v7",
    moduleId: "1",
    title: "Atelier pratique : votre premier agent IA",
    duration: "32:40",
    order: 7,
    completed: false,
  },
  {
    id: "v8",
    moduleId: "1",
    title: "Déploiement et bonnes pratiques",
    duration: "19:50",
    order: 8,
    completed: false,
  },
  {
    id: "v9",
    moduleId: "2",
    title: "Qu'est-ce que le Vibe Coding ?",
    duration: "14:30",
    order: 1,
    completed: true,
  },
  {
    id: "v10",
    moduleId: "2",
    title: "Les Master Prompts : structure et utilisation",
    duration: "26:20",
    order: 2,
    completed: true,
  },
  {
    id: "v11",
    moduleId: "2",
    title: "Parler à l'IA pour des résultats professionnels",
    duration: "21:45",
    order: 3,
    completed: true,
  },
  {
    id: "v12",
    moduleId: "2",
    title: "Adapter l'IA à votre type de projet",
    duration: "18:55",
    order: 4,
    completed: true,
  },
  {
    id: "v13",
    moduleId: "2",
    title: "Maintenir la vision produit avec l'IA",
    duration: "23:10",
    order: 5,
    completed: false,
  },
  {
    id: "v14",
    moduleId: "2",
    title: "Atelier : construire un projet complet en Vibe Coding",
    duration: "35:00",
    order: 6,
    completed: false,
  },
];

export const resources: Resource[] = [
  {
    id: "r1",
    type: "prompt",
    title: "Master Prompt : Architecture SaaS Complète",
    description: "Prompt structuré pour générer l'architecture complète d'un SaaS multi-tenant",
    moduleId: "4",
    content: "Tu es un architecte senior spécialisé en SaaS. Conçois une architecture complète pour un SaaS multi-tenant avec isolation des données...",
  },
  {
    id: "r2",
    type: "code",
    title: "Template Agent IA autonome avec n8n",
    description: "Workflow n8n complet pour un agent IA connecté à WhatsApp et Facebook",
    moduleId: "3",
    fileUrl: "/resources/agent-n8n-template.json",
  },
  {
    id: "r3",
    type: "pdf",
    title: "Guide des modèles IA gratuits 2026",
    description: "Comparatif complet des modèles d'IA accessibles gratuitement avec leurs forces et faiblesses",
    moduleId: "1",
    fileUrl: "/resources/guide-modeles-ia-2026.pdf",
  },
  {
    id: "r4",
    type: "template",
    title: "Structure de projet SaaS avec Next.js",
    description: "Template de projet Next.js avec authentification, paiements et base de données préconfigurés",
    moduleId: "4",
    fileUrl: "/resources/saas-nextjs-template.zip",
  },
  {
    id: "r5",
    type: "prompt",
    title: "Prompt de génération d'UI professionnelle",
    description: "Série de prompts pour générer des interfaces utilisateur modernes avec Tailwind CSS",
    moduleId: "2",
    content: "Génère un composant React avec Tailwind CSS pour un tableau de bord analytics avec les sections suivantes...",
  },
  {
    id: "r6",
    type: "code",
    title: "Script d'automatisation de déploiement",
    description: "Script bash pour déployer automatiquement votre application sur VPS avec Docker",
    moduleId: "5",
    fileUrl: "/resources/deploy-script.sh",
  },
  {
    id: "r7",
    type: "pdf",
    title: "Checklist de lancement SaaS",
    description: "Liste de vérification complète pour lancer votre SaaS en production sereinement",
    moduleId: "4",
    fileUrl: "/resources/checklist-lancement-saas.pdf",
  },
  {
    id: "r8",
    type: "template",
    title: "Template de validation de marché",
    description: "Notion template pour valider votre idée SaaS avant de coder la première ligne",
    moduleId: "6",
    fileUrl: "/resources/market-validation-template.pdf",
  },
  {
    id: "r9",
    type: "prompt",
    title: "Prompt de correction et refactoring de code",
    description: "Prompt expert pour analyser, corriger et optimiser votre code avec l'IA",
    moduleId: "5",
    content: "Analyse ce code et propose des améliorations en termes de performance, sécurité et maintenabilité...",
  },
  {
    id: "r10",
    type: "code",
    title: "Agent IA de support client autonome",
    description: "Code source complet d'un agent de support client avec mémoire à long terme et escalade humaine",
    moduleId: "3",
    fileUrl: "/resources/support-agent-source.zip",
  },
  {
    id: "r11",
    type: "pdf",
    title: "Roadmap Entrepreneur Digital 2026",
    description: "Plan d'action détaillé sur 12 mois pour lancer et développer votre startup tech",
    moduleId: "6",
    fileUrl: "/resources/roadmap-entrepreneur-2026.pdf",
  },
  {
    id: "r12",
    type: "template",
    title: "Structure de prompt system pour agents IA",
    description: "Template de system prompt prêt à l'emploi pour configurer vos agents IA spécialisés",
    moduleId: "1",
    content: "Tu es un assistant spécialisé dans [domaine]. Tu dois répondre en respectant les règles suivantes...",
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "cp1",
    author: { name: "Amine Khelifa", initials: "AK", badge: "Vibe Coder" },
    content: "J'ai enfin terminé mon premier SaaS complet avec Vibe Coding ! 3 semaines de travail, 0 ligne de code écrite manuellement. Le module 2 est une véritable révélation. Merci à toute l'équipe DigitalXSolutions 🔥",
    likes: 47,
    comments: 12,
    channel: "general",
    pinned: true,
    createdAt: new Date("2026-06-28"),
  },
  {
    id: "cp2",
    author: { name: "Sarah Bouaziz", initials: "SB", badge: "Agent Builder" },
    content: "Question pour les experts : j'essaie de connecter mon agent IA à WhatsApp via n8n mais j'ai un souci d'authentification avec le token. Quelqu'un a déjà résolu ça ? J'ai suivi le module 3 étape par étape mais je bloque à l'étape 5.",
    likes: 23,
    comments: 8,
    channel: "entraide",
    pinned: false,
    createdAt: new Date("2026-06-27"),
  },
  {
    id: "cp3",
    author: { name: "Yacine Benali", initials: "YB", badge: "Full Stack" },
    content: "Petit partage : j'ai créé une librairie de 25 prompts personnalisés pour le développement d'APIs REST avec Node.js et PostgreSQL. Si ça intéresse quelqu'un, je les partage dans le channel #ressources ! 🚀",
    likes: 35,
    comments: 6,
    channel: "ressources",
    pinned: false,
    createdAt: new Date("2026-06-25"),
  },
  {
    id: "cp4",
    author: { name: "Lina Hadjadj", initials: "LH", badge: "Startup" },
    content: "J'ai pitché mon projet de plateforme de e-learning auprès de 3 investisseurs hier. Grâce au module 6 sur le mindset entrepreneurial, j'ai pu structurer mon pitch et répondre à toutes leurs objections. Résultat : un premier chèque de 50K€ en poche ! 🎉",
    likes: 89,
    comments: 24,
    channel: "succes",
    pinned: true,
    createdAt: new Date("2026-06-22"),
  },
  {
    id: "cp5",
    author: { name: "Rayan Mansouri", initials: "RM", badge: "AI Engineer" },
    content: "Le module 4 sur le SaaS m'a ouvert les yeux. J'ai compris que mon erreur était de vouloir construire un produit parfait dès le départ. Maintenant je suis l'approche MVP-first et les résultats sont là. 10 inscriptions en 3 jours pour ma beta !",
    likes: 56,
    comments: 15,
    channel: "general",
    pinned: false,
    createdAt: new Date("2026-06-20"),
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv1",
    title: "Aide sur l'architecture de mon SaaS",
    date: new Date("2026-06-29"),
  },
  {
    id: "conv2",
    title: "Configuration agent WhatsApp",
    date: new Date("2026-06-28"),
  },
  {
    id: "conv3",
    title: "Stratégie de pricing pour MVP",
    date: new Date("2026-06-26"),
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Amine Khelifa",
    role: "Développeur Full-Stack",
    quote: "Cette formation m'a permis de lancer mon premier SaaS en 3 semaines. Le module sur le Vibe Coding est tout simplement révolutionnaire.",
    rating: 5,
    badge: "IA Gratuite",
  },
  {
    id: "t2",
    name: "Sarah Bouaziz",
    role: "Product Manager",
    quote: "Je suis passée de zéro connaissance en IA à la création d'agents automatisés pour mon équipe.",
    rating: 5,
    badge: "Agents IA",
  },
  {
    id: "t3",
    name: "Yacine Benali",
    role: "Freelance Designer",
    quote: "Le module No Code m'a ouvert des portes que je ne soupçonnais pas. Aujourd'hui je livre des produits complets à mes clients.",
    rating: 5,
    badge: "No Code",
  },
  {
    id: "t4",
    name: "Lina Hadjadj",
    role: "Étudiante en Informatique",
    quote: "Une formation complète qui va bien au-delà de la technique. Le mindset entrepreneurial est un vrai plus.",
    rating: 5,
    badge: "Startup",
  },
  {
    id: "t5",
    name: "Rayan Mansouri",
    role: "Entrepreneur",
    quote: "Grâce à cette formation, j'ai pu réduire mes coûts de développement de 70% et lancer mon MVP en 2 semaines.",
    rating: 5,
    badge: "SaaS",
  },
  {
    id: "t6",
    name: "Inès Cherif",
    role: "Data Analyst",
    quote: "La partie sur les agents IA et l'automatisation est incroyablement pratique. Je l'applique au quotidien.",
    rating: 5,
    badge: "Agents IA",
  },
];

export const faqData: FAQItem[] = [
  {
    id: "f1",
    question: "Faut-il des connaissances préalables ?",
    answer: "Non, la formation est conçue pour tous les niveaux. Chaque module commence par les fondamentaux et progresse vers des concepts avancés. La curiosité et la motivation sont les seuls prérequis.",
  },
  {
    id: "f2",
    question: "Combien de temps dure la formation ?",
    answer: "La formation complète représente environ 40 heures de contenu vidéo, à suivre à votre rythme. La plupart de nos apprenants terminent en 8 à 12 semaines.",
  },
  {
    id: "f3",
    question: "Les IA sont-elles vraiment gratuites et illimitées ?",
    answer: "Oui ! Nous vous donnons accès aux modèles les plus puissants (GPT-4, Claude, Gemini) sans abonnement. Vous pouvez les utiliser autant que vous le souhaitez dans le cadre de la formation.",
  },
  {
    id: "f4",
    question: "Y a-t-il un accompagnement ?",
    answer: "Oui, vous aurez accès à notre communauté Discord active, des sessions Q&A régulières, et un assistant IA intégré à la plateforme pour vous aider 24h/24.",
  },
  {
    id: "f5",
    question: "La formation est-elle mise à jour ?",
    answer: "Absolument. Le contenu est mis à jour régulièrement pour suivre l'évolution rapide des technologies IA. Les mises à jour sont incluses à vie.",
  },
  {
    id: "f6",
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Contactez notre équipe pour discuter des options de paiement adaptées à votre situation.",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content: "👋 Bienvenue sur l'assistant IA de DigitalXSolutions Academy !\n\nJe suis là pour t'aider à progresser dans ta formation. Tu peux me poser des questions sur :\n\n- Les concepts abordés dans les modules\n- Du code et des projets pratiques\n- Les technologies IA et le Vibe Coding\n- Ton parcours d'apprentissage\n\n**Comment puis-je t'aider aujourd'hui ?**",
    timestamp: new Date(),
  },
];

export const suggestions = [
  { icon: "💡", text: "C'est quoi le Vibe Coding ?" },
  { icon: "🚀", text: "Comment créer un SaaS ?" },
  { icon: "🤖", text: "Qu'est-ce qu'un agent IA ?" },
  { icon: "🔧", text: "Comment utiliser n8n ?" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "bp1",
    slug: "quest-ce-que-le-vibe-coding",
    title: "Qu'est-ce que le Vibe Coding et comment commencer ?",
    excerpt: "Découvrez le Vibe Coding : une approche révolutionnaire du développement qui combine l'IA générative et la programmation pour coder 10x plus vite.",
    content: `Le Vibe Coding est une nouvelle approche du développement logiciel où l'intelligence artificielle devient votre partenaire de codage.

## Qu'est-ce que le Vibe Coding ?

Le terme "Vibe Coding" fait référence à l'utilisation d'assistants IA (comme Claude, ChatGPT, GitHub Copilot) pour écrire du code en langage naturel. Au lieu de taper chaque ligne de code, vous décrivez ce que vous voulez créer et l'IA le génère pour vous.

## Pourquoi c'est révolutionnaire ?

Cette approche démocratise le développement en permettant à des non-développeurs de créer des applications fonctionnelles. Pour les développeurs expérimentés, c'est un multiplicateur de productivité.

## Comment commencer ?

1. Choisissez un assistant IA (Claude, GPT-4, etc.)
2. Apprenez l'art du prompt engineering
3. Commencez par des projets simples
4. Itérez et affinez

Le Vibe Coding ne remplace pas la compréhension du code, mais il accélère considérablement le processus de développement.`,
    author: "Karim Benzema",
    authorRole: "Co-fondateur & Formateur IA",
    image: "/blog/vibe-coding.jpg",
    tags: ["Vibe Coding", "IA", "Développement"],
    readTime: 8,
    publishedAt: "2026-06-15",
  },
  {
    id: "bp2",
    slug: "ia-gratuite-sans-abonnement",
    title: "Accédez aux IA les plus puissantes sans abonnement",
    excerpt: "Apprenez à utiliser ChatGPT, Claude, Gemini et d'autres modèles d'IA sans payer d'abonnement mensuel. Guide complet et gratuit.",
    content: `L'accès aux modèles d'IA les plus puissants ne nécessite pas forcément un abonnement coûteux. Voici comment.

## Les alternatives gratuites

Plusieurs plateformes offrent un accès gratuit aux meilleurs modèles d'IA avec des limites raisonnables.

## Optimiser votre utilisation

La clé est de savoir quel modèle utiliser pour quelle tâche et comment optimiser vos prompts pour obtenir les meilleurs résultats.

## Dans notre formation

Nous donnons accès à tous les modèles sans limite dans le cadre de la formation.`,
    author: "Amine Cherif",
    authorRole: "Co-fondateur & Full-Stack Developer",
    image: "/blog/ia-gratuite.jpg",
    tags: ["IA", "Gratuit", "ChatGPT", "Claude"],
    readTime: 6,
    publishedAt: "2026-06-10",
  },
  {
    id: "bp3",
    slug: "lancer-sa-startup-saas-en-algerie",
    title: "Lancer sa startup SaaS en Algérie : Guide 2026",
    excerpt: "Tout ce qu'il faut savoir pour lancer et développer une startup SaaS depuis l'Algérie : aspects légaux, paiements, scaling, et conseils pratiques.",
    content: `L'écosystème startup algérien est en pleine effervescence. Voici comment lancer votre SaaS depuis l'Algérie.

## Le cadre légal

L'auto-entrepreneur et la SARL sont les structures les plus adaptées pour débuter.

## Les moyens de paiement

Stripe, PayPro, et les solutions locales permettent d'accepter les paiements internationaux.

## Le growth hacking

Les stratégies de croissance à faible coût qui fonctionnent spécifiquement pour le marché africain.`,
    author: "Karim Benzema",
    authorRole: "Co-fondateur & Formateur IA",
    image: "/blog/startup-saas.jpg",
    tags: ["Startup", "SaaS", "Algérie", "Entrepreneuriat"],
    readTime: 10,
    publishedAt: "2026-06-05",
  },
  {
    id: "bp4",
    slug: "agents-ia-automatisation-2026",
    title: "Agents IA et Automatisation : le guide complet",
    excerpt: "Créez des agents intelligents pour automatiser vos tâches avec n8n, Make et les APIs LLM. Guide pratique pas à pas.",
    content: `Les agents IA sont des programmes autonomes qui utilisent l'intelligence artificielle pour accomplir des tâches complexes.

## Qu'est-ce qu'un agent IA ?

Un agent IA combine un modèle de langage avec des outils et des APIs pour exécuter des tâches de manière autonome.

## Les outils

n8n, Make (ex-Integromat) et les APIs LLM sont les outils les plus populaires pour créer des agents.

## Cas d'usage concrets

- Automatisation du service client
- Génération de contenu automatisée
- Analyse de données
- Monitoring et alertes`,
    author: "Amine Cherif",
    authorRole: "Co-fondateur & Full-Stack Developer",
    image: "/blog/agents-ia.jpg",
    tags: ["Agents IA", "Automatisation", "n8n", "APIs"],
    readTime: 7,
    publishedAt: "2026-05-28",
  },
];
