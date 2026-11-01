/**
 * ============================================================
 *  BASSEM & REEM — WEDDING INVITATION CONFIG
 *  Edit this file to change names, dates, location, story,
 *  gallery images, music, and more. No other files needed
 *  for most content updates.
 * ============================================================
 */

const WEDDING_CONFIG = {
  /* ---------- Couple ---------- */
  couple: {
    groom: "Bassem",
    bride: "Reem",
    /** Shown under the names, e.g. "Are Getting Married" */
    taglineKey: "heroTagline",
  },

  /* ---------- Wedding Date & Time ---------- */
  /** Used by the countdown — ISO format recommended */
  weddingDate: "2027-03-03T18:00:00",
  /** Display strings (English / Arabic handled in i18n; these are fallbacks) */
  displayDate: "March 3, 2027",
  displayTime: "6:00 PM",

  /* ---------- Location ---------- */
  location: {
    venueName: "The Royal Garden Hall",
    address: "123 Garden Avenue, Cairo, Egypt",
    /** Google Maps / Apple Maps link — paste your real link here */
    mapUrl: "https://maps.google.com/?q=Cairo+Egypt",
    /** Optional embed URL for an iframe map (leave empty to hide map) */
    mapEmbedUrl: "",
    /**
     * Venue preview shown on the left of "The Day" section.
     * Replace with your own photo (portrait ~800×1000 works best).
     */
    venuePreview: "assets/images/venue-preview.svg",
    venuePreviewAlt: "Wedding venue preview",
  },

  /* ---------- Love Story Timeline ---------- */
  loveStory: [
    {
      year: "2019",
      titleKey: "story1Title",
      textKey: "story1Text",
    },
    {
      year: "2022",
      titleKey: "story2Title",
      textKey: "story2Text",
    },
    {
      year: "2025",
      titleKey: "story3Title",
      textKey: "story3Text",
    },
    {
      year: "2027",
      titleKey: "story4Title",
      textKey: "story4Text",
    },
  ],

  /* ---------- Photo Gallery ---------- */
  /**
   * Replace paths with your own images in assets/images/
   * Tip: use landscape photos (~1200×800) for best results.
   * SVG placeholders are included so the site looks complete out of the box.
   */
  /**
   * Editorial B&W mosaic — replace these with your real photos.
   * Tip: black & white or muted photos suit the gallery best.
   * To use your own collage image, set galleryCollage below.
   */
  /** Featured collage above the grid (set "" to hide) */
  galleryCollage: "assets/images/gallery-collage-ref.png",
  gallery: [
    { src: "assets/images/bw-1.svg", alt: "The dress" },
    { src: "assets/images/bw-2.svg", alt: "The ring" },
    { src: "assets/images/bw-3.svg", alt: "Together" },
    { src: "assets/images/bw-4.svg", alt: "Soft light" },
    { src: "assets/images/bw-5.svg", alt: "In motion" },
    { src: "assets/images/bw-6.svg", alt: "Embrace" },
    { src: "assets/images/bw-7.svg", alt: "Hands" },
    { src: "assets/images/bw-8.svg", alt: "The dance" },
  ],

  /** Soft photo behind countdown (blurred) */
  countdownBackground: "assets/images/gallery-collage-ref.png",

  /* ---------- Dress Code ---------- */
  dressCode: "Formal / Black Tie Optional — Deep reds, golds & ivory welcomed",

  /* ---------- Music ---------- */
  /**
   * Plays after the guest opens the envelope.
   * Default: Mendelssohn Wedding March (public domain).
   * Swap the file in assets/music/ and update the path if you like.
   */
  music: {
    src: "assets/music/royal-waltz.mp3",
    volume: 0.42,
    loop: true,
  },

  /* ---------- Guestbook seed messages ---------- */
  guestbookSeeds: [
    {
      name: "Sara",
      message: "Wishing you a lifetime of love and laughter!",
      date: "2026-09-12",
    },
    {
      name: "Omar",
      message: "Can't wait to celebrate with you both!",
      date: "2026-09-20",
    },
    {
      name: "Layla",
      message: "May your days be filled with joy and your home with warmth.",
      date: "2026-09-28",
    },
    {
      name: "Hassan",
      message: "Congratulations — what a beautiful beginning.",
      date: "2026-10-03",
    },
    {
      name: "Nora",
      message: "Sending all our love for your special day!",
      date: "2026-10-08",
    },
    {
      name: "Karim",
      message: "So happy for you both. Here's to forever.",
      date: "2026-10-14",
    },
    {
      name: "Maya",
      message: "Your love story inspires us. Mazel tov!",
      date: "2026-10-22",
    },
  ],

  defaults: {
    theme: "light", // "light" | "dark"
  },
};
