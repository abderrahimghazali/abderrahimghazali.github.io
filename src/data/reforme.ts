// Single source of truth for the reform tracker page.
// Every statement carries its source and the date we last checked it.
// To update: change the facts here, bump `lastVerified`, and add a line to `changelog`.

export type Level = "en-vigueur" | "annonce" | "non-confirme";

export interface Source {
  id: string;
  publisher: string;
  title: string;
  url: string;
  published: string; // ISO date of publication, or year
  kind: "officiel" | "presse" | "editeur";
}

export const lastVerified = "2026-11-25";
export const firstPublished = "2026-11-25";

export const sources: Source[] = [
  { id: "cgi", publisher: "Direction Générale des Impôts", title: "Code général des impôts, édition 2026 (article 145)", url: "https://www.maroc.ma/fr/actualites/la-dgi-publie-ledition-2026-du-code-general-des-impots", published: "2025-12-31", kind: "officiel" },
  { id: "dgi", publisher: "Direction Générale des Impôts", title: "Portail de la DGI, rubrique Actualités", url: "https://www.tax.gov.ma", published: "2026", kind: "officiel" },
  { id: "medias24-0416", publisher: "Médias24", title: "DGI. Facturation électronique : lancement en préparation, les détails avec Younes Idrissi Kaitouni", url: "https://medias24.com/2026/04/16/dgi-facturation-electronique-lancement-en-preparation-les-details-avec-younes-idrissi-kaitouni-1660967", published: "2026-04-16", kind: "presse" },
  { id: "medias24-0418", publisher: "Médias24", title: "La facturation électronique expliquée par Younès Idrissi Kaitouni, directeur des impôts", url: "https://medias24.com/2026/04/18/la-facturation-electronique-expliquee-par-younes-idrissi-kaitouni-directeur-des-impots-1661379/", published: "2026-04-18", kind: "presse" },
  { id: "medias24-2024", publisher: "Médias24", title: "La DGI prépare un système de facturation électronique", url: "https://medias24.com/2024/05/06/dgi-plus-de-6-mdh-pour-un-systeme-de-facturation-electronique/", published: "2024-05-06", kind: "presse" },
  { id: "le360", publisher: "Le360", title: "Facturation électronique en 2026 : « La majorité des entreprises n'est pas encore prête »", url: "https://fr.le360.ma/economie/facturation-electronique-en-2026-la-majorite-des-entreprises-nest-pas-encore-prete-alerte-imad_UZDFV7LVJFEX5BQ5HDNZEHQPJA/", published: "2026-03-02", kind: "presse" },
  { id: "challenge", publisher: "Challenge", title: "Facturation électronique : les entreprises face à la grande bascule", url: "https://www.challenge.ma/facturation-electronique-les-entreprises-face-a-la-grande-bascule-320792/", published: "2026-06-01", kind: "presse" },
  { id: "manageo", publisher: "Manageo (éditeur de logiciels)", title: "Facturation électronique : où en est la réforme (septembre 2026)", url: "https://www.manageo.io/blog/facturation-electronique-point-detape-septembre-2026/", published: "2026-09-08", kind: "editeur" },
  { id: "hespress", publisher: "Hespress", title: "Facturation électronique : les entreprises marocaines face à un nouveau tournant fiscal", url: "https://fr.hespress.com/493956-facturation-electronique-les-entreprises-marocaines-face-a-un-nouveau-tournant-fiscal.html", published: "2026-10-26", kind: "presse" },
  { id: "lebrief", publisher: "Le Brief", title: "PLF 2027 : ce qui va changer pour les entreprises marocaines", url: "https://www.lebrief.ma/plf-2027-ce-qui-va-changer-pour-les-entreprises-marocaines-100171757/", published: "2026-10-30", kind: "presse" },
];

export const status = {
  // The one-line answer people come for.
  headline: "Le décret d'application n'est pas publié",
  stamp: { word: "EN ATTENTE", ring: "DÉCRET D'APPLICATION", city: "BULLETIN OFFICIEL" },
  summary:
    "La facturation électronique a une base légale au Maroc depuis 2018, mais le texte qui doit en fixer les règles, les dates et les seuils n'a pas été publié. Aucune date d'obligation n'est donc officielle.",
  basis: [
    { text: "Fin octobre 2026, la presse constate qu'aucune date officielle n'a été annoncée.", sources: ["hespress"] },
    { text: "Le projet de loi de finances 2027, présenté au Parlement le 23 octobre 2026, ne fixe pas de calendrier pour la facturation électronique.", sources: ["lebrief"] },
    { text: "Le portail de la DGI ne publie aucune annonce sur le sujet dans ses actualités récentes (consulté le 25 novembre 2026).", sources: ["dgi"] },
  ],
  limits:
    "Nous n'avons pas pu consulter le Bulletin officiel lui-même à cette date : le site était inaccessible depuis nos outils. Ce constat repose donc sur la presse datée jusqu'au 30 octobre 2026 et sur le portail de la DGI. Si un décret a été publié depuis, signalez-le : la page sera corrigée.",
};

