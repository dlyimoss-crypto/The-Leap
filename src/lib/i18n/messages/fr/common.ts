import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  notTranslated: "Pas encore disponible en français. Voici l\u2019original en anglais.",
  offline: {
    banner: "Tu es hors ligne. Les pages déjà ouvertes restent disponibles ; les modifications nécessitent une connexion.",
    title: "Tu es hors ligne",
    body: "Cette page n'est pas encore enregistrée sur cet appareil. Tu peux toujours lire les pages ouvertes lorsque tu étais en ligne.",
    savedHeading: "Enregistré sur cet appareil",
    nothingSaved: "Rien d'enregistré pour l'instant. Les méditations, jours de parcours et passages de l'Écriture que tu ouvres en ligne sont gardés ici pour une lecture hors ligne.",
    retry: "Réessayer",
  },
  themeToggle: {
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
  },
  loading: "Chargement",
  notFound: {
    title: "Il n'y a pas de prochain pas ici.",
    body: "Cette page n'existe pas, mais où que tu sois, un prochain pas t'attend encore.",
    backToTheLeap: "Retour à The Leap",
  },
  authErrors: {
    invalidCredentials: "Identifiants de connexion incorrects",
    emailNotConfirmed: "Adresse e-mail non confirmée",
    userAlreadyRegistered: "Cet utilisateur est déjà inscrit",
    weakPassword:
      "Ce mot de passe est trop faible. Choisis un mot de passe plus long et plus difficile à deviner.",
    samePassword: "Le nouveau mot de passe doit être différent de l'ancien.",
    invalidEmail: "Saisis une adresse e-mail valide.",
    rateLimit: "Trop de tentatives. Attends une minute, puis réessaie.",
    generic: "Une erreur s'est produite. Réessaie.",
  },
};
