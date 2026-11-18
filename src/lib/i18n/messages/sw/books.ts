import type { BooksMessages } from "../en/books";

export const books: BooksMessages = {
  library: {
    heading: "Maktaba",
    bookCount: { one: "Kitabu {count}", other: "Vitabu {count}" },
    empty:
      "Bado hakuna vitabu vilivyochapishwa — kuwa wa kwanza kushiriki kimoja hapa chini.",
    free: "Bure",
    defaultAuthor: "The Leap",
  },
  catalogue: {
    heading: "Vitabu na Maandishi",
    readerSubheading:
      "Zama zaidi kupitia vitabu, mafundisho na nyenzo zilizochaguliwa.",
    authorSubheading:
      "Wasilisha kitabu kikaguliwe — vitabu vilivyoidhinishwa vinaingia Maktaba.",
  },
  application: {
    eyebrowPending: "Ombi la Mwandishi",
    eyebrowDefault: "Kuwa Mwandishi",
    headingPending: "Ombi lako linakaguliwa",
    headingMoreInfo: "Tunahitaji maelezo kidogo zaidi kutoka kwako",
    headingDefault: "Chapisha kitabu chako na The Leap",
    bodyPending: "Tutakujulisha mara tu litakapokaguliwa.",
    bodyMoreInfo: "Endelea na ombi lako pale ulipoishia.",
    bodyDefault:
      "Shiriki maandishi yako na jumuiya yetu — bure au kwa malipo, uamuzi ni wako.",
    continueApplication: "Endelea na ombi",
    applyNow: "Omba sasa",
    rejected: "Ombi lako la kuwa mwandishi halikuidhinishwa.",
    backToLibrary: "Rudi Maktaba",
    underReview: "Ombi lako la kuwa mwandishi linakaguliwa.",
    formHeading: "Omba kuwa mwandishi",
    moreInfoRequested: "Maelezo zaidi yanahitajika",
    bioLabel: "Tueleze kidogo kukuhusu",
    reasonLabel: "Kwa nini ungependa kuchapisha na The Leap?",
    websiteLabel: "Tovuti au kiungo cha wasifu (si lazima)",
    agreement: "Ninakubali masharti ya uchapishaji ya The Leap.",
    resubmit: "Wasilisha ombi tena",
    submit: "Wasilisha ombi",
  },
  submission: {
    editBook: "Hariri kitabu",
    newBook: "Kitabu kipya",
    reviewerFeedback: "Maoni ya mkaguzi",
    titleLabel: "Kichwa",
    descriptionLabel: "Maelezo",
    categoriesLabel: "Makundi (tenganisha kwa koma)",
    categoriesPlaceholder: "Uanafunzi, Maisha ya Kikristo",
    manuscriptLabel: "Mswada (PDF au EPUB)",
    currentFile: "Faili la sasa: {filename}",
    coverLabel: "Picha ya jalada",
    priceLabel: "Bei kwa USD (acha wazi kama ni bure)",
    rightsAttestation:
      "Ninathibitisha kwamba ninamiliki haki za kazi hii, au nina ruhusa ya kuichapisha.",
    saveDraft: "Hifadhi rasimu",
    submitForReview: "Wasilisha ikaguliwe",
    edit: "Hariri",
    statusLabels: {
      draft: "Rasimu",
      pending_review: "Inasubiri Ukaguzi",
      changes_requested: "Mabadiliko Yanahitajika",
      rejected: "Imekataliwa",
      approved: "Imeidhinishwa",
      published: "Imechapishwa",
      unpublished: "Imeondolewa",
    },
  },
  detail: {
    readNow: "Soma sasa",
    purchasingNotLive: "Ununuzi bado haujaanza",
    purchasingNotLiveBody:
      "Bado tunaandaa malipo ya vitabu vya kulipia — rudi hivi karibuni ili ukinunue hiki.",
    viewLargerCover: "Ona jalada kubwa la {title}",
    coverAlt: "Jalada la {title}",
  },
  reader: {
    back: "Rudi",
    untitled: "Kitabu",
    loading: "Kitabu kinapakiwa…",
    epubError: "EPUB hii haikuweza kufunguliwa.",
    pdfError: "PDF hii haikuweza kufunguliwa.",
    fileErrorHint:
      "Huenda faili limeharibika au liko katika muundo usioungwa mkono.",
    previousPage: "Ukurasa uliotangulia",
    nextPage: "Ukurasa unaofuata",
    pageOf: "{page} / {total}",
  },
};
