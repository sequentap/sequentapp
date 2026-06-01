/**
 * Sequent — tour.js
 * 5-step tour navigation with keyboard support
 */
(function () {
  'use strict';

  const TOTAL = 5;
  let current = 0;

  const prevBtn   = document.getElementById('tour-prev');
  const nextBtn   = document.getElementById('tour-next');
  const counter   = document.getElementById('step-counter');
  const mainTitle = document.getElementById('tour-main-title');
  const dots      = document.querySelectorAll('.tour-dot');

  function getDict() {
    const lang = (window.SQ && window.SQ.currentLang()) || localStorage.getItem('sq_lang') || 'ar';
    return (window.SQ && window.SQ.getDict(lang)) || {};
  }

  function showStep(n) {
    n = Math.max(0, Math.min(TOTAL - 1, n));
    document.querySelectorAll('.tour-step').forEach((el, i) =>
      el.classList.toggle('active', i === n));
    dots.forEach((d, i) => d.classList.toggle('active', i === n));
    if (counter) {
      const dict = getDict();
      const label = dict['tour_step_label'] || 'Step';
      const of    = dict['tour_of']         || 'of';
      counter.textContent = `${label} ${n + 1} ${of} ${TOTAL}`;
    }
    if (mainTitle) {
      const dict = getDict();
      mainTitle.textContent = dict[`tour_step_${n + 1}_title`] || '';
    }
    if (prevBtn) prevBtn.disabled = n === 0;
    if (nextBtn) nextBtn.disabled = n === TOTAL - 1;
    current = n;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showStep(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showStep(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => showStep(i)));

  document.addEventListener('keydown', e => {
    const isRtl = document.documentElement.dir === 'rtl';
    if (e.key === 'ArrowLeft')  showStep(isRtl ? current + 1 : current - 1);
    if (e.key === 'ArrowRight') showStep(isRtl ? current - 1 : current + 1);
  });

  document.addEventListener('sq:langchange', () => showStep(current));

  document.addEventListener('DOMContentLoaded', () => showStep(0));
})();
