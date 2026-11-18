import type { CommitMessages } from "../en/commit";

export const commit: CommitMessages = {
  commitPage: {
    backToHome: "Accueil",
    heading: "S'engager",
    subheading: "Je choisis le chemin de Christ.",
    journeyCardTitle: "Parcours",
    journeyCardDescription: "Poursuis ton parcours ou découvre-en un nouveau.",
    thisWeeksCommitment: "Engagement de la semaine",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `Semaine du ${weekOf} — ${done} sur ${total} ${done <= 1 ? "tenu" : "tenus"}`,
    markAsKept: "Marquer comme tenu",
    checkAllToMarkAsKept: (total: number) =>
      `Coche les ${total} pour marquer comme tenu`,
    intro: "Trois pratiques par semaine — assez simples pour être vraiment tenues.",
    commitToThisWeek: "M'engager cette semaine",
    keptCommitments: "Engagements tenus",
    weekOf: (weekOf: string) => `Semaine du ${weekOf}`,
  },
  commitmentItems: {
    scripture_done: {
      label: "Étudier 5 paragraphes de la Bible",
      detail: "Chaque jour cette semaine",
    },
    prayer_done: {
      label: "Prier 5 à 15 minutes",
      detail: "Chaque jour cette semaine",
    },
    witness_done: {
      label: "Partager l'Évangile",
      detail: "Au moins une fois cette semaine",
    },
  },
  journeyChooser: {
    backToCommit: "S'engager",
    heading: "Parcours",
    subheading: "Un chemin structuré sur plusieurs jours avec Christ.",
    continueTitle: "Poursuis ton parcours",
    continueDescription: "Reprends là où tu t'es arrêté.",
    browseTitle: "Découvrir les parcours",
    browseDescription: "Explore d'autres parcours de formation que tu peux commencer.",
  },
  browseJourneys: {
    backToJourney: "Parcours",
    heading: "Découvrir les parcours",
    intro:
      "Chaque parcours de formation suit son propre chemin — commence celui qui correspond à là où tu en es.",
    durationLabel: (days: number) => `Parcours de ${days} jours`,
    completedReview: "Terminé — Revoir",
    percentContinue: (pct: number) => `${pct} % terminé — Continuer`,
    start: "Commencer",
    empty: "Aucun parcours disponible pour l'instant — reviens bientôt.",
  },
  journeyOverview: {
    durationLabel: (days: number) => `Parcours de formation de ${days} jours`,
    startJourney: "Commencer le parcours",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `Jour ${day} sur ${total}`,
    gatedHeading: "À demain",
    gatedBody:
      "Prends le temps aujourd'hui de prier et de méditer ce que tu viens de lire — la prochaine étape s'ouvrira quand tu reviendras demain.",
    backToHome: "Retour à l'accueil",
    continue: "Continuer",
    continueTo: (topic: string) => `Continuer : ${topic}`,
  },
  formationLoop: {
    scripture: "Écriture",
    message: "Message",
    explore: "Explorer",
    reflect: "Réfléchir",
    pray: "Prier",
    nextStep: "Prochain pas",
    engage: "Agir",
  },
  connectPage: {
    backToHome: "Accueil",
    heading: "Communion",
    subheading: "J'ai ma place.",
    prayerRoomTitle: "Salle de prière",
    prayerRoomDescription: "Prie, soutiens les autres et reçois la prière.",
    churchesTitle: "Églises",
    churchesDescription: "Trouve une église locale et rejoins sa communauté.",
    askPdTitle: "Ask PD",
    askPdDescription: "Écris au pasteur Deniss et à l'équipe, ou demande un appel.",
    companionTitle: "Compagnon Leap",
    companionDescription: "Demande de l'aide, une prière ou ton prochain pas.",
  },
  churches: {
    backToChurches: "Retour aux églises",
    backToConnect: "Communion",
    notFound: "Cette église est introuvable.",
    leadPastor: (name: string) => `Pasteur principal : ${name}`,
    service: (time: string) => `Culte : ${time}`,
    members: (n: number) => `~${n} membres`,
    heading: "Églises",
    intro: "Trouve une église locale et rejoins sa communauté.",
    empty: "Aucune église répertoriée pour l'instant — reviens bientôt.",
    serviceTimeNotListed: "Horaire du culte non indiqué",
  },
  hubCard: {
    comingSoon: "Bientôt disponible",
  },
};