// The path from law to obligation, in order. "fait" = established by a published text,
// "rapporte" = reported by the press, not confirmed by a published text, "attente" = not happened.
export interface Step {
  title: string;
  state: "fait" | "rapporte" | "attente";
  when: string;
  sources: string[];
}

export const steps: Step[] = [
  { title: "Principe inscrit dans la loi", state: "fait", when: "2018", sources: ["cgi"] },
  { title: "Plateforme de la DGI développée", state: "rapporte", when: "Printemps 2026", sources: ["challenge"] },
  { title: "Avant-projet de décret transmis au Secrétariat général du gouvernement", state: "rapporte", when: "Printemps 2026", sources: ["challenge", "manageo"] },
  { title: "Décret publié au Bulletin officiel", state: "attente", when: "En attente", sources: [] },
  { title: "Spécifications techniques publiées", state: "attente", when: "En attente", sources: [] },
  { title: "Première phase obligatoire", state: "attente", when: "Aucune date officielle", sources: [] },
];

export interface Fact {
  title: string;
  body: string;
  level: Level;
  sources: string[];
  note?: string;
}

export const facts: Fact[] = [
  // --- Texte en vigueur ---
  {
    level: "en-vigueur",
    title: "Le principe est dans la loi depuis 2018",
    body: "L'article 145-IX du Code général des impôts, introduit par la loi de finances 2018, impose aux entreprises soumises à l'IS, à l'IR professionnel (régimes du résultat net réel ou simplifié) et à la TVA de se doter d'un système informatique de facturation répondant aux critères techniques fixés par l'administration.",
    sources: ["cgi"],
  },
  {
    level: "en-vigueur",
    title: "Les modalités sont renvoyées à un texte réglementaire",
    body: "Le même article renvoie ses modalités d'application à la voie réglementaire, selon les activités de chaque secteur. Tant que ce texte n'est pas publié, l'obligation ne s'applique pas concrètement.",
    sources: ["cgi", "challenge"],
  },
  {
    level: "en-vigueur",
    title: "Les mentions obligatoires de la facture s'appliquent déjà",
    body: "Indépendamment de la réforme, toute facture doit déjà comporter les mentions de l'article 145 du CGI, dont l'ICE du vendeur et celui du client professionnel, une numérotation continue, et le détail de la TVA.",
    sources: ["cgi"],
  },
  // --- Annoncé ---
  {
    level: "annonce",
    title: "Un lancement « courant 2026 »",
    body: "Le directeur général des impôts, Younes Idrissi Kaitouni, a présenté la réforme en février 2026 devant la CGEM puis le 16 avril 2026 aux Grands Rendez-vous de Médias24. La presse rapporte un lancement visé courant 2026, sans date précise.",
    sources: ["medias24-0416", "le360", "challenge"],
    note: "Fin novembre 2026, aucun démarrage obligatoire n'a été constaté.",
  },
  {
    level: "annonce",
    title: "Un avant-projet de décret transmis au Secrétariat général du gouvernement",
    body: "Selon la presse, l'avant-projet de décret a été transmis au SGG au printemps 2026. Sa publication au Bulletin officiel est l'étape qui déclenchera le calendrier.",
    sources: ["challenge", "manageo"],
  },
  {
    level: "annonce",
    title: "Une plateforme de la DGI, déjà développée",
    body: "La plateforme est décrite comme développée, testée et réceptionnée. Son développement a été confié à la société marocaine xHub. Une phase pilote avec des entreprises volontaires est évoquée pour 2025.",
    sources: ["challenge", "le360"],
  },
  {
    level: "annonce",
    title: "Une validation de chaque facture par la DGI avant envoi au client",
    body: "Le fonctionnement décrit est celui de la validation préalable : le fournisseur émet la facture, la signe électroniquement et la transmet à la plateforme de la DGI ; une fois validée, elle parvient au client. Sans validation, la facture ne serait pas juridiquement valable.",
    sources: ["challenge", "le360", "hespress"],
    note: "Les termes « clearance » et « validation préalable » sont ceux des journalistes ; aucun texte officiel ne les a encore fixés.",
  },
  {
    level: "annonce",
    title: "Un format structuré : UBL",
    body: "La presse rapporte le choix du standard international UBL, avec une signature électronique. Aucune spécification technique n'a été publiée.",
    sources: ["challenge"],
  },
  {
    level: "annonce",
    title: "Un déploiement progressif, en commençant par les grandes entreprises",
    body: "La DGI écarte un basculement général en une fois. Les grandes entreprises seraient concernées d'abord, les PME et TPE ensuite.",
    sources: ["challenge", "manageo"],
    note: "Les sources divergent sur les premiers flux visés : entre entreprises (B2B) selon Challenge, commande publique (B2G) en priorité selon Le360. Le B2C n'est pas prévu à ce stade.",
  },
  {
    level: "annonce",
    title: "Un accès gratuit pour les petites structures",
    body: "Une interface de saisie gratuite est annoncée sur fatourati.gov.ma, ainsi qu'une transmission par échange de données (EDI) pour les entreprises équipées d'un logiciel. Des prestataires certifiés pourraient intervenir dans un second temps.",
    sources: ["challenge", "le360"],
    note: "Le portail n'était pas en ligne début septembre 2026 selon Manageo.",
  },
  // --- Non confirmé ---
  {
    level: "non-confirme",
    title: "Le seuil de 200 millions de dirhams",
    body: "Le chiffre d'environ 1 655 sociétés réalisant plus de 200 millions de dirhams de chiffre d'affaires pour la première vague circule largement. C'est un chiffre de presse : aucun texte officiel ne fixe de seuil.",
    sources: ["manageo"],
  },
  {
    level: "non-confirme",
    title: "Les calendriers par vagues datées",
    body: "« Grandes entreprises en janvier 2026, entreprises moyennes en juillet 2026, PME et auto-entrepreneurs en janvier 2027 » : ces dates, reprises de site en site, ne figurent dans aucun texte publié. Les premières sont déjà dépassées sans qu'aucune obligation ne soit entrée en vigueur.",
    sources: ["hespress", "lebrief"],
  },
  {
    level: "non-confirme",
    title: "Les sanctions chiffrées",
    body: "Une pénalité de 500 dirhams par facture non conforme, ou une majoration de 15 % de la TVA, sont avancées dans des contenus commerciaux. Elles ne reposent sur aucun texte publié ; les sanctions seront définies par les textes d'application.",
    sources: ["manageo", "hespress"],
  },
  {
    level: "non-confirme",
    title: "Les exigences techniques détaillées",
    body: "Formats CII ou Factur-X acceptés, PDF refusé, fournisseur de signature imposé, seuil de 500 000 dirhams pour les auto-entrepreneurs : rien de cela n'est établi par une spécification officielle.",
    sources: ["challenge"],
  },
];

