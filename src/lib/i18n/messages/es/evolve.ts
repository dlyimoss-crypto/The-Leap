import type { EvolveMessages } from "../en/evolve";

export const evolve: EvolveMessages = {
  hub: {
    tagline: "Estoy creciendo.",
    scriptureTitle: "Escrituras",
    scriptureDescription: "Lee, busca, estudia y guarda la Palabra de Dios.",
    devotionTitle: "Devocional diario",
    devotionDescription:
      "Haz una pausa, reflexiona y encuéntrate con Dios en el pensamiento de hoy.",
    booksTitle: "Libros y lecturas",
    booksDescription:
      "Profundiza con libros, enseñanzas y recursos seleccionados.",
  },
  devotion: {
    heading: "Devocional diario",
    subheading:
      "Haz una pausa, reflexiona y encuéntrate con Dios en el pensamiento de hoy.",
    lockedHeading: "Hoy ya elegiste uno del archivo",
    lockedBody:
      "Puedes leer un devocional anterior al día; este se desbloquea de nuevo mañana. El devocional de hoy sigue disponible abajo.",
    backToToday: "Volver al devocional de hoy",
    reflection: "Reflexión",
    prayer: "Oración",
    practice: "Práctica",
    empty: "Todavía no se ha publicado ningún devocional. Vuelve pronto.",
    pastDevotions: "Devocionales anteriores",
    tomorrow: "Mañana",
  },
  reminder: {
    heading: "Recordatorio diario",
    timeAriaLabel: "Hora del recordatorio",
    needsInstall:
      "Para recibir un recordatorio diario en iPhone, primero agrega The Leap a tu pantalla de inicio: toca el botón Compartir, luego “Agregar a inicio”, y abre The Leap desde ahí.",
    unsupported: "Este navegador no admite notificaciones.",
    denied:
      "Las notificaciones de The Leap están bloqueadas. Permítelas en la configuración del sitio de tu navegador para recibir un recordatorio diario.",
    offIntro:
      "Recibe un suave recordatorio cada día cuando aún no hayas leído el devocional.",
    turnOn: "Recordarme cada día",
    everyDayAt: "Todos los días a las",
    turnOff: "Desactivar",
    failed: "Algo salió mal al guardar tu recordatorio. Por favor, inténtalo de nuevo.",
  },
  reminderPush: {
    title: "El devocional de hoy está listo",
  },
  scripture: {
    heading: "Escrituras",
    subheading: "Lee, busca, estudia y guarda la Palabra de Dios.",
    tabs: {
      bible: "Biblia",
      plans: "Planes",
      favorites: "Favoritos",
    },
    plansTitle: "Planes de lectura",
    plansDescription: "Los planes de lectura guiados llegarán pronto.",
    favoritesEmpty: "Guarda un pasaje desde la pestaña Biblia para verlo aquí.",
    remove: "Quitar",
  },
  bible: {
    comingSoonSuffix: " · Próximamente",
    searchPlaceholder: "John 3:16, o palabras para buscar…",
    search: "Buscar",
    attribution:
      "Escrituras tomadas de la Berean Standard Bible (BSB), de dominio público.",
    oldTestament: "Antiguo Testamento",
    newTestament: "Nuevo Testamento",
    allBooks: "Todos los libros",
    verseNotInBsb:
      "Este versículo no está incluido en la BSB, que sigue los manuscritos más antiguos.",
    readChapter: "Leer {reference}",
    noMatches: "Ningún versículo coincide con “{q}”.",
    versesContaining: {
      one: "{count} versículo que contiene “{q}”",
      other: "{count} versículos que contienen “{q}”",
    },
    showingFirst:
      "Mostrando los primeros {shown} de {total} versículos que contienen “{q}”",
    notFound: "No se encontró “{reference}” en la Biblia.",
    saved: "Guardado",
    save: "Guardar",
  },
};
