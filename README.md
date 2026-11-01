# Bassem & Reem — Wedding Invitation

An elegant, royal-themed wedding invitation website with English / Arabic, dark & light modes, countdown, guestbook, RSVP, gallery, curtains, and an invitation envelope.

## Quick start

Open `index.html` in a browser (double-click), or serve the folder locally:

```bash
# optional — from this folder
npx serve .
```

> Tip: if music or fonts behave oddly with `file://`, use a local server.

## Edit everything in one place

**Main file:** [`js/config.js`](js/config.js)

| What to change | Where |
| --- | --- |
| Names | `couple.groom` / `couple.bride` |
| Wedding date (countdown) | `weddingDate` — e.g. `"2027-03-03T18:00:00"` |
| Displayed date & time | `displayDate` / `displayTime` (en + ar) |
| Venue & address | `location.venueName` / `location.address` |
| Google Maps link | `location.mapUrl` |
| Optional map embed | `location.mapEmbedUrl` |
| Ceremony schedule | `events` array |
| Love story chapters | `loveStory` array |
| Gallery photos | `gallery` — point `src` to your images |
| Dress code | `dressCode` |
| Music file | `music.src` — e.g. `"assets/music/royal-waltz.mp3"` |
| Seed guestbook messages | `guestbookSeeds` |
| Default language / theme | `defaults.language` / `defaults.theme` |

**Text translations:** [`js/i18n.js`](js/i18n.js) — English & Arabic strings.

**Your photos:** put files in `assets/images/` then update paths in `config.js` → `gallery`.

**Your music:** put an MP3/OGG in `assets/music/`, set `music.src` in `config.js`.  
If left empty, a soft built-in ambient tone plays after the envelope is opened (browsers block autoplay until a click).

## Features

- Animated red curtains & invitation envelope
- Welcome message & “hope to see you there”
- Date / schedule section + location section
- Love story timeline
- Live countdown to **3 March 2027**
- Photo gallery with lightbox
- Guestbook wishes (saved in the browser; visible to anyone on that device)
- RSVP form (saved locally — open DevTools → Application → Local Storage → `br-rsvps`)
- English ↔ Arabic (RTL)
- Light / dark mode
- Muteable music player
- Mobile-responsive layout

## Guestbook & RSVP note

Wishes and RSVPs are stored in **browser localStorage** so the site works with no backend.  
For a shared online guestbook (all guests see the same list), connect a free service such as Firebase, Supabase, or Formspree and replace the `loadWishes` / `saveWishes` helpers in `js/app.js`.

## Folder structure

```
├── index.html
├── README.md
├── css/styles.css
├── js/config.js      ← edit content here
├── js/i18n.js        ← edit translations here
├── js/app.js
└── assets/
    ├── images/       ← your photos go here
    └── music/        ← your audio goes here
```

With love — Bassem & Reem · 03.03.2027
# My-Wedding-Invitation