export interface Event {
  date: string; // ISO date, or YYYY, or YYYY-MM
  label: string;
  title: string;
  body?: string;
  sources: string[];
  // Absent for a plain dated fact (a bill tabled, our own check) that is neither a text in force nor an announcement.
  level?: Level;
}

export const timeline: Event[] = [
  { date: "2018", label: "2018", level: "en-vigueur", title: "La loi de finances 2018 introduit l'article 145-IX du CGI", body: "Le principe d'un système informatique de facturation entre dans la loi. Ses modalités sont renvoyées à un texte réglementaire.", sources: ["cgi"] },
  { date: "2024-05-06", label: "Mai 2024", level: "annonce", title: "La DGI lance la réalisation d'un système de facturation électronique", body: "Médias24 rapporte un marché de plus de 6 millions de dirhams.", sources: ["medias24-2024"] },
  { date: "2025", label: "2025", level: "annonce", title: "Phase pilote avec des entreprises volontaires", sources: ["le360"] },
  { date: "2026-02-18", label: "18 février 2026", level: "annonce", title: "Le directeur général des impôts présente la réforme à la CGEM", sources: ["le360"] },
  { date: "2026-04-16", label: "16 avril 2026", level: "annonce", title: "Annonce d'un lancement en préparation aux Grands Rendez-vous de Médias24", body: "Plateforme prête, avant-projet de décret transmis au Secrétariat général du gouvernement.", sources: ["medias24-0416", "medias24-0418", "challenge"] },
  { date: "2026-09-05", label: "5 septembre 2026", title: "Aucun décret au Bulletin officiel, portail gratuit pas encore en ligne", body: "Constat d'un éditeur de logiciels à cette date.", sources: ["manageo"] },
  { date: "2026-10-23", label: "23 octobre 2026", title: "Le projet de loi de finances 2027 est présenté au Parlement", body: "Il ne fixe pas de calendrier pour la facturation électronique.", sources: ["lebrief"] },
  { date: "2026-10-26", label: "26 octobre 2026", title: "« À ce jour, aucune date officielle n'a été annoncée »", sources: ["hespress"] },
  { date: "2026-11-25", label: "25 novembre 2026", title: "Notre dernière vérification : toujours pas de décret connu", sources: ["dgi"] },
];

