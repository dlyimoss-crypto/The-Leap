import type { EngageMessages } from "../en/engage";

export const engage: EngageMessages = {
  hub: {
    subtitle: "Mi vida tiene un propósito más allá de mí.",
    inviteTitle: "Invita a un amigo",
    inviteDescription: "Ayuda a alguien más a dar su primer Leap.",
    serveTitle: "Servicio y misiones",
    serveDescription: "Encuentra maneras de servir e involucrarte.",
    giveTitle: "Ofrendar",
    giveDescription: "Apoya a The Leap y a los ministerios con los que colabora.",
  },
  give: {
    heading: "Involúcrate. Participa. Marca la diferencia.",
    intro:
      "Tu apoyo permite que The Leap ayude a las personas a dar su siguiente paso con Cristo. Te invitamos a ser parte de esta misión ofrendando, sirviendo, orando y conectando a otros con ella.",
    howCanIGive: "¿Cómo puedo ofrendar?",
    methods: {
      internationalBank: "Transferencia bancaria internacional",
      tanzanianBank: "Transferencia bancaria en Tanzania",
      mobilePesa: "Mobile Pesa",
      usTaxDeductible: "Donación deducible de impuestos en EE. UU.",
    },
    fullDetails: "Para ver todos los detalles, visita nuestra página de ofrendas.",
    coreValues: {
      integrity: "Integridad",
      service: "Servicio",
      wisdom: "Sabiduría",
      discipline: "Disciplina",
      excellence: "Excelencia",
    },
    together: "Juntos damos el siguiente paso.",
  },
  invite: {
    title: "Invita a un amigo",
    subtitle: "Multiplica: ayuda a alguien más a dar su siguiente paso.",
    card: {
      heading: "Lleva a alguien contigo",
      helpWithName:
        "{name}, ayuda a un amigo o familiar a dar su primer Leap con Cristo.",
      help: "Ayuda a un amigo o familiar a dar su primer Leap con Cristo.",
      shareMessage:
        "He estado usando The Leap para crecer en mi caminar con Cristo, un día a la vez. Da tú también tu primer Leap:",
      inviteCopied: "Invitación copiada",
      shareTheLeap: "Compartir The Leap",
    },
  },
  serve: {
    title: "Servicio y misiones",
    subtitle: "Encuentra maneras de servir e involucrarte.",
    empty: "Todavía no hay oportunidades publicadas. Vuelve pronto.",
    learnMore: "Saber más",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "Comunícate directamente con el pastor Deniss y el equipo pastoral de Leap. Personas reales, no IA. Envía un mensaje privado o pide una llamada, y te responderemos lo antes posible.",
    emergencyBefore: "No es para emergencias. Si estás en peligro, por favor,",
    emergencyLink: "busca ayuda inmediata",
    emergencyAfter: ".",
    tabs: {
      message: "Enviar un mensaje",
      call: "Pedir una llamada",
    },
    errors: {
      empty: "Escribe tu mensaje antes de enviarlo.",
      contact:
        "Elige cómo podemos contactarte y agrega tu número o nombre de usuario.",
      failed: "Algo salió mal al enviarlo. Por favor, inténtalo de nuevo.",
    },
    contactMethodLabel: "¿Cómo podemos contactarte?",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "Llamada telefónica",
      video: "Videollamada",
    },
    contactDetailLabel: "Tu número o nombre de usuario",
    contactDetailPlaceholder: "p. ej., +255 7XX XXX XXX",
    preferredTimeLabel: "Mejor hora para llamarte (opcional)",
    preferredTimePlaceholder: "p. ej., entre semana por la tarde, después de las 18:00 (EAT)",
    bodyLabelCall: "¿De qué te gustaría hablar? (opcional)",
    bodyLabelMessage: "Tu mensaje",
    bodyPlaceholderCall: "Una o dos frases nos ayudan a prepararnos.",
    bodyPlaceholderMessage:
      "Comparte lo que hay en tu corazón: una pregunta, una decisión, algo por lo que quieras oración o consejo.",
    shareCompanionLabel: "Compartir mi conversación con el Compañero Leap",
    shareCompanionHint:
      "Así el equipo puede ver de qué has estado hablando. Solo se comparten tus mensajes más recientes, y solo si marcas esta casilla.",
    submitCall: "Pedir una llamada",
    submitMessage: "Enviar al pastor Deniss",
    privacyNote:
      "Privado: solo el pastor Deniss y el equipo pastoral de Leap pueden leer esto.",
    yourConversations: "Tus conversaciones",
    newReply: "Nueva respuesta",
    conversationFallback: "Conversación",
    callRequestPrefix: "Solicitud de llamada · ",
    status: {
      user: {
        open: "Esperando respuesta",
        answered: "Respondido",
        closed: "Cerrado",
      },
      team: {
        open: "Requiere respuesta",
        answered: "Respondido",
        closed: "Cerrado",
      },
    },
    defaultCallMessage: "Me gustaría hablar con el pastor Deniss o con el equipo PD.",
    thread: {
      yourCallRequest: "Tu solicitud de llamada",
      yourMessage: "Tu mensaje",
      sentMessage:
        "Enviado. El pastor Deniss o alguien del equipo te responderá aquí. Verás un punto en Ask PD cuando haya una respuesta.",
      sentCall:
        "Enviado. El pastor Deniss o alguien del equipo te responderá aquí o se comunicará contigo directamente. Verás un punto en Ask PD cuando haya una respuesta.",
      closed: "Esta conversación está cerrada.",
      startNewOne: "Inicia una nueva",
      anyTime: "cuando quieras.",
      followUpPlaceholder: "Agrega un mensaje de seguimiento…",
      callRequest: "Solicitud de llamada",
      you: "Tú",
      userFallback: "Usuario",
      pastorDeniss: "Pastor Deniss",
      send: "Enviar",
      crisisBefore:
        "No tienes que pasar por esto solo. Una respuesta aquí puede tardar, así que si estás en peligro inmediato o piensas en hacerte daño, busca ayuda ahora, por favor.",
      crisisLink: "Encuentra ayuda urgente en tu país →",
      crisisAfter:
        "También puedes contactar a una persona de confianza, a una iglesia local, a un consejero profesional o a los servicios de emergencia.",
    },
    inbox: {
      title: "Bandeja de Ask PD",
      subtitle: "Mensajes y solicitudes de llamada para el pastor Deniss y el equipo.",
      nothingHere: "No hay nada aquí.",
      unread: "Sin leer",
      unnamedUser: "Usuario sin nombre",
      youPrefix: "Tú: ",
    },
    inboxThread: {
      callRequest: "Solicitud de llamada",
      message: "Mensaje",
      started: "iniciada",
      reopen: "Reabrir",
      markHandled: "Marcar como atendida",
      markAsSeen: "Marcar como vista",
      crisisWarning:
        "Esta conversación contiene lenguaje de crisis. Responde pronto, por favor, y oriéntalo hacia ayuda local inmediata si podría estar en peligro.",
      sharedCompanion: (count: number) =>
        `Conversación compartida con el Compañero Leap (${count} ${count === 1 ? "mensaje" : "mensajes"})`,
      companionAi: "Compañero Leap (IA)",
      replyTo: (name: string) => `Responder a ${name}…`,
      repliesNote:
        "Las respuestas muestran tu nombre al usuario y le envían una notificación.",
    },
    push: {
      newCallRequestTitle: "Nueva solicitud de llamada",
      newMessageTitle: "Nuevo mensaje de Ask PD",
      newRequestBody: "Alguien se comunicó a través de Ask PD.",
      followUpTitle: "Nuevo seguimiento en Ask PD",
      followUpBody: "Alguien respondió en una conversación de Ask PD.",
      repliedTitle: "El pastor Deniss respondió",
      repliedBody: "Tienes una nueva respuesta en Ask PD.",
    },
  },
  companion: {
    title: "Compañero Leap",
    aiBadge: "IA",
    askPd: "Ask PD",
    introBefore:
      "Soy un guía con IA, no un pastor ni un mentor. Estoy aquí para ayudarte con preguntas sobre las Escrituras, con la sesión de hoy o cuando te sientas estancado. ¿Prefieres hablar con una persona real? Toca",
    introAfter: "para comunicarte con el pastor Deniss y su equipo.",
    clearConfirmTitle: "¿Borrar toda esta conversación?",
    clearConfirmBody:
      "Esto elimina todos tus mensajes con el Compañero y no se puede deshacer. Lo que ya hayas compartido a través de Ask PD seguirá con el equipo.",
    cancel: "Cancelar",
    yesClear: "Sí, borrarla",
    clearConversation: "Borrar conversación",
    crisisBefore:
      "No tienes que pasar por esto solo. Si estás en peligro inmediato o piensas en hacerte daño, busca ayuda de inmediato, por favor.",
    crisisLink: "Encuentra ayuda urgente en tu país →",
    crisisAfter:
      "También puedes contactar a una persona de confianza, a una iglesia local, a un consejero profesional o a los servicios de emergencia.",
    emptyPrompt: "¿Con qué te gustaría que te ayude?",
    quickPrompts: {
      scripture: "Ayúdame a entender el pasaje de hoy",
      nextStep: "¿Cuál es mi próximo paso?",
      stuck: "Me siento estancado",
    },
    inputPlaceholder: "Pregúntale al Compañero…",
    send: "Enviar",
    errorReply:
      "Lo siento, ahora mismo tengo problemas para responder. Por favor, inténtalo de nuevo en un momento.",
    intentMessages: {
      "new-believer":
        "Acabo de orar para recibir a Jesús. ¿Por dónde empiezo? Todavía no sé si apenas estoy comenzando a seguir a Jesús, si quiero entender la Biblia, aprender a orar, crecer en mi fe o si solo tengo preguntas sobre Jesús. ¿Me ayudas a descubrir por dónde empezar?",
      scripture: "¿Me ayudas a entender el pasaje de las Escrituras de hoy?",
      devotion: "¿Me ayudas a reflexionar sobre el devocional de hoy?",
      "next-step": "¿Cuál es mi próximo paso?",
      materials: "¿Me puedes recomendar algunos libros o materiales cristianos?",
    },
  },
};
