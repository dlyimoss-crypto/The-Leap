import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
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
