import type { EvolveMessages } from "../en/evolve";

export const evolve: EvolveMessages = {
  hub: {
    tagline: "Je grandis.",
    scriptureTitle: "Écriture",
    scriptureDescription: "Lis, recherche, étudie et garde la Parole de Dieu.",
    devotionTitle: "Méditation quotidienne",
    devotionDescription:
      "Fais une pause, réfléchis et rencontre Dieu dans la pensée du jour.",
    booksTitle: "Livres et lectures",
    booksDescription:
      "Va plus loin grâce à des livres, des enseignements et des ressources choisies.",
  },
  devotion: {
    heading: "Méditation quotidienne",
    subheading:
      "Fais une pause, réfléchis et rencontre Dieu dans la pensée du jour.",
    lockedHeading: "Tu as déjà choisi une méditation dans les archives aujourd'hui",
    lockedBody:
      "Tu peux lire une ancienne méditation par jour — celle-ci sera de nouveau accessible demain. La méditation du jour reste ouverte ci-dessous.",
    backToToday: "Retour à la méditation du jour",
    reflection: "Réflexion",
    prayer: "Prière",
    practice: "Mise en pratique",
    empty: "Aucune méditation n'a encore été publiée — reviens bientôt.",
    pastDevotions: "Méditations précédentes",
    tomorrow: "Demain",
  },
  reminder: {
    heading: "Rappel quotidien",
    timeAriaLabel: "Heure du rappel",
    needsInstall:
      "Pour recevoir un rappel quotidien sur iPhone, ajoute d'abord The Leap à ton écran d'accueil : touche le bouton Partager, puis « Sur l'écran d'accueil », et ouvre The Leap à partir de là.",
    unsupported: "Ce navigateur ne prend pas en charge les notifications.",
    denied:
      "Les notifications sont bloquées pour The Leap. Autorise-les dans les paramètres du site de ton navigateur pour recevoir un rappel quotidien.",
    offIntro:
      "Reçois un petit rappel chaque jour quand tu n'as pas encore lu la méditation.",
    turnOn: "Me le rappeler chaque jour",
    everyDayAt: "Chaque jour à",
    turnOff: "Désactiver",
    failed:
      "Une erreur s'est produite lors de l'enregistrement de ton rappel. Réessaie.",
  },
  reminderPush: {
    title: "La méditation du jour est prête",
  },
  scripture: {
    heading: "Écriture",
    subheading: "Lis, recherche, étudie et garde la Parole de Dieu.",
    tabs: {
      bible: "Bible",
      plans: "Plans",
      favorites: "Favoris",
    },
    plansTitle: "Plans de lecture",
    plansDescription: "Des plans de lecture guidés arrivent bientôt.",
    favoritesEmpty: "Enregistre un passage depuis l'onglet Bible pour le retrouver ici.",
    remove: "Retirer",
  },
  bible: {
    comingSoonSuffix: " · Bientôt disponible",
    searchPlaceholder: "John 3:16, ou des mots à chercher…",
    search: "Rechercher",
    attribution:
      "Texte biblique tiré de la Berean Standard Bible (BSB), domaine public.",
    oldTestament: "Ancien Testament",
    newTestament: "Nouveau Testament",
    allBooks: "Tous les livres",
    verseNotInBsb:
      "Ce verset ne figure pas dans la BSB, qui suit les manuscrits les plus anciens.",
    readChapter: "Lire {reference}",
    noMatches: "Aucun verset ne correspond à « {q} ».",
    versesContaining: {
      one: "{count} verset contenant « {q} »",
      other: "{count} versets contenant « {q} »",
    },
    showingFirst:
      "Affichage des {shown} premiers versets sur {total} contenant « {q} »",
    notFound: "Impossible de trouver « {reference} » dans la Bible.",
    saved: "Enregistré",
    save: "Enregistrer",
  },
};
