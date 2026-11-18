import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "No tienes que pasar por esto solo. Si estás en peligro inmediato o piensas en hacerte daño, busca ayuda de inmediato, por favor.",
    findSupportLink: "Encuentra ayuda urgente en tu país →",
    outro:
      "También puedes contactar a una persona de confianza, a una iglesia local, a un consejero profesional o a los servicios de emergencia.",
  },
  timeAgo: {
    justNow: "ahora mismo",
    minutes: (n: number) => `hace ${n} min`,
    hours: (n: number) => `hace ${n} h`,
    days: (n: number) => `hace ${n} d`,
  },
  communityMember: "Un miembro de la comunidad",
  report: "Denunciar",

  prayerRoom: {
    heading: "Sala de oración",
    tabs: {
      requests: "Peticiones",
      testimonies: "Testimonios",
      mine: "Mías",
    },
    emptyRequests: "Todavía no hay peticiones de oración. Sé el primero.",
    emptyTestimonies: "Todavía no hay testimonios.",
    emptyMine: "Aún no has publicado ninguna petición de oración.",
  },
  prayerComposer: {
    placeholder: "Comparte una petición de oración…",
    public: "Pública",
    private: "Privada",
    identified: "Con mi nombre",
    anonymous: "Anónima",
    submitAriaLabel: "Publicar petición de oración",
  },
  prayerMovement: {
    eyebrow: "Oremos durante 5 minutos",
    daysLeft: { one: "Queda {count} día", other: "Quedan {count} días" },
    learnMore: "Saber más",
    prayedCount: "Oraron: {count}",
    prayed: "Oré",
    iHavePrayed: "Ya oré",
  },
  prayerRequest: {
    anonymous: "Anónimo",
    hiddenName: "nombre oculto",
    status: {
      open: "abierta",
      answered: "respondida",
      hidden: "oculta",
      removed: "eliminada",
    },
    testimony: "Testimonio",
    prayed: "Oré",
    pray: "Orar",
    testimonyPlaceholder: "¿Cómo fue respondida? (opcional)",
    markAnswered: "Marcar como respondida",
  },

  communityPage: {
    heading: "Comunidad",
    empty: "Todavía no hay publicaciones. Sé el primero en compartir.",
  },
  composer: {
    todaysQuestion: "La pregunta de hoy",
    submitAriaLabel: "Publicar",
    placeholderPrompts: [
      "Comparte lo que tienes en mente…",
      "¿Qué pasaje de las Escrituras te inspira más, y por qué?",
      "¿Qué ha estado haciendo Dios en tu vida esta semana?",
      "¿Qué petición de oración te gustaría que esta comunidad sostuviera contigo?",
      "¿Por qué pequeña cosa estás agradecido hoy?",
      "¿A quién le vendría bien que lo animaras hoy?",
      "¿A qué verdad te estás aferrando ahora mismo?",
      "¿Qué lección te ha enseñado tu fe últimamente?",
      "¿Qué versículo te ha sostenido en una temporada difícil?",
      "¿Cómo viste obrar a Dios esta semana?",
      "¿Qué pequeña victoria vale la pena celebrar hoy?",
      "¿En qué estás aprendiendo a confiar en Él?",
      "¿Qué le dirías a alguien que está pasando por un momento difícil?",
      "¿Qué oración ha sido respondida últimamente?",
    ],
  },
  postCard: {
    block: "Bloquear",
  },
  postDetail: {
    backToCommunity: "Comunidad",
    noComments: "Todavía no hay comentarios.",
    commentPlaceholder: "Escribe un comentario…",
    post: "Publicar",
  },

  announcement: {
    noLongerRunning: "Este anuncio ya no está activo.",
    backToHome: "Volver al inicio",
    learnMore: "Saber más",
  },
};
