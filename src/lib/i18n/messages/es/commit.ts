import type { CommitMessages } from "../en/commit";

export const commit: CommitMessages = {
  commitPage: {
    backToHome: "Inicio",
    heading: "Compromiso",
    subheading: "Elijo el camino de Cristo.",
    journeyCardTitle: "Recorrido",
    journeyCardDescription: "Continúa tu recorrido o explora uno nuevo.",
    thisWeeksCommitment: "Compromiso de esta semana",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `Semana del ${weekOf} — ${done} de ${total} cumplidos`,
    markAsKept: "Marcar como cumplido",
    checkAllToMarkAsKept: (total: number) =>
      `Marca los ${total} para darlo por cumplido`,
    intro:
      "Tres prácticas cada semana, lo bastante pequeñas como para cumplirlas de verdad.",
    commitToThisWeek: "Comprométete esta semana",
    keptCommitments: "Compromisos cumplidos",
    weekOf: (weekOf: string) => `Semana del ${weekOf}`,
  },
  commitmentItems: {
    scripture_done: {
      label: "Estudia 5 párrafos de la Biblia",
      detail: "Cada día de esta semana",
    },
    prayer_done: {
      label: "Ora de 5 a 15 minutos",
      detail: "Cada día de esta semana",
    },
    witness_done: {
      label: "Comparte el evangelio",
      detail: "Al menos una vez esta semana",
    },
  },
  journeyChooser: {
    backToCommit: "Compromiso",
    heading: "Recorrido",
    subheading: "Un camino estructurado de varios días con Cristo.",
    continueTitle: "Continúa tu recorrido",
    continueDescription: "Retoma donde lo dejaste.",
    browseTitle: "Explorar recorridos",
    browseDescription: "Descubre otros recorridos de formación que puedes comenzar.",
  },
  browseJourneys: {
    backToJourney: "Recorrido",
    heading: "Explorar recorridos",
    intro:
      "Cada recorrido de formación tiene su propio camino: comienza el que hable a tu situación actual.",
    durationLabel: (days: number) => `Recorrido de ${days} días`,
    completedReview: "Completado · Repasar",
    percentContinue: (pct: number) => `${pct} % completado · Continuar`,
    start: "Comenzar",
    empty: "Todavía no hay recorridos disponibles. Vuelve pronto.",
  },
  journeyOverview: {
    durationLabel: (days: number) => `Recorrido de formación de ${days} días`,
    startJourney: "Comenzar recorrido",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `Día ${day} de ${total}`,
    gatedHeading: "Te esperamos mañana",
    gatedBody:
      "Dedica el día de hoy a orar y a meditar en lo que acabas de leer. El siguiente paso se abrirá cuando vuelvas mañana.",
    backToHome: "Volver al inicio",
    continue: "Continuar",
    continueTo: (topic: string) => `Continuar: ${topic}`,
  },
  formationLoop: {
    scripture: "Escritura",
    message: "Mensaje",
    explore: "Explora",
    reflect: "Reflexiona",
    pray: "Ora",
    nextStep: "Próximo paso",
    engage: "Participa",
  },
  connectPage: {
    backToHome: "Inicio",
    heading: "Conecta",
    subheading: "Pertenezco.",
    prayerRoomTitle: "Sala de oración",
    prayerRoomDescription: "Ora, apoya y recibe oración.",
    churchesTitle: "Iglesias",
    churchesDescription: "Encuentra una iglesia local y conéctate con su comunidad.",
    askPdTitle: "Ask PD",
    askPdDescription: "Escribe al pastor Deniss y a su equipo, o pide una llamada.",
    companionTitle: "Compañero Leap",
    companionDescription: "Pide ayuda, oración o tu próximo paso.",
  },
  churches: {
    backToChurches: "Volver a Iglesias",
    backToConnect: "Conecta",
    notFound: "No se encontró esta iglesia.",
    leadPastor: (name: string) => `Pastor principal: ${name}`,
    service: (time: string) => `Culto: ${time}`,
    members: (n: number) => `~${n} miembros`,
    heading: "Iglesias",
    intro: "Encuentra una iglesia local y conéctate con su comunidad.",
    empty: "Todavía no hay iglesias en la lista. Vuelve pronto.",
    serviceTimeNotListed: "Horario de culto no indicado",
  },
  hubCard: {
    comingSoon: "Próximamente",
  },
};
