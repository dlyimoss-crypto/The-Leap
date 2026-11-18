import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  notTranslated: "Noch nicht auf Deutsch verfügbar. Hier ist das englische Original.",
  themeToggle: {
    toLight: "Zum hellen Modus wechseln",
    toDark: "Zum dunklen Modus wechseln",
  },
  loading: "Wird geladen",
  notFound: {
    title: "Hier gibt es keinen nächsten Schritt.",
    body: "Diese Seite gibt es nicht – aber wo auch immer du gerade bist, wartet trotzdem ein nächster Schritt auf dich.",
    backToTheLeap: "Zurück zu The Leap",
  },
  authErrors: {
    invalidCredentials: "E-Mail-Adresse oder Passwort ist falsch",
    emailNotConfirmed: "E-Mail-Adresse noch nicht bestätigt",
    userAlreadyRegistered: "Diese E-Mail-Adresse ist bereits registriert",
    weakPassword:
      "Dieses Passwort ist zu schwach. Bitte wähle ein längeres, schwerer zu erratendes Passwort.",
    samePassword: "Das neue Passwort muss sich vom alten unterscheiden.",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
    rateLimit: "Zu viele Versuche. Bitte warte eine Minute und versuche es dann erneut.",
    generic: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
  },
};
