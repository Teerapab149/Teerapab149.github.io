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

  /* ── scroll readout ──────────────────────────────────────────────────── */

  const count = document.getElementById('count');

  let queued = false;

  const onScroll = () => {
    if (grow && card) {
      const r = grow.getBoundingClientRect();
      const travel = r.height - innerHeight;
      card.style.setProperty('--p', travel > 0 ? clamp01(-r.top / travel).toFixed(4) : 0);
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
  addEventListener('resize', request, { passive: true });
  raf(onScroll);

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
