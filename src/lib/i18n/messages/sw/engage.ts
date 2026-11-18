import type { EngageMessages } from "../en/engage";

export const engage: EngageMessages = {
  hub: {
    subtitle: "Maisha yangu yana kusudi zaidi ya nafsi yangu.",
    inviteTitle: "Mkaribishe Rafiki",
    inviteDescription: "Msaidie mtu mwingine kuchukua hatua yake ya kwanza.",
    serveTitle: "Huduma na Misheni",
    serveDescription: "Tafuta njia za kuhudumu na kushiriki.",
    giveTitle: "Utoaji",
    giveDescription: "Saidia The Leap na huduma inazoshirikiana nazo.",
  },
  give: {
    heading: "Jihusishe. Shiriki. Leta Mabadiliko.",
    intro:
      "Msaada wako unaiwezesha The Leap kuwasaidia watu kuchukua hatua yao inayofuata pamoja na Kristo. Tunakaribisha ushirikiano wako kupitia kutoa, kuhudumu, kuomba na kuwaunganisha wengine na utume huu.",
    howCanIGive: "Ninawezaje kutoa?",
    methods: {
      internationalBank: "Uhamisho wa Benki wa Kimataifa",
      tanzanianBank: "Uhamisho wa Benki wa Tanzania",
      mobilePesa: "Pesa kwa Simu",
      usTaxDeductible: "Utoaji Unaopunguza Kodi Marekani",
    },
    fullDetails: "Kwa maelezo kamili ya utoaji, tembelea Ukurasa wetu wa Utoaji.",
    coreValues: {
      integrity: "Uadilifu",
      service: "Huduma",
      wisdom: "Hekima",
      discipline: "Nidhamu",
      excellence: "Ubora",
    },
    together: "Pamoja, tunachukua hatua inayofuata.",
  },
  invite: {
    title: "Mkaribishe Rafiki",
    subtitle: "Zidisha — msaidie mtu mwingine kuchukua hatua yake inayofuata.",
    card: {
      heading: "Mchukue mtu pamoja nawe",
      helpWithName:
        "{name}, msaidie rafiki au mwanafamilia kuchukua hatua yake ya kwanza pamoja na Kristo.",
      help: "Msaidie rafiki au mwanafamilia kuchukua hatua yake ya kwanza pamoja na Kristo.",
      shareMessage:
        "Nimekuwa nikitumia The Leap kukua katika safari yangu na Kristo, siku moja baada ya nyingine. Nawe chukua hatua yako ya kwanza:",
      inviteCopied: "Mwaliko umenakiliwa",
      shareTheLeap: "Shiriki The Leap",
    },
  },
  serve: {
    title: "Huduma na Misheni",
    subtitle: "Tafuta njia za kuhudumu na kushiriki.",
    empty: "Hakuna nafasi za huduma bado — rudi tena hivi karibuni.",
    learnMore: "Jifunze zaidi",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "Wasiliana moja kwa moja na Mchungaji Deniss na timu ya kichungaji ya Leap. Watu halisi, si AI. Tuma ujumbe wa faragha au omba kupigiwa simu, nasi tutakujibu haraka iwezekanavyo.",
    emergencyBefore: "Si kwa dharura. Ikiwa uko hatarini, tafadhali",
    emergencyLink: "pata msaada wa haraka",
    emergencyAfter: ".",
    tabs: {
      message: "Tuma ujumbe",
      call: "Omba kupigiwa simu",
    },
    errors: {
      empty: "Tafadhali andika ujumbe wako kabla ya kutuma.",
      contact:
        "Chagua jinsi tutakavyokufikia na uweke namba yako au jina lako la mtumiaji.",
      failed: "Kuna tatizo limetokea wakati wa kutuma. Tafadhali jaribu tena.",
    },
    contactMethodLabel: "Tukufikie kwa njia gani?",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "Simu ya kawaida",
      video: "Simu ya video",
    },
    contactDetailLabel: "Namba yako au jina la mtumiaji",
    contactDetailPlaceholder: "mf. +255 7XX XXX XXX",
    preferredTimeLabel: "Muda unaofaa kukupigia (si lazima)",
    preferredTimePlaceholder: "mf. Jioni za siku za kazi baada ya saa 12, EAT",
    bodyLabelCall: "Ungependa kuzungumzia nini? (si lazima)",
    bodyLabelMessage: "Ujumbe wako",
    bodyPlaceholderCall: "Sentensi moja au mbili zitatusaidia kujiandaa.",
    bodyPlaceholderMessage:
      "Shiriki kilicho moyoni mwako: swali, uamuzi, au jambo ambalo ungependa kuombewa au kupata ushauri.",
    shareCompanionLabel: "Shiriki mazungumzo yangu na Rafiki wa Leap",
    shareCompanionHint:
      "Ili timu ione mambo ambayo umekuwa ukizungumzia. Ni jumbe zako za karibuni tu zitakazoshirikiwa, na ni pale tu utakapoweka alama hapa.",
    submitCall: "Omba kupigiwa simu",
    submitMessage: "Tuma kwa Mchungaji Deniss",
    privacyNote:
      "Faragha: ni Mchungaji Deniss na timu ya kichungaji ya Leap pekee wanaoweza kusoma hiki.",
    yourConversations: "Mazungumzo yako",
    newReply: "Jibu jipya",
    conversationFallback: "Mazungumzo",
    callRequestPrefix: "Ombi la simu · ",
    status: {
      user: {
        open: "Inasubiri jibu",
        answered: "Imejibiwa",
        closed: "Imefungwa",
      },
      team: {
        open: "Inahitaji jibu",
        answered: "Imejibiwa",
        closed: "Imefungwa",
      },
    },
    defaultCallMessage:
      "Ningependa kuzungumza na Mchungaji Deniss au timu ya PD.",
    thread: {
      yourCallRequest: "Ombi lako la simu",
      yourMessage: "Ujumbe wako",
      sentMessage:
        "Umetumwa. Mchungaji Deniss au mtu kutoka timu atajibu hapa. Utaona kitone kwenye Ask PD kukiwa na jibu.",
      sentCall:
        "Umetumwa. Mchungaji Deniss au mtu kutoka timu atajibu hapa au atawasiliana nawe moja kwa moja. Utaona kitone kwenye Ask PD kukiwa na jibu.",
      closed: "Mazungumzo haya yamefungwa.",
      startNewOne: "Anzisha mapya",
      anyTime: "wakati wowote.",
      followUpPlaceholder: "Ongeza ujumbe wa ziada…",
      callRequest: "Ombi la simu",
      you: "Wewe",
      userFallback: "Mtumiaji",
      pastorDeniss: "Mchungaji Deniss",
      send: "Tuma",
      crisisBefore:
        "Huhitaji kupitia hili peke yako. Jibu hapa linaweza kuchukua muda, kwa hiyo ikiwa uko hatarini sasa hivi au unawaza kujidhuru, tafadhali pata msaada sasa.",
      crisisLink: "Pata msaada wa dharura katika nchi yako →",
      crisisAfter:
        "Unaweza pia kuwasiliana na mtu unayemwamini, kanisa la karibu, mshauri wa kitaalamu, au huduma za dharura.",
    },
    inbox: {
      title: "Kikasha cha Ask PD",
      subtitle: "Jumbe na maombi ya simu kwa Mchungaji Deniss na timu.",
      nothingHere: "Hakuna kitu hapa.",
      unread: "Haijasomwa",
      unnamedUser: "Mtumiaji asiye na jina",
      youPrefix: "Wewe: ",
    },
    inboxThread: {
      callRequest: "Ombi la simu",
      message: "Ujumbe",
      started: "ilianza",
      reopen: "Fungua tena",
      markHandled: "Weka kuwa imeshughulikiwa",
      markAsSeen: "Weka kuwa imeonwa",
      crisisWarning:
        "Mazungumzo haya yana maneno ya dharura. Tafadhali jibu haraka, na umwelekeze kwenye msaada wa haraka wa karibu ikiwa huenda yuko hatarini.",
      sharedCompanion: (count: number) =>
        `Mazungumzo ya Rafiki wa Leap yaliyoshirikiwa (jumbe ${count})`,
      companionAi: "Rafiki wa Leap (AI)",
      replyTo: (name: string) => `Mjibu ${name}…`,
      repliesNote:
        "Majibu yanaonyesha jina lako kwa mtumiaji na kumtumia taarifa.",
    },
    push: {
      newCallRequestTitle: "Ombi jipya la simu",
      newMessageTitle: "Ujumbe mpya wa Ask PD",
      newRequestBody: "Kuna mtu amewasiliana kupitia Ask PD.",
      followUpTitle: "Ujumbe mpya wa ziada wa Ask PD",
      followUpBody: "Kuna mtu amejibu katika mazungumzo ya Ask PD.",
      repliedTitle: "Mchungaji Deniss amekujibu",
      repliedBody: "Una jibu jipya kwenye Ask PD.",
    },
  },
  companion: {
    title: "Rafiki wa Leap",
    aiBadge: "AI",
    askPd: "Ask PD",
    introBefore:
      "Mimi ni kiongozi wa AI, si mchungaji wala mshauri — niko hapa kukusaidia na maswali ya Maandiko, kupitia kipindi cha leo, au unapojihisi umekwama. Unataka mtu halisi? Gusa",
    introAfter: "kumfikia Mchungaji Deniss na timu.",
    clearConfirmTitle: "Futa mazungumzo haya yote?",
    clearConfirmBody:
      "Hii inafuta jumbe zako zote za Rafiki na haiwezi kurudishwa. Chochote ulichokwisha kushiriki kupitia Ask PD kinabaki kwa timu.",
    cancel: "Ghairi",
    yesClear: "Ndiyo, yafute",
    clearConversation: "Futa mazungumzo",
    crisisBefore:
      "Huhitaji kupitia hili peke yako. Ikiwa uko hatarini sasa hivi au unawaza kujidhuru, tafadhali tafuta msaada wa haraka.",
    crisisLink: "Pata msaada wa dharura katika nchi yako →",
    crisisAfter:
      "Unaweza pia kuwasiliana na mtu unayemwamini, kanisa la karibu, mshauri wa kitaalamu, au huduma ya dharura.",
    emptyPrompt: "Ungependa msaada kuhusu nini?",
    quickPrompts: {
      scripture: "Nisaidie kuelewa Maandiko ya leo",
      nextStep: "Hatua yangu inayofuata ni ipi?",
      stuck: "Najihisi nimekwama",
    },
    inputPlaceholder: "Muulize Rafiki…",
    send: "Tuma",
    errorReply:
      "Samahani, ninapata shida kujibu kwa sasa — tafadhali jaribu tena baada ya muda mfupi.",
    intentMessages: {
      "new-believer":
        "Nimeomba kumpokea Yesu sasa hivi. Nianzie wapi? Bado sina uhakika kama ninaanza tu kumfuata Yesu, nataka kuielewa Biblia, nataka kujifunza jinsi ya kuomba, nataka kukua katika imani yangu, au nina maswali tu kuhusu Yesu — unaweza kunisaidia kujua nianzie wapi?",
      scripture: "Unaweza kunisaidia kuelewa Maandiko ya leo?",
      devotion: "Unaweza kunisaidia kutafakari ibada ya leo?",
      "next-step": "Hatua yangu inayofuata ni ipi?",
      materials: "Unaweza kunipendekezea vitabu au nyenzo za Kikristo?",
    },
  },
};
