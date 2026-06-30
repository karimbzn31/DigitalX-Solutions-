import type { Module, Testimonial, FAQItem, ChatMessage, BlogPost } from "@/types";

export const modules: Module[] = [
  {
    id: "1",
    title: "Accéder aux IA les plus puissantes gratuitement à vie !",
    titleShort: "IA Gratuite",
    description: "Apprenez à configurer un environnement de Vibe Coding professionnel et à exploiter des modèles d'IA ultra puissants sans jamais payer.",
    videos: 8,
    duration: "6h30",
    level: "Débutant",
    progress: 100,
    status: "completed",
    color: { from: "#6366F1", to: "#8B5CF6" },
  },
  {
    id: "2",
    title: "Vibe Coding & projets professionnels",
    titleShort: "Vibe Coding",
    description: "Développez 10x plus vite avec l'IA générative et le pair programming.",
    videos: 12,
    duration: "9h45",
    level: "Intermédiaire",
    progress: 67,
    status: "in-progress",
    color: { from: "#8B5CF6", to: "#EC4899" },
  },
  {
    id: "3",
    title: "Build ton SaaS en partant de zéro",
    titleShort: "SaaS",
    description: "De l'idée au produit lancé : stack technique, déploiement, scaling.",
    videos: 10,
    duration: "8h20",
    level: "Avancé",
    progress: 33,
    status: "in-progress",
    color: { from: "#6366F1", to: "#EC4899" },
  },
  {
    id: "4",
    title: "Développez votre propre Agent IA autonome",
    titleShort: "Agents IA",
    description: "Apprenez à créer un Agent IA autonome ultra puissant, sans jamais payer quoi que ce soit.",
    videos: 9,
    duration: "7h15",
    level: "Avancé",
    progress: 0,
    status: "locked",
    color: { from: "#8B5CF6", to: "#6366F1" },
  },
  {
    id: "5",
    title: "No Code & Product Building",
    titleShort: "No Code",
    description: "Construisez des produits sans coder avec Bubble, FlutterFlow et Webflow.",
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
    description: "Stratégie, product-market fit, growth hacking et levée de fonds.",
    videos: 8,
    duration: "5h45",
    level: "Tous",
    progress: 0,
    status: "locked",
    color: { from: "#6366F1", to: "#8B5CF6" },
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
