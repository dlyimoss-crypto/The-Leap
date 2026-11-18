import type { EngageMessages } from "../en/engage";

export const engage: EngageMessages = {
  hub: {
    subtitle: "Ma vie a un but qui me dépasse.",
    inviteTitle: "Inviter un ami",
    inviteDescription: "Aide quelqu'un d'autre à faire son premier pas.",
    serveTitle: "Service et missions",
    serveDescription: "Trouve des façons de servir et de t'impliquer.",
    giveTitle: "Dons",
    giveDescription: "Soutiens The Leap et les ministères partenaires.",
  },
  give: {
    heading: "Implique-toi. Participe. Fais la différence.",
    intro:
      "Ton soutien permet à The Leap d'aider des personnes à faire leur prochain pas avec Christ. Nous t'accueillons volontiers comme partenaire, par tes dons, ton service, tes prières et en faisant connaître la mission autour de toi.",
    howCanIGive: "Comment puis-je donner ?",
    methods: {
      internationalBank: "Virement bancaire international",
      tanzanianBank: "Virement bancaire en Tanzanie",
      mobilePesa: "Mobile Pesa",
      usTaxDeductible: "Dons déductibles des impôts aux États-Unis",
    },
    fullDetails: "Pour tous les détails sur les dons, consulte notre page Donner.",
    coreValues: {
      integrity: "Intégrité",
      service: "Service",
      wisdom: "Sagesse",
      discipline: "Discipline",
      excellence: "Excellence",
    },
    together: "Ensemble, faisons le prochain pas.",
  },
  invite: {
    title: "Inviter un ami",
    subtitle: "Multiplier — aide quelqu'un d'autre à faire son prochain pas.",
    card: {
      heading: "Emmène quelqu'un avec toi",
      helpWithName:
        "{name}, aide un ami ou un membre de ta famille à faire son premier pas avec Christ.",
      help: "Aide un ami ou un membre de ta famille à faire son premier pas avec Christ.",
      shareMessage:
        "J'utilise The Leap pour grandir dans ma marche avec Christ, un jour à la fois. Fais toi aussi ton premier pas :",
      inviteCopied: "Invitation copiée",
      shareTheLeap: "Partager The Leap",
    },
  },
  serve: {
    title: "Service et missions",
    subtitle: "Trouve des façons de servir et de t'impliquer.",
    empty: "Aucune opportunité pour l'instant — reviens bientôt.",
    learnMore: "En savoir plus",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "Contacte directement le pasteur Deniss et l'équipe pastorale de Leap. De vraies personnes, pas une IA. Envoie un message privé ou demande un appel, et nous te répondrons dès que possible.",
    emergencyBefore: "Pas pour les urgences. Si tu es en danger,",
    emergencyLink: "cherche de l'aide immédiatement",
    emergencyAfter: ".",
    tabs: {
      message: "Envoyer un message",
      call: "Demander un appel",
    },
    errors: {
      empty: "Écris ton message avant de l'envoyer.",
      contact:
        "Choisis comment nous pouvons te joindre et ajoute ton numéro ou ton nom d'utilisateur.",
      failed: "Une erreur s'est produite lors de l'envoi. Réessaie.",
    },
    contactMethodLabel: "Comment pouvons-nous te joindre ?",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "Appel téléphonique",
      video: "Appel vidéo",
    },
    contactDetailLabel: "Ton numéro ou nom d'utilisateur",
    contactDetailPlaceholder: "ex. : +255 7XX XXX XXX",
    preferredTimeLabel: "Meilleur moment pour t'appeler (facultatif)",
    preferredTimePlaceholder: "ex. : en semaine, le soir après 18 h, EAT",
    bodyLabelCall: "De quoi aimerais-tu parler ? (facultatif)",
    bodyLabelMessage: "Ton message",
    bodyPlaceholderCall: "Une phrase ou deux nous aident à nous préparer.",
    bodyPlaceholderMessage:
      "Partage ce que tu as sur le cœur : une question, une décision, un sujet pour lequel tu aimerais de la prière ou des conseils.",
    shareCompanionLabel: "Partager ma conversation avec le Compagnon Leap",
    shareCompanionHint:
      "Pour que l'équipe voie de quoi tu as parlé. Seuls tes messages les plus récents sont partagés, et uniquement si tu coches cette case.",
    submitCall: "Demander un appel",
    submitMessage: "Envoyer au pasteur Deniss",
    privacyNote:
      "Privé : seuls le pasteur Deniss et l'équipe pastorale de Leap peuvent lire ceci.",
    yourConversations: "Tes conversations",
    newReply: "Nouvelle réponse",
    conversationFallback: "Conversation",
    callRequestPrefix: "Demande d'appel · ",
    status: {
      user: {
        open: "En attente de réponse",
        answered: "Répondu",
        closed: "Clôturé",
      },
      team: {
        open: "À traiter",
        answered: "Répondu",
        closed: "Clôturé",
      },
    },
    defaultCallMessage:
      "J'aimerais parler avec le pasteur Deniss ou l'équipe PD.",
    thread: {
      yourCallRequest: "Ta demande d'appel",
      yourMessage: "Ton message",
      sentMessage:
        "Envoyé. Le pasteur Deniss ou un membre de l'équipe te répondra ici. Un point apparaîtra sur Ask PD quand tu auras une réponse.",
      sentCall:
        "Envoyé. Le pasteur Deniss ou un membre de l'équipe te répondra ici ou te contactera directement. Un point apparaîtra sur Ask PD quand tu auras une réponse.",
      closed: "Cette conversation est clôturée.",
      startNewOne: "Commencer une nouvelle conversation",
      anyTime: "à tout moment.",
      followUpPlaceholder: "Ajoute un complément…",
      callRequest: "Demande d'appel",
      you: "Toi",
      userFallback: "Utilisateur",
      pastorDeniss: "Pasteur Deniss",
      send: "Envoyer",
      crisisBefore:
        "Tu n'as pas à traverser cela seul. Une réponse ici peut prendre du temps ; si tu es en danger immédiat ou si tu penses à te faire du mal, cherche de l'aide dès maintenant.",
      crisisLink: "Trouver une aide d'urgence dans ton pays →",
      crisisAfter:
        "Tu peux aussi contacter une personne de confiance, une église locale, un conseiller professionnel ou les services d'urgence.",
    },
    inbox: {
      title: "Messagerie Ask PD",
      subtitle: "Messages et demandes d'appel pour le pasteur Deniss et l'équipe.",
      nothingHere: "Rien ici.",
      unread: "Non lu",
      unnamedUser: "Utilisateur sans nom",
      youPrefix: "Toi : ",
    },
    inboxThread: {
      callRequest: "Demande d'appel",
      message: "Message",
      started: "commencée",
      reopen: "Rouvrir",
      markHandled: "Marquer comme traité",
      markAsSeen: "Marquer comme vu",
      crisisWarning:
        "Cette conversation contient des signes de détresse. Réponds rapidement et oriente la personne vers une aide locale immédiate si elle risque d'être en danger.",
      sharedCompanion: (count: number) =>
        `Conversation partagée avec le Compagnon Leap (${count} ${count <= 1 ? "message" : "messages"})`,
      companionAi: "Compagnon Leap (IA)",
      replyTo: (name: string) => `Répondre à ${name}…`,
      repliesNote:
        "Tes réponses affichent ton nom à l'utilisateur et lui envoient une notification.",
    },
    push: {
      newCallRequestTitle: "Nouvelle demande d'appel",
      newMessageTitle: "Nouveau message Ask PD",
      newRequestBody: "Quelqu'un a pris contact via Ask PD.",
      followUpTitle: "Nouveau complément Ask PD",
      followUpBody: "Quelqu'un a répondu dans une conversation Ask PD.",
      repliedTitle: "Le pasteur Deniss a répondu",
      repliedBody: "Tu as une nouvelle réponse dans Ask PD.",
    },
  },
  companion: {
    title: "Compagnon Leap",
    aiBadge: "IA",
    askPd: "Ask PD",
    introBefore:
      "Je suis un guide IA, pas un pasteur ni un mentor — je suis là pour t'aider avec tes questions sur l'Écriture, pour avancer dans la séance du jour ou quand tu te sens bloqué. Tu veux parler à une vraie personne ? Touche",
    introAfter: "pour joindre le pasteur Deniss et l'équipe.",
    clearConfirmTitle: "Effacer toute cette conversation ?",
    clearConfirmBody:
      "Cela supprime tous tes messages avec le Compagnon, de façon définitive. Ce que tu as déjà partagé via Ask PD reste chez l'équipe.",
    cancel: "Annuler",
    yesClear: "Oui, effacer",
    clearConversation: "Effacer la conversation",
    crisisBefore:
      "Tu n'as pas à traverser cela seul. Si tu es en danger immédiat ou si tu penses à te faire du mal, cherche de l'aide tout de suite.",
    crisisLink: "Trouver une aide d'urgence dans ton pays →",
    crisisAfter:
      "Tu peux aussi contacter une personne de confiance, une église locale, un conseiller professionnel ou les services d'urgence.",
    emptyPrompt: "Avec quoi puis-je t'aider ?",
    quickPrompts: {
      scripture: "Aide-moi à comprendre l'Écriture du jour",
      nextStep: "Quel est mon prochain pas ?",
      stuck: "Je me sens bloqué",
    },
    inputPlaceholder: "Demande au Compagnon…",
    send: "Envoyer",
    errorReply:
      "Désolé, j'ai du mal à répondre pour le moment — réessaie dans un instant.",
    intentMessages: {
      "new-believer":
        "Je viens de prier pour recevoir Jésus. Par où commencer ? Je ne sais pas encore si je commence tout juste à suivre Jésus, si je veux comprendre la Bible, apprendre à prier, grandir dans ma foi, ou si j'ai simplement des questions sur Jésus — peux-tu m'aider à savoir par où commencer ?",
      scripture: "Peux-tu m'aider à comprendre l'Écriture du jour ?",
      devotion: "Peux-tu m'aider à réfléchir à la méditation du jour ?",
      "next-step": "Quel est mon prochain pas ?",
      materials: "Peux-tu me recommander des livres ou des ressources chrétiennes ?",
    },
  },
};
