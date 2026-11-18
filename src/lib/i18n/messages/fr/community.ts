import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "Tu n'as pas à traverser cela seul. Si tu es en danger immédiat ou si tu penses à te faire du mal, cherche de l'aide tout de suite.",
    findSupportLink: "Trouver une aide d'urgence dans ton pays →",
    outro:
      "Tu peux aussi contacter une personne de confiance, une église locale, un conseiller professionnel ou les services d'urgence.",
  },
  timeAgo: {
    justNow: "à l'instant",
    minutes: (n: number) => `il y a ${n} min`,
    hours: (n: number) => `il y a ${n} h`,
    days: (n: number) => `il y a ${n} j`,
  },
  communityMember: "Un membre de la communauté",
  report: "Signaler",

  prayerRoom: {
    heading: "Salle de prière",
    tabs: {
      requests: "Sujets",
      testimonies: "Témoignages",
      mine: "Les miens",
    },
    emptyRequests: "Aucun sujet de prière pour l'instant — sois le premier.",
    emptyTestimonies: "Aucun témoignage pour l'instant.",
    emptyMine: "Tu n'as encore publié aucun sujet de prière.",
  },
  prayerComposer: {
    placeholder: "Partage un sujet de prière…",
    public: "Public",
    private: "Privé",
    identified: "Avec mon nom",
    anonymous: "Anonyme",
    submitAriaLabel: "Publier le sujet de prière",
  },
  prayerMovement: {
    eyebrow: "Prions pendant 5 minutes",
    daysLeft: { one: "{count} jour restant", other: "{count} jours restants" },
    learnMore: "En savoir plus",
    prayedCount: "Ont prié : {count}",
    prayed: "J'ai prié",
    iHavePrayed: "J'ai prié",
  },
  prayerRequest: {
    anonymous: "Anonyme",
    hiddenName: "nom masqué",
    status: {
      open: "ouvert",
      answered: "exaucé",
      hidden: "masqué",
      removed: "supprimé",
    },
    testimony: "Témoignage",
    prayed: "J'ai prié",
    pray: "Prier",
    testimonyPlaceholder: "Comment Dieu a-t-il répondu ? (facultatif)",
    markAnswered: "Marquer comme exaucé",
  },

  communityPage: {
    heading: "Communauté",
    empty: "Aucune publication pour l'instant — sois le premier à partager.",
  },
  composer: {
    todaysQuestion: "La question du jour",
    submitAriaLabel: "Publier",
    placeholderPrompts: [
      "Partage ce que tu as sur le cœur…",
      "Quel passage de l'Écriture t'inspire le plus, et pourquoi ?",
      "Qu'est-ce que Dieu a fait dans ta vie cette semaine ?",
      "Quel sujet de prière aimerais-tu confier à cette communauté ?",
      "Quelle petite chose te rend reconnaissant aujourd'hui ?",
      "Qui aurait besoin d'un encouragement de ta part aujourd'hui ?",
      "À quelle vérité t'accroches-tu en ce moment ?",
      "Quelle leçon ta foi t'a-t-elle apprise récemment ?",
      "Quel verset t'a porté dans une période difficile ?",
      "Comment as-tu vu Dieu agir cette semaine ?",
      "Quelle petite victoire mérite d'être célébrée aujourd'hui ?",
      "Dans quel domaine apprends-tu à Lui faire confiance ?",
      "Que dirais-tu à quelqu'un qui traverse un moment difficile ?",
      "Quelle prière a été exaucée récemment ?",
    ],
  },
  postCard: {
    block: "Bloquer",
  },
  postDetail: {
    backToCommunity: "Communauté",
    noComments: "Aucun commentaire pour l'instant.",
    commentPlaceholder: "Ajoute un commentaire…",
    post: "Publier",
  },

  announcement: {
    noLongerRunning: "Cette annonce n'est plus en cours.",
    backToHome: "Retour à l'accueil",
    learnMore: "En savoir plus",
  },
};
