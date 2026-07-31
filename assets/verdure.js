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

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = requestAnimationFrame;
  const clamp01 = n => n < 0 ? 0 : n > 1 ? 1 : n;

  /* ── reveal on enter ─────────────────────────────────────────────────────
     One observer drives both the .up rises and the .scrawl draw-on: a scrawl
     inside a revealed block inherits .is-in from its ancestor, and a standalone
     one is observed directly. */

  const risers = document.querySelectorAll('.up, .scrawl');

  if (reduced || !('IntersectionObserver' in window)) {
    risers.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);          // once only — re-animating on every
                                         // pass makes a long page feel twitchy
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    risers.forEach(el => io.observe(el));

    // whatever is already on screen when the observer attaches would otherwise
    // sit at opacity:0 until the first scroll
    raf(() => risers.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in');
    }));
  }

  /* ── the capsule growing to full-bleed ───────────────────────────────────
     .grow is a tall spacer; .grow__pin sticks inside it. Progress runs 0 → 1
     across the distance the pin actually spends stuck. */

  const grow = document.querySelector('.grow');
  const card = document.querySelector('.grow__card');

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
  const PARALLAX = 34;   // px of travel across one full screen of scrolling

  /* ── entry: start the camera as soon as the shot is worth looking at ──────
     Kanit swapping mid-move would make the letters jump, so we wait for the
     font — but only briefly. The first frames are a 6× blur, which hides a late
     swap completely, so 320ms is plenty and a slow font CDN can never strand the
     cover in its start state. */

  const ready = () => document.documentElement.classList.add('is-ready');

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

  const canPin = () => !reduced
    && matchMedia('(min-width: 901px)').matches
    && !!cover && cover.scrollHeight <= innerHeight + 1;

  const syncPin = () => {
    const on = canPin();
    document.documentElement.classList.toggle('is-pinned', on);
    if (!on && cover) cover.style.setProperty('--cp', '0');
  };

  /* ── scroll readout ──────────────────────────────────────────────────── */

  const count = document.getElementById('count');

  let queued = false;

  const onScroll = () => {
    if (grow && card) {
      const r = grow.getBoundingClientRect();
      const travel = r.height - innerHeight;
      card.style.setProperty('--p', travel > 0 ? clamp01(-r.top / travel).toFixed(4) : 0);
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
      // the bar is 58px tall; go back to cream the moment the cream hero reaches
      // it, not when the cover has fully left
      if (bar) bar.classList.toggle('bar--dark', top > 58);
    }

    if (count) {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.round((scrollY / max) * 100) : 0;
      count.textContent = String(pct).padStart(2, '0') + ' — scroll';
    }

    queued = false;
  };

  const request = () => { if (!queued) { queued = true; raf(onScroll); } };

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { syncPin(); request(); }, { passive: true });
  // synchronously, not in a frame callback: --cam has to be on the element before
  // the first paint or the cover flashes at 1× and then snaps to the 2.2× framing
  syncPin();
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