export const prepare = [
  { title: "Vérifiez vos mentions obligatoires", body: "ICE, IF, RC, taxe professionnelle, numérotation continue, détail de la TVA : ces règles s'appliquent déjà, avec ou sans réforme." },
  { title: "Fiabilisez l'ICE de vos clients", body: "Une facture sans l'ICE du client professionnel fragilise sa déduction. Collectez-les maintenant, pas le jour de la bascule." },
  { title: "Passez à des données structurées", body: "Une facture saisie dans un logiciel, avec des lignes, des taux et des totaux calculés, pourra être convertie en UBL. Un PDF dessiné à la main ou un tableur, non." },
  { title: "Suivez vos encaissements", body: "Au Maroc la TVA est en principe due à l'encaissement. Un suivi fiable des paiements est un prérequis, réforme ou pas." },
  { title: "N'achetez pas une « conformité DGI »", body: "Aucun logiciel ne peut aujourd'hui être conforme à des spécifications qui ne sont pas publiées, ni être agréé par un dispositif qui n'existe pas encore." },
];

export const faq = [
  { q: "La facturation électronique est-elle obligatoire au Maroc ?", a: "Pas encore dans les faits. Le principe figure à l'article 145-IX du Code général des impôts depuis la loi de finances 2018, mais le décret d'application qui doit fixer les règles, les dates et les entreprises concernées n'est pas publié. Aucune date d'obligation n'est officielle." },
  { q: "À partir de quand sera-t-elle obligatoire ?", a: "Aucune date officielle n'existe. La DGI a évoqué un lancement courant 2026 ; fin novembre 2026, le décret n'était toujours pas publié et le projet de loi de finances 2027 ne fixe pas de calendrier. Les dates précises qui circulent en ligne ne reposent sur aucun texte." },
  { q: "Quelles entreprises seront concernées en premier ?", a: "D'après les déclarations rapportées par la presse, les grandes entreprises d'abord, puis les PME et les TPE. Le seuil de 200 millions de dirhams souvent cité est un chiffre de presse, pas un seuil officiel." },
  { q: "Quel format de facture la DGI a-t-elle retenu ?", a: "La presse rapporte le choix du standard UBL avec signature électronique. Aucune spécification technique officielle n'a été publiée." },
  { q: "Comment fonctionnera le système ?", a: "Selon ce qui a été présenté, chaque facture serait transmise à une plateforme de la DGI et validée avant d'être remise au client. Ce fonctionnement reste à confirmer par les textes." },
  { q: "Existe-t-il des logiciels agréés par la DGI ?", a: "Non. Aucun dispositif d'agrément ou de certification des logiciels de facturation n'a été publié à ce jour. Un éditeur qui se dit « agréé » ou « conforme DGI » pour la facturation électronique avance une affirmation invérifiable." },
  { q: "Les auto-entrepreneurs sont-ils concernés ?", a: "Ce n'est pas tranché par un texte publié. Des articles de presse indiquent que le Code général des impôts les exclut du dispositif ; d'autres contenus annoncent un seuil de chiffre d'affaires. Il faut attendre le décret." },
  { q: "Quelles sont les sanctions prévues ?", a: "Aucune sanction propre à la facturation électronique n'est publiée. Les montants cités en ligne ne reposent sur aucun texte. Les sanctions existantes pour les factures irrégulières continuent de s'appliquer." },
];

export const changelog = [
  { date: "2026-11-25", text: "Première publication. Statut : décret non publié à notre connaissance." },
];

export const methodology = [
  "Chaque affirmation est classée : texte en vigueur, annonce rapportée par la presse, ou affirmation non confirmée.",
  "Chaque affirmation renvoie à sa source, avec sa date de publication. Les contenus d'éditeurs de logiciels sont signalés comme tels.",
  "Nous n'avons pas pu lire directement les deux entretiens de Médias24 d'avril 2026 ; les propos du directeur général des impôts sont repris d'après les articles qui les rapportent.",
  "La date de dernière vérification est affichée en haut de page. Une affirmation dépassée est corrigée, et la correction consignée dans l'historique.",
  "Cette page n'est pas un avis juridique ou fiscal. Pour une décision, consultez le texte officiel ou un expert-comptable.",
];
