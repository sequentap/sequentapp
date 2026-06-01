/**
 * Sequent — main.js
 * Banner, nav, hamburger, language switcher + i18n translation engine
 */
(function () {
  'use strict';

  /* ── Language data ── */
  const LANG_NAMES = {
    ar:'العربية', en:'English', es:'Español',
    fr:'Français', de:'Deutsch', pt:'Português',
    hi:'हिन्दी', zh:'中文'
  };
  const IMG_LANG = {
    ar:'ar', en:'en', es:'en', fr:'en',
    de:'en', pt:'en', hi:'en', zh:'en'
  };

  let currentLang = localStorage.getItem('sq_lang') || 'ar';

  /* ── Translation engine ── */
  function getStrings(lang) {
    const map = {
      ar: typeof STRINGS_AR !== 'undefined' ? STRINGS_AR : null,
      en: typeof STRINGS_EN !== 'undefined' ? STRINGS_EN : null,
      es: typeof STRINGS_ES !== 'undefined' ? STRINGS_ES : null,
      fr: typeof STRINGS_FR !== 'undefined' ? STRINGS_FR : null,
      de: typeof STRINGS_DE !== 'undefined' ? STRINGS_DE : null,
      pt: typeof STRINGS_PT !== 'undefined' ? STRINGS_PT : null,
      hi: typeof STRINGS_HI !== 'undefined' ? STRINGS_HI : null,
      zh: typeof STRINGS_ZH !== 'undefined' ? STRINGS_ZH : null,
    };
    return map[lang] || map['ar'] || {};
  }

  function applyTranslations(lang) {
    const dict = getStrings(lang);
    if (!dict || Object.keys(dict).length === 0) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
  }

  /* ── Banner show/hide on scroll ── */
  const banner = document.getElementById('site-banner');
  if (banner) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        banner.classList.add('hidden');
      } else {
        banner.classList.remove('hidden');
      }
    }, { passive: true });
  }

  /* ── Nav scroll shadow ── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Hamburger — روابط فقط بدون اللغات ── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mob-nav');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (nav && !nav.contains(e.target) && !mob.contains(e.target)) {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Language switcher ── */
  const langBtn = document.getElementById('lang-btn');
  const langDD  = document.getElementById('lang-dropdown');
  const langLbl = document.getElementById('lang-label');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('sq_lang', lang);

    /* Direction */
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    /* Nav label */
    if (langLbl) langLbl.textContent = LANG_NAMES[lang];

    /* Active states */
    document.querySelectorAll('.lang-opt, .footer-lang-item').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang));

    /* Apply translations to data-i18n elements */
    applyTranslations(lang);

    /* Screen images */
    const il = IMG_LANG[lang];
    const homeImgs = {
      'img-ch1':'screen8', 'img-ch2':'screen3', 'img-ch3':'screen6'
    };
    Object.entries(homeImgs).forEach(([id, name]) => {
      const el = document.getElementById(id);
      if (el) el.src = `assets/images/screens/${name}_${il}.png`;
    });
    const tourImgs = { 1:'screen3', 2:'screen2', 3:'screen4', 4:'screen5', 5:'screen7' };
    Object.entries(tourImgs).forEach(([i, name]) => {
      const el = document.getElementById(`tour-img-${i}`);
      if (el) el.src = `assets/images/screens/${name}_${il}.png`;
    });

    /* Close menus */
    if (langDD) langDD.classList.remove('open');
    if (mob)    mob.classList.remove('open');
    if (ham)    ham.setAttribute('aria-expanded', 'false');

    /* Fire event for tour.js */
    document.dispatchEvent(new CustomEvent('sq:langchange', { detail:{ lang } }));
  }

  /* Dropdown toggle */
  if (langBtn && langDD) {
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = langDD.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', () => langDD.classList.remove('open'));
  }

  /* Lang buttons */
  document.querySelectorAll('.lang-opt').forEach(b =>
    b.addEventListener('click', e => { e.stopPropagation(); applyLang(b.dataset.lang); }));
  document.querySelectorAll('.footer-lang-item').forEach(b =>
    b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ── Scroll Reveal ── */
  const revEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revEls.forEach(el => io.observe(el));
  } else {
    revEls.forEach(el => el.classList.add('on'));
  }

  /* ── Smooth scroll anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });

  /* ── Init on DOM ready ── */
  document.addEventListener('DOMContentLoaded', () => { applyLang(currentLang); });

  window.SQ = { applyLang, currentLang: () => currentLang, getDict: (lang) => getStrings(lang) };
})();
