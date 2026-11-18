import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "Huhitaji kupitia hali hii peke yako. Ikiwa uko katika hatari ya haraka au unawaza kujidhuru, tafadhali tafuta msaada mara moja.",
    findSupportLink: "Pata msaada wa dharura katika nchi yako →",
    outro:
      "Unaweza pia kuwasiliana na mtu unayemwamini, kanisa lililo karibu nawe, mshauri wa kitaalamu, au huduma ya dharura.",
  },
  timeAgo: {
    justNow: "sasa hivi",
    minutes: (n: number) =>
      n === 1 ? "dakika 1 iliyopita" : `dakika ${n} zilizopita`,
    hours: (n: number) =>
      n === 1 ? "saa 1 iliyopita" : `saa ${n} zilizopita`,
    days: (n: number) =>
      n === 1 ? "siku 1 iliyopita" : `siku ${n} zilizopita`,
  },
  communityMember: "Mshiriki wa jumuiya",
  report: "Ripoti",

  prayerRoom: {
    heading: "Chumba cha Maombi",
    tabs: {
      requests: "Mahitaji",
      testimonies: "Shuhuda",
      mine: "Yangu",
    },
    emptyRequests: "Bado hakuna mahitaji ya maombi — kuwa wa kwanza.",
    emptyTestimonies: "Bado hakuna shuhuda.",
    emptyMine: "Bado hujatuma hitaji la maombi.",
  },
  prayerComposer: {
    placeholder: "Shiriki hitaji la maombi…",
    public: "Wazi",
    private: "Binafsi",
    identified: "Kwa jina",
    anonymous: "Bila jina",
    submitAriaLabel: "Tuma hitaji la maombi",
  },
  prayerMovement: {
    eyebrow: "Tuombe kwa dakika 5",
    daysLeft: { one: "Siku {count} imebaki", other: "Siku {count} zimebaki" },
    learnMore: "Soma zaidi",
    prayedCount: "{count} wameomba",
    prayed: "Umeomba",
    iHavePrayed: "Nimeomba",
  },
  prayerRequest: {
    anonymous: "Bila jina",
    hiddenName: "jina limefichwa",
    status: {
      open: "wazi",
      answered: "limejibiwa",
      hidden: "limefichwa",
      removed: "limeondolewa",
    },
    testimony: "Ushuhuda",
    prayed: "Umeomba",
    pray: "Omba",
    testimonyPlaceholder: "Limejibiwaje? (si lazima)",
    markAnswered: "Weka kuwa limejibiwa",
  },

  communityPage: {
    heading: "Jumuiya",
    empty: "Bado hakuna machapisho — kuwa wa kwanza kushiriki.",
  },
  composer: {
    todaysQuestion: "Swali la leo",
    submitAriaLabel: "Chapisha",
    placeholderPrompts: [
      "Shiriki kilicho moyoni mwako…",
      "Ni Maandiko gani yanayokutia moyo zaidi, na kwa nini?",
      "Mungu amekuwa akifanya nini maishani mwako wiki hii?",
      "Una hitaji gani la maombi ungependa jumuiya hii iombe pamoja nawe?",
      "Ni jambo gani dogo unalomshukuru Mungu kwalo leo?",
      "Ni nani anayehitaji kutiwa moyo nawe leo?",
      "Ni kweli gani unayoishikilia sasa hivi?",
      "Imani yako imekufundisha somo gani hivi karibuni?",
      "Ni mstari gani umekuvusha katika kipindi kigumu?",
      "Ulimwonaje Mungu akitenda wiki hii?",
      "Ni ushindi gani mdogo unaostahili kusherehekewa leo?",
      "Ni jambo gani unajifunza kumwamini Yeye nalo?",
      "Ungemwambia nini mtu anayepitia magumu sasa hivi?",
      "Ni ombi gani limejibiwa hivi karibuni?",
    ],
  },
  postCard: {
    block: "Zuia",
  },
  postDetail: {
    backToCommunity: "Jumuiya",
    noComments: "Bado hakuna maoni.",
    commentPlaceholder: "Andika maoni…",
    post: "Tuma",
  },

  announcement: {
    noLongerRunning: "Tangazo hili halipo tena.",
    backToHome: "Rudi Nyumbani",
    learnMore: "Soma zaidi",
  },
};
