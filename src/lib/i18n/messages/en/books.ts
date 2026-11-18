// EVOLVE > Books: catalogue, book detail, readers, author application.
// English is the source of truth: the type of every other language's
// `books` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).
//
// Books themselves (titles, authors, descriptions, files) are content and
// are never translated — only the interface around them.

export const books = {
  library: {
    heading: "Library",
    bookCount: { one: "{count} book", other: "{count} books" },
    empty: "No books published yet — be the first to share one below.",
    free: "Free",
    /** Shown when a book has no author profile. Brand name: don't translate. */
    defaultAuthor: "The Leap",
  },
  catalogue: {
    heading: "Books & Literature",
    readerSubheading: "Go deeper through books, teachings and curated resources.",
    authorSubheading: "Submit a book for review — approved books join the Library.",
  },
  application: {
    eyebrowPending: "Author Application",
    eyebrowDefault: "Become an Author",
    headingPending: "Your application is under review",
    headingMoreInfo: "We need a bit more from you",
    headingDefault: "Publish your book with The Leap",
    bodyPending: "We'll let you know as soon as it's reviewed.",
    bodyMoreInfo: "Pick up your application where you left off.",
    bodyDefault:
      "Share your writing with our community — free or paid, your choice.",
    continueApplication: "Continue application",
    applyNow: "Apply now",
    rejected: "Your author application wasn't approved.",
    backToLibrary: "Back to Library",
    underReview: "Your author application is under review.",
    formHeading: "Apply to become an author",
    moreInfoRequested: "More information requested",
    bioLabel: "A little about you",
    reasonLabel: "Why do you want to publish with The Leap?",
    websiteLabel: "Website or profile link (optional)",
    agreement: "I agree to The Leap's publishing requirements.",
    resubmit: "Resubmit application",
    submit: "Submit application",
  },
  submission: {
    editBook: "Edit book",
    newBook: "New book",
    reviewerFeedback: "Reviewer feedback",
    titleLabel: "Title",
    descriptionLabel: "Description",
    categoriesLabel: "Categories (comma-separated)",
    categoriesPlaceholder: "Discipleship, Christian Living",
    manuscriptLabel: "Manuscript (PDF or EPUB)",
    currentFile: "Current file: {filename}",
    coverLabel: "Cover image",
    priceLabel: "Price in USD (leave blank for free)",
    rightsAttestation:
      "I confirm that I own the rights to this work, or have permission to publish it.",
    saveDraft: "Save draft",
    submitForReview: "Submit for review",
    edit: "Edit",
    statusLabels: {
      draft: "Draft",
      pending_review: "Pending Review",
      changes_requested: "Changes Requested",
      rejected: "Rejected",
      approved: "Approved",
      published: "Published",
      unpublished: "Unpublished",
    },
  },
  detail: {
    readNow: "Read now",
    purchasingNotLive: "Purchasing isn't live yet",
    purchasingNotLiveBody:
      "We're still wiring up payments for paid titles — check back soon to buy this one.",
    viewLargerCover: "View larger cover for {title}",
    coverAlt: "{title} cover",
  },
  reader: {
    back: "Back",
    /** Fallback title when a book's title can't be loaded. */
    untitled: "Book",
    loading: "Loading book…",
    epubError: "This EPUB couldn't be loaded.",
    pdfError: "This PDF couldn't be loaded.",
    fileErrorHint: "The file may be corrupted or in an unsupported format.",
    previousPage: "Previous page",
    nextPage: "Next page",
    pageOf: "{page} / {total}",
  },
};

export type BooksMessages = typeof books;
