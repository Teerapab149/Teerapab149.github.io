/* verdure.js — interactions for index-verdure.html only.
   Vanilla, no dependency, no build step.

   Everything is an ENHANCEMENT. Delete this file and the page still reads:
   the reveal start-states live under html.js-anim (set inline in <head>), the
   growing card falls back to its capsule size because --p stays 0, the
   counters already contain their final text, and the scroll readout is
   display:none until this file runs.

   Reduced motion is honoured by jumping to the end state, never by leaving
   something half-animated. */

(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = requestAnimationFrame;
  const clamp01 = n => n < 0 ? 0 : n > 1 ? 1 : n;

  /* ── what used to live here ──────────────────────────────────────────────
     The line-mask engine (lmSplit / lmTry / lmAll, its ResizeObserver and
     window.__lmRestore) and the enter observer that hands out .is-in moved to
     assets/reveal.js on 2026-07-31, because the four case-study pages need
     exactly the same two things and a second copy would drift.

     reveal.js is loaded BEFORE this file on every page, so by the time anything
     below runs the splits have already been attempted and window.__lmRestore
     exists for i18n.js. Nothing here depends on either of them. */

  /* ── the capsule growing to full-bleed ───────────────────────────────────
     .grow is a tall spacer; .grow__pin sticks inside it. Progress runs 0 → 1
     across the distance the pin actually spends stuck. */

  const grow = document.querySelector('.grow');
  const card = document.querySelector('.grow__card');
  /* The readout in the chrome bar. Measured off the SCREEN, not the card: the
     bezel is padding, and the breakpoints inside are container queries on the
     screen. Its fallback text ("responsive") is already in the markup. */
  const screen = document.querySelector('.grow__screen');
  const meas = document.querySelector('.grow__meas');
  let lastMeas = '';

  /* ── the cover ───────────────────────────────────────────────────────────
     Three things, all cosmetic:
       · --cp, how far the cream hero has ridden up over the cover (0 → 1). CSS
         spends it on scale, opacity and the two name lines parting.
       · --py, a small parallax on the portrait, from the same progress.
       · the top bar going transparent while the dark panel is behind it.
     With this file absent --cp and --py stay 0, the bar stays cream, and the
     cover renders finished. */

  const cover = document.getElementById('intro');
  const hero = document.getElementById('top');
  const portrait = document.querySelector('.cover__portrait');
  const bar = document.querySelector('.bar');
  /* The bar used to watch the cover alone, because the cover was the only dark
     thing on the page. Now there is a whole dark third act, so it watches every
     dark section instead: four rects per frame, which is cheaper than asking
     the document what is under the bar. */
  const darkSections = Array.from(document.querySelectorAll('.cover, .act-dark, .end'));
  const BAR_H = 58;
  const overDark = () => darkSections.some(s => {
    const r = s.getBoundingClientRect();
    return r.top <= BAR_H + 1 && r.bottom > BAR_H + 1;
  });
  const PARALLAX = 34;   // px of travel across one full screen of scrolling

  /* ── entry: start the camera as soon as the shot is worth looking at ──────
     Kanit swapping mid-move would make the letters jump, so we wait for the
     font — but only briefly. The first frames are a 6× blur, which hides a late
     swap completely, so 320ms is plenty and a slow font CDN can never strand the
     cover in its start state. */

  /* Nobody should sit through a title sequence twice. Second load in the same
     session plays it at half length; a new tab or a new day gets the full one. */
  let dscale = 1;
  try {
    if (sessionStorage.getItem('seen')) { dscale = .5; root.style.setProperty('--dscale', '.5'); }
    sessionStorage.setItem('seen', '1');
  } catch { /* private mode — full length every time is the harmless default */ }

  /* Scroll, click or type and you are done watching: the rest of the sequence
     collapses to a 180ms catch-up. Freezing it mid-move would be worse than
     never playing it, and an entrance you cannot escape is a trap. */
  const skip = () => root.classList.add('is-skip');
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(t =>
    addEventListener(t, skip, { once: true, passive: true }));
  addEventListener('scroll', () => { if (scrollY > 4) skip(); }, { once: true, passive: true });

  /* The dimension line's readout. It counts to the width of the bar beside it —
     it is measuring that line, not claiming to measure the viewport. */
  const mNum = document.querySelector('[data-measure]');
  const mBar = document.querySelector('.measure__bar');

  /* offsetWidth, not getBoundingClientRect: the bar starts at scaleX(0) and a
     client rect is the TRANSFORMED box, so the readout would count to zero. */
  const measureNow = () => (mNum && mBar) ? mBar.offsetWidth : 0;

  const runMeasure = () => {
    const w = measureNow();
    if (!w) return;
    if (reduced) { mNum.textContent = String(w); return; }
    const dur = 900 * dscale;
    const t0 = performance.now() + 120 * dscale;
    const step = now => {
      const p = clamp01((now - t0) / dur);
      mNum.textContent = String(Math.round(w * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf(step);
    };
    raf(step);
  };

  const ready = () => { root.classList.add('is-ready'); runMeasure(); };

  if (reduced) {
    ready();
  } else {
    let fired = false;
    const go = () => { if (!fired) { fired = true; raf(() => raf(ready)); } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    setTimeout(go, 320);
  }

  /* ── pin the cover only when it genuinely fits ────────────────────────────
     The overlap move needs the whole cover on screen at once; pinning a panel
     taller than the viewport would bury its lower half permanently. Measured
     rather than guessed, and re-measured on resize, because the answer depends
     on how tall this content lands at this width. */

  /* The cover used to be pinned while the next section rode over it, which meant
     a measured "does it fit the viewport" test, a class, and a resize listener.
     That whole apparatus is gone with the pin: the cover scrolls away normally
     now and --cp only drives a parallax, which is safe at any size. */

  /* ── scroll readout ──────────────────────────────────────────────────── */

  const count = document.getElementById('count');

  let queued = false;

  const onScroll = () => {
    if (grow && card) {
      const r = grow.getBoundingClientRect();
      const travel = r.height - innerHeight;
      card.style.setProperty('--p', travel > 0 ? clamp01(-r.top / travel).toFixed(4) : 0);

      if (screen && meas) {
        const w = Math.round(screen.getBoundingClientRect().width);
        // the names the breakpoints actually mean, not the Tailwind initials
        const txt = w + ' px · ' + (w < 640 ? 'phone' : w < 1024 ? 'tablet' : w < 1280 ? 'laptop' : 'desktop');
        if (txt !== lastMeas) { meas.textContent = txt; lastMeas = txt; }
      }
    }

    if (cover && hero) {
      // measured from the HERO, not the cover: the cover is sticky on desktop, so
      // its own rect stops moving the moment it pins. The hero's top edge is what
      // actually travels — innerHeight away → 0 as it finishes covering.
      const top = hero.getBoundingClientRect().top;
      const p = 1 - clamp01(top / Math.max(1, innerHeight));

      if (!reduced) {
        cover.style.setProperty('--cp', p.toFixed(4));
        if (portrait) portrait.style.setProperty('--py', (-PARALLAX * p).toFixed(2) + 'px');
      }
    }

    if (bar) bar.classList.toggle('bar--dark', overDark());
    // only visible on overscroll, but a cream rubber-band under a dark ending
    // gives the game away
    document.body.classList.toggle('act-on', scrollY > 0 &&
      innerHeight + scrollY >= root.scrollHeight - 4);

    if (count) {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
      count.textContent = String(pct).padStart(2, '0') + ' — scroll';
    }

    queued = false;
  };

  const request = () => { if (!queued) { queued = true; raf(onScroll); } };

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  // the readout is a measurement, so it has to stay true after a resize —
  // set, not re-animated: counting up again on every drag would be noise
  addEventListener('resize', () => { const w = measureNow(); if (w && mNum) mNum.textContent = String(w); },
    { passive: true });
  onScroll();

  /* ── counters ──────────────────────────────────────────────────────────
     The markup already holds the final string ("3,119", "~1,600"). Read it,
     count up to it, then write the ORIGINAL string back so no formatting
     difference can survive the animation. */

  const runCount = el => {
    const final = el.textContent;
    const m = final.match(/[\d,]+/);
    if (!m) return;

    const target = Number(m[0].replace(/,/g, ''));
    if (!Number.isFinite(target) || target === 0) return;

    const pre = final.slice(0, m.index);
    const post = final.slice(m.index + m[0].length);
    const t0 = performance.now();

    const step = now => {
      const p = Math.min(1, (now - t0) / 950);
      if (p < 1) {
        el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + post;
        raf(step);
      } else {
        el.textContent = final;   // restore verbatim
      }
    };
    raf(step);
  };

  if (!reduced && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        runCount(e.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(el => co.observe(el));
  }
})();
