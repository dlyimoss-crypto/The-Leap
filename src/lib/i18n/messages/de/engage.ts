import type { EngageMessages } from "../en/engage";

export const engage: EngageMessages = {
  hub: {
    subtitle: "Mein Leben hat eine Bestimmung, die über mich hinausgeht.",
    inviteTitle: "Freunde einladen",
    inviteDescription: "Hilf jemand anderem, den ersten Sprung zu wagen.",
    serveTitle: "Dienen & Mission",
    serveDescription: "Finde Möglichkeiten, dich einzubringen und mitzuhelfen.",
    giveTitle: "Spenden",
    giveDescription:
      "Unterstütze The Leap und die Werke, mit denen es zusammenarbeitet.",
  },
  give: {
    heading: "Mach mit. Bring dich ein. Bewirke etwas.",
    intro:
      "Deine Unterstützung hilft The Leap, Menschen bei ihrem nächsten Schritt mit Christus zu begleiten. Wir freuen uns über deine Partnerschaft – durch Spenden, Mitarbeit, Gebet und indem du andere mit dieser Mission in Verbindung bringst.",
    howCanIGive: "Wie kann ich spenden?",
    methods: {
      internationalBank: "Internationale Banküberweisung",
      tanzanianBank: "Banküberweisung in Tansania",
      mobilePesa: "Mobile Pesa",
      usTaxDeductible: "Steuerlich absetzbare Spenden (USA)",
    },
    fullDetails: "Alle Angaben zum Spenden findest du auf unserer Spendenseite.",
    coreValues: {
      integrity: "Integrität",
      service: "Dienst",
      wisdom: "Weisheit",
      discipline: "Disziplin",
      excellence: "Exzellenz",
    },
    together: "Gemeinsam gehen wir den nächsten Schritt.",
  },
  invite: {
    title: "Freunde einladen",
    subtitle: "Weitergeben – hilf jemand anderem bei seinem nächsten Schritt.",
    card: {
      heading: "Nimm jemanden mit",
      helpWithName:
        "{name}, hilf einem Freund, einer Freundin oder jemandem aus deiner Familie, den ersten Sprung mit Christus zu wagen.",
      help: "Hilf einem Freund, einer Freundin oder jemandem aus deiner Familie, den ersten Sprung mit Christus zu wagen.",
      shareMessage:
        "Ich nutze The Leap, um Tag für Tag in meinem Leben mit Christus zu wachsen. Wag auch du deinen ersten Sprung:",
      inviteCopied: "Einladung kopiert",
      shareTheLeap: "The Leap teilen",
    },
  },
  serve: {
    title: "Dienen & Mission",
    subtitle: "Finde Möglichkeiten, dich einzubringen und mitzuhelfen.",
    empty: "Noch keine Angebote eingetragen – schau bald wieder vorbei.",
    learnMore: "Mehr erfahren",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "Erreiche Pastor Deniss und das seelsorgerliche Team von The Leap direkt. Echte Menschen, keine KI. Schick eine private Nachricht oder bitte um einen Anruf – wir melden uns so bald wie möglich bei dir.",
    emergencyBefore: "Nicht für Notfälle. Wenn du in Gefahr bist,",
    emergencyLink: "hol dir bitte sofort Hilfe",
    emergencyAfter: ".",
    tabs: {
      message: "Nachricht senden",
      call: "Anruf anfragen",
    },
    errors: {
      empty: "Bitte schreib deine Nachricht, bevor du sie sendest.",
      contact:
        "Wähle, wie wir dich erreichen sollen, und gib deine Nummer oder deinen Benutzernamen an.",
      failed: "Beim Senden ist etwas schiefgelaufen. Bitte versuche es erneut.",
    },
    contactMethodLabel: "Wie sollen wir dich erreichen?",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "Telefonanruf",
      video: "Videoanruf",
    },
    contactDetailLabel: "Deine Nummer oder dein Benutzername",
    contactDetailPlaceholder: "z. B. +255 7XX XXX XXX",
    preferredTimeLabel: "Beste Zeit für einen Anruf (optional)",
    preferredTimePlaceholder: "z. B. werktags abends ab 18 Uhr, EAT",
    bodyLabelCall: "Worüber möchtest du sprechen? (optional)",
    bodyLabelMessage: "Deine Nachricht",
    bodyPlaceholderCall: "Ein, zwei Sätze helfen uns bei der Vorbereitung.",
    bodyPlaceholderMessage:
      "Teile, was dich bewegt: eine Frage, eine Entscheidung, etwas, wofür du Gebet oder Rat brauchst.",
    shareCompanionLabel: "Mein Gespräch mit dem Leap-Begleiter teilen",
    shareCompanionHint:
      "Damit das Team sieht, worüber du gesprochen hast. Nur deine neuesten Nachrichten werden geteilt – und nur, wenn du das ankreuzt.",
    submitCall: "Anruf anfragen",
    submitMessage: "An Pastor Deniss senden",
    privacyNote:
      "Privat: Nur Pastor Deniss und das seelsorgerliche Team von The Leap können das lesen.",
    yourConversations: "Deine Gespräche",
    newReply: "Neue Antwort",
    conversationFallback: "Gespräch",
    callRequestPrefix: "Anrufanfrage · ",
    status: {
      user: {
        open: "Wartet auf Antwort",
        answered: "Beantwortet",
        closed: "Geschlossen",
      },
      team: {
        open: "Antwort nötig",
        answered: "Beantwortet",
        closed: "Geschlossen",
      },
    },
    defaultCallMessage:
      "Ich würde gern mit Pastor Deniss oder dem PD-Team sprechen.",
    thread: {
      yourCallRequest: "Deine Anrufanfrage",
      yourMessage: "Deine Nachricht",
      sentMessage:
        "Gesendet. Pastor Deniss oder jemand aus dem Team antwortet dir hier. Bei einer Antwort siehst du einen Punkt bei Ask PD.",
      sentCall:
        "Gesendet. Pastor Deniss oder jemand aus dem Team antwortet dir hier oder meldet sich direkt bei dir. Bei einer Antwort siehst du einen Punkt bei Ask PD.",
      closed: "Dieses Gespräch ist geschlossen.",
      startNewOne: "Starte ein neues",
      anyTime: "– jederzeit.",
      followUpPlaceholder: "Etwas ergänzen…",
      callRequest: "Anrufanfrage",
      you: "Du",
      userFallback: "Nutzer",
      pastorDeniss: "Pastor Deniss",
      send: "Senden",
      crisisBefore:
        "Du musst da nicht allein durch. Eine Antwort hier kann etwas dauern. Wenn du also in akuter Gefahr bist oder daran denkst, dir selbst etwas anzutun, hol dir bitte jetzt Hilfe.",
      crisisLink: "Krisenhilfe in deinem Land finden →",
      crisisAfter:
        "Du kannst dich auch an eine Vertrauensperson, eine Gemeinde vor Ort, eine professionelle Beratungsstelle oder den Notruf wenden.",
    },
    inbox: {
      title: "Ask-PD-Posteingang",
      subtitle: "Nachrichten und Anrufanfragen für Pastor Deniss und das Team.",
      nothingHere: "Hier ist nichts.",
      unread: "Ungelesen",
      unnamedUser: "Unbenannter Nutzer",
      youPrefix: "Du: ",
    },
    inboxThread: {
      callRequest: "Anrufanfrage",
      message: "Nachricht",
      started: "begonnen",
      reopen: "Wieder öffnen",
      markHandled: "Als erledigt markieren",
      markAsSeen: "Als gesehen markieren",
      crisisWarning:
        "Dieses Gespräch enthält Krisensprache. Bitte antworte zeitnah und verweise die Person auf sofortige Hilfe vor Ort, falls sie in Gefahr sein könnte.",
      sharedCompanion: (count: number) =>
        count === 1
          ? "Geteiltes Gespräch mit dem Leap-Begleiter (1 Nachricht)"
          : `Geteiltes Gespräch mit dem Leap-Begleiter (${count} Nachrichten)`,
      companionAi: "Leap-Begleiter (KI)",
      replyTo: (name: string) => `${name} antworten…`,
      repliesNote:
        "Antworten zeigen der Person deinen Namen und senden ihr eine Benachrichtigung.",
    },
    push: {
      newCallRequestTitle: "Neue Anrufanfrage",
      newMessageTitle: "Neue Ask-PD-Nachricht",
      newRequestBody: "Jemand hat sich über Ask PD gemeldet.",
      followUpTitle: "Neue Ergänzung in Ask PD",
      followUpBody: "Jemand hat in einem Ask-PD-Gespräch geantwortet.",
      repliedTitle: "Pastor Deniss hat geantwortet",
      repliedBody: "Du hast eine neue Antwort in Ask PD.",
    },
  },
  companion: {
    title: "Leap-Begleiter",
    aiBadge: "KI",
    askPd: "Ask PD",
    introBefore:
      "Ich bin ein KI-Begleiter, kein Pastor und kein Mentor – ich helfe dir bei Fragen zur Bibel, bei der heutigen Einheit oder wenn du nicht weiterkommst. Lieber mit einem echten Menschen sprechen? Tippe auf",
    introAfter: "und erreiche Pastor Deniss und das Team.",
    clearConfirmTitle: "Das ganze Gespräch löschen?",
    clearConfirmBody:
      "Damit werden alle deine Nachrichten an den Begleiter gelöscht. Das lässt sich nicht rückgängig machen. Was du bereits über Ask PD geteilt hast, bleibt beim Team.",
    cancel: "Abbrechen",
    yesClear: "Ja, löschen",
    clearConversation: "Gespräch löschen",
    crisisBefore:
      "Du musst da nicht allein durch. Wenn du in akuter Gefahr bist oder daran denkst, dir selbst etwas anzutun, hol dir bitte sofort Hilfe.",
    crisisLink: "Krisenhilfe in deinem Land finden →",
    crisisAfter:
      "Du kannst dich auch an eine Vertrauensperson, eine Gemeinde vor Ort, eine professionelle Beratungsstelle oder den Notruf wenden.",
    emptyPrompt: "Wobei kann ich dir helfen?",
    quickPrompts: {
      scripture: "Hilf mir, den heutigen Bibeltext zu verstehen",
      nextStep: "Was ist mein nächster Schritt?",
      stuck: "Ich komme nicht weiter",
    },
    inputPlaceholder: "Frag den Begleiter…",
    send: "Senden",
    errorReply:
      "Entschuldige, ich kann gerade nicht antworten – bitte versuche es gleich noch einmal.",
    intentMessages: {
      "new-believer":
        "Ich habe gerade gebetet und Jesus angenommen. Wo fange ich an? Ich weiß noch nicht genau, ob ich einfach erst anfange, Jesus nachzufolgen, ob ich die Bibel verstehen, beten lernen oder im Glauben wachsen möchte – oder ob ich einfach Fragen zu Jesus habe. Kannst du mir helfen herauszufinden, wo ich anfangen soll?",
      scripture: "Kannst du mir helfen, den heutigen Bibeltext zu verstehen?",
      devotion: "Kannst du mir helfen, über die heutige Andacht nachzudenken?",
      "next-step": "Was ist mein nächster Schritt?",
      materials:
        "Kannst du mir christliche Bücher oder Materialien empfehlen?",
    },
  },
};
