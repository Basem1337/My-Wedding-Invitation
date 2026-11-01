/**
 * Bassem & Reem — Wedding Invitation App
 */

(() => {
  "use strict";

  const cfg = WEDDING_CONFIG;
  const STORAGE = {
    theme: "br-theme",
    wishes: "br-wishes-v2",
    musicMuted: "br-music-muted",
  };

  let theme = localStorage.getItem(STORAGE.theme) || cfg.defaults.theme || "light";
  let musicMuted = localStorage.getItem(STORAGE.musicMuted) === "1";
  let audioCtx = null;
  let audioNodes = null;
  let musicEl = null;
  let musicStarted = false;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const envelopeOverlay = $("#envelopeOverlay");
  const envelopeBtn = $("#envelopeBtn");
  const openInviteBtn = $("#openInviteBtn");
  const site = $("#site");
  const curtains = $("#curtains");
  const hero = $("#hero");
  const themeToggle = $("#themeToggle");
  const musicToggle = $("#musicToggle");
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  const siteHeader = $("#siteHeader");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  let lightboxItems = [];
  let lightboxIndex = 0;

  function t(key) {
    return (I18N.en && I18N.en[key]) || key;
  }

  function applyCopy() {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";

    $$("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });

    $$("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    const dateStr = cfg.displayDate;
    const timeStr = cfg.displayTime;

    ["#cardDate", "#heroDate", "#bigDate"].forEach((sel) => {
      const el = $(sel);
      if (el) el.textContent = dateStr;
    });
    const bigTime = $("#bigTime");
    if (bigTime) bigTime.textContent = timeStr;

    const footerDate = $("#footerDate");
    if (footerDate) {
      const d = new Date(cfg.weddingDate);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      footerDate.textContent = `${dd} · ${mm} · ${d.getFullYear()}`;
    }

    $("#groomName") && ($("#groomName").textContent = cfg.couple.groom);
    $("#brideName") && ($("#brideName").textContent = cfg.couple.bride);
    $("#envGroom") && ($("#envGroom").textContent = cfg.couple.groom);
    $("#envBride") && ($("#envBride").textContent = cfg.couple.bride);

    const cardNames = $(".card-names");
    if (cardNames) {
      cardNames.innerHTML = `${cfg.couple.groom} <span>&amp;</span> ${cfg.couple.bride}`;
    }

    const venueName = $("#venueName");
    const venueAddress = $("#venueAddress");
    if (venueName) venueName.textContent = cfg.location.venueName;
    if (venueAddress) venueAddress.textContent = cfg.location.address;

    const venuePreviewImg = $("#venuePreviewImg");
    if (venuePreviewImg && cfg.location.venuePreview) {
      venuePreviewImg.src = cfg.location.venuePreview;
      venuePreviewImg.alt = cfg.location.venuePreviewAlt || cfg.location.venueName;
    }

    const dress = $("#dressCodeText");
    if (dress) dress.textContent = cfg.dressCode;

    const mapLink = $("#mapLink");
    if (mapLink) mapLink.href = cfg.location.mapUrl;

    renderTimeline();
    renderGallery();
    renderWishes();
    updateMusicAria();
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE.theme, theme);
  }

  themeToggle?.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    applyTheme();
  });

  /* ---------- Music ---------- */
  function createAmbientTone() {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    audioCtx = new AC();
    const master = audioCtx.createGain();
    master.gain.value = musicMuted ? 0 : Math.min(cfg.music.volume, 0.5);
    master.connect(audioCtx.destination);

    const sequence = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    let step = 0;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = sequence[0];
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(master);
    osc.start();

    const pad = audioCtx.createOscillator();
    const padGain = audioCtx.createGain();
    pad.type = "sine";
    pad.frequency.value = 196;
    padGain.gain.value = 0.04;
    pad.connect(padGain);
    padGain.connect(master);
    pad.start();

    const timer = setInterval(() => {
      if (!audioCtx) return;
      step = (step + 1) % sequence.length;
      osc.frequency.setTargetAtTime(sequence[step], audioCtx.currentTime, 0.05);
    }, 900);

    audioNodes = { master, oscillators: [{ osc, gain }, { osc: pad, gain: padGain }], timer };
  }

  function startMusic() {
    if (musicStarted) {
      if (musicEl && musicEl.paused) {
        musicEl.play().catch(() => {});
      }
      if (audioCtx?.state === "suspended") audioCtx.resume();
      return;
    }
    musicStarted = true;

    const src = cfg.music.src;
    musicEl = $("#bgMusic") || (src ? new Audio(src) : null);

    if (musicEl && src) {
      if (src && musicEl.getAttribute("src") !== src) {
        musicEl.src = src;
      }
      musicEl.loop = cfg.music.loop !== false;
      musicEl.volume = musicMuted ? 0 : cfg.music.volume;
      const playPromise = musicEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          createAmbientTone();
          if (audioCtx?.state === "suspended") audioCtx.resume();
        });
      }
    } else {
      createAmbientTone();
      if (audioCtx?.state === "suspended") audioCtx.resume();
    }

    syncMusicUI();
  }

  function setMuted(muted) {
    musicMuted = muted;
    localStorage.setItem(STORAGE.musicMuted, muted ? "1" : "0");

    if (musicEl) {
      musicEl.volume = muted ? 0 : cfg.music.volume;
      if (!muted && musicEl.paused) musicEl.play().catch(() => {});
    }
    if (audioNodes?.master && audioCtx) {
      audioNodes.master.gain.setTargetAtTime(
        muted ? 0 : Math.min(cfg.music.volume, 0.5),
        audioCtx.currentTime,
        0.05
      );
    }
    if (!muted && audioCtx?.state === "suspended") audioCtx.resume();
    syncMusicUI();
  }

  function syncMusicUI() {
    musicToggle?.classList.toggle("is-muted", musicMuted);
    musicToggle?.setAttribute("aria-pressed", String(musicMuted));
    updateMusicAria();
  }

  function updateMusicAria() {
    musicToggle?.setAttribute("aria-label", t(musicMuted ? "unmuteMusic" : "muteMusic"));
  }

  musicToggle?.addEventListener("click", () => {
    if (!musicStarted) {
      startMusic();
      setMuted(false);
      return;
    }
    setMuted(!musicMuted);
  });

  /* ---------- Envelope ---------- */
  function openEnvelope() {
    envelopeBtn.classList.add("is-open");
    openInviteBtn.hidden = false;
    // Always begin audible when opening the invite
    setMuted(false);
    startMusic();
  }

  envelopeBtn?.addEventListener("click", openEnvelope);
  openInviteBtn?.addEventListener("click", enterSite);

  function enterSite() {
    envelopeOverlay.classList.add("is-leaving");
    document.body.classList.remove("locked");
    site.hidden = false;
    startMusic();

    requestAnimationFrame(() => {
      setTimeout(() => {
        curtains?.classList.add("is-open");
        hero?.classList.add("is-revealed");
      }, 200);
    });

    setTimeout(() => {
      envelopeOverlay.hidden = true;
    }, 900);
  }

  /* ---------- Dynamic content ---------- */
  function renderTimeline() {
    const tl = $("#timeline");
    if (!tl) return;
    tl.innerHTML = cfg.loveStory
      .map(
        (item) => `
      <li class="timeline-item fade-in">
        <p class="timeline-year">${item.year}</p>
        <h3 class="timeline-title">${t(item.titleKey)}</h3>
        <p class="timeline-text">${t(item.textKey)}</p>
      </li>`
      )
      .join("");
    observeFades(tl);
  }

  function buildLightboxItems() {
    lightboxItems = [];
    if (cfg.galleryCollage) {
      lightboxItems.push({
        src: cfg.galleryCollage,
        alt: t("galleryCollageCaption"),
      });
    }
    (cfg.gallery || []).forEach((item) => {
      lightboxItems.push({ src: item.src, alt: item.alt || "" });
    });
  }

  function renderGallery() {
    buildLightboxItems();

    const collageWrap = $("#galleryCollage");
    const collageImg = $("#galleryCollageImg");
    if (collageWrap && collageImg && cfg.galleryCollage) {
      collageImg.src = cfg.galleryCollage;
      collageImg.alt = t("galleryCollageCaption");
      collageWrap.hidden = false;
      collageWrap.classList.add("fade-in");
      collageWrap.onclick = () => openLightboxAt(0);
      observeFades(collageWrap);
    } else if (collageWrap) {
      collageWrap.hidden = true;
    }

    const grid = $("#galleryGrid");
    if (!grid) return;
    const offset = cfg.galleryCollage ? 1 : 0;
    grid.innerHTML = cfg.gallery
      .map((item, i) => {
        const alt = item.alt || "";
        return `
        <button type="button" class="gallery-item fade-in" data-index="${i + offset}" aria-label="${alt}">
          <img src="${item.src}" alt="${alt}" loading="lazy" />
        </button>`;
      })
      .join("");

    grid.querySelectorAll(".gallery-item").forEach((btn) => {
      btn.addEventListener("click", () => openLightboxAt(+btn.dataset.index));
    });
    observeFades(grid);
  }

  function openLightboxAt(index) {
    if (!lightbox || !lightboxItems.length) return;
    lightboxIndex = ((index % lightboxItems.length) + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[lightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    if (lightboxCaption) lightboxCaption.textContent = item.alt;
    lightbox.hidden = false;
    document.body.classList.add("locked");
  }

  function stepLightbox(delta) {
    openLightboxAt(lightboxIndex + delta);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    if (lightboxCaption) lightboxCaption.textContent = "";
    document.body.classList.remove("locked");
  }

  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLightbox(-1);
  });
  $("#lightboxNext")?.addEventListener("click", (e) => {
    e.stopPropagation();
    stepLightbox(1);
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------- Guestbook ---------- */
  const WISHES_PER_PAGE = 5;
  let wishesPage = 1;

  function loadWishes() {
    try {
      const raw = localStorage.getItem(STORAGE.wishes);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const seeds = (cfg.guestbookSeeds || []).map((s) => ({
      name: s.name,
      message: s.message,
      date: s.date || new Date().toISOString().slice(0, 10),
    }));
    saveWishes(seeds);
    return seeds;
  }

  function saveWishes(list) {
    localStorage.setItem(STORAGE.wishes, JSON.stringify(list));
  }

  function getWishesNewestFirst() {
    /* Stored oldest→newest; reverse so newest is first */
    return loadWishes().slice().reverse();
  }

  function renderWishes(page) {
    const wrap = $("#wishesList");
    const pagination = $("#wishesPagination");
    const pageInfo = $("#wishesPageInfo");
    const prevBtn = $("#wishesPrev");
    const nextBtn = $("#wishesNext");
    if (!wrap) return;

    const wishes = getWishesNewestFirst();
    const totalPages = Math.max(1, Math.ceil(wishes.length / WISHES_PER_PAGE));
    wishesPage = Math.min(Math.max(1, page || wishesPage), totalPages);

    if (!wishes.length) {
      wrap.innerHTML = `<p class="wishes-empty">${t("guestbookEmpty")}</p>`;
      if (pagination) pagination.hidden = true;
      return;
    }

    const start = (wishesPage - 1) * WISHES_PER_PAGE;
    const pageItems = wishes.slice(start, start + WISHES_PER_PAGE);

    wrap.innerHTML = pageItems
      .map(
        (w) => `
        <article class="wish-card">
          <p class="wish-msg">${escapeHtml(w.message)}</p>
          <div class="wish-meta">
            <span class="wish-name">${escapeHtml(w.name)}</span>
            <time datetime="${w.date}">${formatDate(w.date)}</time>
          </div>
        </article>`
      )
      .join("");

    if (pagination) {
      pagination.hidden = wishes.length <= WISHES_PER_PAGE;
      if (pageInfo) pageInfo.textContent = `${wishesPage} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = wishesPage <= 1;
      if (nextBtn) nextBtn.disabled = wishesPage >= totalPages;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (_) {
      return iso;
    }
  }

  $("#wishForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#wishName").value.trim();
    const message = $("#wishMessage").value.trim();
    const status = $("#wishStatus");

    if (!name || !message) {
      status.textContent = t("guestbookError");
      status.className = "form-status is-err";
      return;
    }

    const wishes = loadWishes();
    wishes.push({
      name,
      message,
      date: new Date().toISOString(),
    });
    saveWishes(wishes);
    e.target.reset();
    status.textContent = t("guestbookThanks");
    status.className = "form-status is-ok";
    wishesPage = 1;
    renderWishes(1);
  });

  $("#wishesPrev")?.addEventListener("click", () => {
    renderWishes(wishesPage - 1);
  });

  $("#wishesNext")?.addEventListener("click", () => {
    renderWishes(wishesPage + 1);
  });

  /* ---------- Countdown ---------- */
  function updateCountdown() {
    const target = new Date(cfg.weddingDate).getTime();
    const now = Date.now();
    const diff = target - now;
    const done = $("#countdownDone");
    const blocks = $("#countdownTimer");

    if (diff <= 0) {
      if (blocks) blocks.hidden = true;
      if (done) done.hidden = false;
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const pad = (n) => String(n).padStart(2, "0");
    $("#cdDays").textContent = pad(days);
    $("#cdHours").textContent = pad(hours);
    $("#cdMins").textContent = pad(mins);
    $("#cdSecs").textContent = pad(secs);
  }

  function setupMap() {
    const wrap = $("#mapWrap");
    const iframe = $("#mapEmbed");
    if (!wrap || !iframe || !cfg.location.mapEmbedUrl) return;
    iframe.src = cfg.location.mapEmbedUrl;
    wrap.hidden = false;
  }

  function setupCountdownBg() {
    const bg = $(".countdown-bg");
    if (!bg || !cfg.countdownBackground) return;
    bg.style.backgroundImage = `url("${cfg.countdownBackground}")`;
  }

  /* ---------- Nav ---------- */
  navToggle?.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mainNav.classList.toggle("is-open", !open);
  });

  mainNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });

  window.addEventListener(
    "scroll",
    () => {
      const pastHero = window.scrollY > Math.min(window.innerHeight * 0.72, 520);
      siteHeader?.classList.toggle("is-solid", pastHero);
      siteHeader?.classList.toggle("is-over-hero", !pastHero);
    },
    { passive: true }
  );

  let fadeObserver;

  function observeFades(root = document) {
    if (!fadeObserver) {
      fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    root.querySelectorAll?.(".fade-in:not(.is-visible)")?.forEach((el) => fadeObserver.observe(el));
    if (root.classList?.contains("fade-in")) fadeObserver.observe(root);
  }

  function init() {
    document.body.classList.add("locked");
    applyTheme();
    syncMusicUI();
    applyCopy();
    setupMap();
    setupCountdownBg();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    document.addEventListener("keydown", (e) => {
      if (envelopeOverlay.hidden || envelopeOverlay.classList.contains("is-leaving")) return;
      if (e.key === "Enter" || e.key === " ") {
        if (!envelopeBtn.classList.contains("is-open")) {
          e.preventDefault();
          openEnvelope();
        } else if (!openInviteBtn.hidden) {
          e.preventDefault();
          enterSite();
        }
      }
    });

    const sectionObserver = new MutationObserver(() => {
      if (!site.hidden) {
        $$(".section-inner, .section-title, .lead").forEach((el) => {
          el.classList.add("fade-in");
        });
        observeFades(document);
        sectionObserver.disconnect();
      }
    });
    sectionObserver.observe(site, { attributes: true, attributeFilter: ["hidden"] });
  }

  init();
})();
