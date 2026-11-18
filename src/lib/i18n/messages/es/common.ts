import type { CommonMessages } from "../en/common";

export const common: CommonMessages = {
  notTranslated: "Aún no está disponible en español. Aquí tienes el original en inglés.",
  themeToggle: {
    toLight: "Cambiar a modo claro",
    toDark: "Cambiar a modo oscuro",
  },
  loading: "Cargando",
  notFound: {
    title: "Aquí no hay un siguiente paso.",
    body: "Esta página no existe, pero estés donde estés, todavía hay un siguiente paso esperándote.",
    backToTheLeap: "Volver a The Leap",
  },
  authErrors: {
    invalidCredentials: "Correo o contraseña incorrectos",
    emailNotConfirmed: "Correo electrónico no confirmado",
    userAlreadyRegistered: "Este correo ya está registrado",
    weakPassword:
      "Esa contraseña es demasiado débil. Por favor, elige una más larga y difícil de adivinar.",
    samePassword: "La nueva contraseña debe ser distinta de la anterior.",
    invalidEmail: "Por favor, escribe un correo electrónico válido.",
    rateLimit: "Demasiados intentos. Espera un minuto y vuelve a intentarlo.",
    generic: "Algo salió mal. Por favor, inténtalo de nuevo.",
  },
};
