import type { EvolveMessages } from "../en/evolve";

export const evolve: EvolveMessages = {
  hub: {
    tagline: "Ninakua.",
    scriptureTitle: "Maandiko",
    scriptureDescription: "Soma, tafuta, jifunze na hifadhi Neno la Mungu.",
    devotionTitle: "Ibada ya Kila Siku",
    devotionDescription:
      "Tulia, tafakari na kukutana na Mungu katika wazo la leo.",
    booksTitle: "Vitabu na Maandishi",
    booksDescription:
      "Zama zaidi kupitia vitabu, mafundisho na rasilimali zilizochaguliwa.",
  },
  devotion: {
    heading: "Ibada ya Kila Siku",
    subheading: "Tulia, tafakari na kukutana na Mungu katika wazo la leo.",
    lockedHeading: "Tayari umechagua ibada moja kutoka hifadhi leo",
    lockedBody:
      "Unaweza kusoma ibada moja ya zamani kwa siku — hii itafunguka tena kesho. Ibada ya leo bado iko wazi hapa chini.",
    backToToday: "Rudi kwenye ibada ya leo",
    reflection: "Tafakari",
    prayer: "Maombi",
    practice: "Matendo",
    empty: "Bado hakuna ibada iliyochapishwa — rudi tena hivi karibuni.",
    pastDevotions: "Ibada Zilizopita",
    tomorrow: "Kesho",
  },
  reminder: {
    heading: "Kikumbusho cha kila siku",
    timeAriaLabel: "Muda wa kikumbusho",
    needsInstall:
      "Ili upate kikumbusho cha kila siku kwenye iPhone, kwanza ongeza The Leap kwenye Skrini ya Mwanzo: gusa kitufe cha Shiriki, kisha “Ongeza kwenye Skrini ya Mwanzo”, na ufungue The Leap kutoka hapo.",
    unsupported: "Kivinjari hiki hakitumii arifa.",
    denied:
      "Arifa za The Leap zimezuiwa. Ziruhusu katika mipangilio ya tovuti ya kivinjari chako ili upate kikumbusho cha kila siku.",
    offIntro:
      "Pata ukumbusho mpole kila siku ambapo bado hujasoma ibada.",
    turnOn: "Nikumbushe kila siku",
    everyDayAt: "Kila siku saa",
    turnOff: "Zima",
    failed:
      "Hitilafu imetokea wakati wa kuhifadhi kikumbusho chako. Tafadhali jaribu tena.",
  },
  reminderPush: {
    title: "Ibada ya leo iko tayari",
  },
  scripture: {
    heading: "Maandiko",
    subheading: "Soma, tafuta, jifunze na hifadhi Neno la Mungu.",
    tabs: {
      bible: "Biblia",
      plans: "Mipango",
      favorites: "Vipendwa",
    },
    plansTitle: "Mipango ya Kusoma",
    plansDescription: "Mipango ya kusoma iliyoongozwa inakuja hivi karibuni.",
    favoritesEmpty: "Hifadhi kifungu kutoka kichupo cha Biblia ili kukiona hapa.",
    remove: "Ondoa",
  },
  bible: {
    comingSoonSuffix: " · Inakuja hivi karibuni",
    searchPlaceholder: "John 3:16, au maneno ya kutafuta…",
    search: "Tafuta",
    attribution:
      "Maandiko kutoka Berean Standard Bible (BSB), mali ya umma.",
    oldTestament: "Agano la Kale",
    newTestament: "Agano Jipya",
    allBooks: "Vitabu vyote",
    verseNotInBsb:
      "Mstari huu haumo katika BSB, inayofuata nakala za kale zaidi za maandiko.",
    readChapter: "Soma {reference}",
    noMatches: "Hakuna mistari inayolingana na “{q}”.",
    versesContaining: {
      one: "Mstari {count} wenye “{q}”",
      other: "Mistari {count} yenye “{q}”",
    },
    showingFirst:
      "Inaonyesha mistari {shown} ya kwanza kati ya {total} yenye “{q}”",
    notFound: "Hatukupata “{reference}” katika Biblia.",
    saved: "Imehifadhiwa",
    save: "Hifadhi",
  },
};
