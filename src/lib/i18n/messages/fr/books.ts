import type { BooksMessages } from "../en/books";

export const books: BooksMessages = {
  library: {
    heading: "Bibliothèque",
    bookCount: { one: "{count} livre", other: "{count} livres" },
    empty:
      "Aucun livre publié pour l'instant — sois le premier à en partager un ci-dessous.",
    free: "Gratuit",
    defaultAuthor: "The Leap",
  },
  catalogue: {
    heading: "Livres et lectures",
    readerSubheading:
      "Va plus loin grâce à des livres, des enseignements et des ressources choisies.",
    authorSubheading:
      "Soumets un livre pour examen — les livres approuvés rejoignent la Bibliothèque.",
  },
  application: {
    eyebrowPending: "Candidature d'auteur",
    eyebrowDefault: "Deviens auteur",
    headingPending: "Ta candidature est en cours d'examen",
    headingMoreInfo: "Il nous faut encore quelques informations",
    headingDefault: "Publie ton livre avec The Leap",
    bodyPending: "Nous te tiendrons au courant dès qu'elle aura été examinée.",
    bodyMoreInfo: "Reprends ta candidature là où tu t'es arrêté.",
    bodyDefault:
      "Partage tes écrits avec notre communauté — gratuitement ou contre paiement, c'est toi qui choisis.",
    continueApplication: "Reprendre la candidature",
    applyNow: "Postuler",
    rejected: "Ta candidature d'auteur n'a pas été approuvée.",
    backToLibrary: "Retour à la Bibliothèque",
    underReview: "Ta candidature d'auteur est en cours d'examen.",
    formHeading: "Postuler pour devenir auteur",
    moreInfoRequested: "Informations complémentaires demandées",
    bioLabel: "Parle-nous un peu de toi",
    reasonLabel: "Pourquoi veux-tu publier avec The Leap ?",
    websiteLabel: "Site web ou lien de profil (facultatif)",
    agreement: "J'accepte les conditions de publication de The Leap.",
    resubmit: "Renvoyer la candidature",
    submit: "Envoyer la candidature",
  },
  submission: {
    editBook: "Modifier le livre",
    newBook: "Nouveau livre",
    reviewerFeedback: "Commentaires de l'examinateur",
    titleLabel: "Titre",
    descriptionLabel: "Description",
    categoriesLabel: "Catégories (séparées par des virgules)",
    categoriesPlaceholder: "Discipulat, Vie chrétienne",
    manuscriptLabel: "Manuscrit (PDF ou EPUB)",
    currentFile: "Fichier actuel : {filename}",
    coverLabel: "Image de couverture",
    priceLabel: "Prix en USD (laisser vide si gratuit)",
    rightsAttestation:
      "Je confirme détenir les droits sur cette œuvre ou avoir l'autorisation de la publier.",
    saveDraft: "Enregistrer le brouillon",
    submitForReview: "Soumettre pour examen",
    edit: "Modifier",
    statusLabels: {
      draft: "Brouillon",
      pending_review: "En attente d'examen",
      changes_requested: "Modifications demandées",
      rejected: "Refusé",
      approved: "Approuvé",
      published: "Publié",
      unpublished: "Dépublié",
    },
  },
  detail: {
    readNow: "Lire maintenant",
    purchasingNotLive: "L'achat n'est pas encore disponible",
    purchasingNotLiveBody:
      "Nous mettons encore en place le paiement des titres payants — reviens bientôt pour acheter celui-ci.",
    viewLargerCover: "Agrandir la couverture de {title}",
    coverAlt: "Couverture de {title}",
  },
  reader: {
    back: "Retour",
    untitled: "Livre",
    loading: "Chargement du livre…",
    epubError: "Impossible de charger cet EPUB.",
    pdfError: "Impossible de charger ce PDF.",
    fileErrorHint:
      "Le fichier est peut-être endommagé ou dans un format non pris en charge.",
    previousPage: "Page précédente",
    nextPage: "Page suivante",
    pageOf: "{page} / {total}",
  },
};
