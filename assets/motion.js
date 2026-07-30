/* home.js — landing page only. Vanilla, no dependency, no build step.

   Everything here is PROGRESSIVE. The page is fully readable with this file
   deleted: the reveal start-state lives behind html.js-anim (set inline in
   <head>), the counters already contain their final text in the markup, and
   the progress bar is display:none until this file is parsed.

   Reduced motion is honoured by skipping the animation and jumping straight
   to the end state — never by leaving something half-animated. */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── scroll progress ─────────────────────────────────────────────────── */

  const bar = document.getElementById('progress');
  if (bar) {
    let ticking = false;
    const draw = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    addEventListener('resize', draw, { passive: true });
    draw();
  }

  /* ── reveal on enter ─────────────────────────────────────────────────────
     IntersectionObserver is used rather than CSS animation-timeline because
     scroll-driven CSS animations still only ship in Chromium — this behaves
     the same in every browser. No IO support at all → reveal everything now. */

  const revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);   // reveal once; re-animating on every
                                      // pass makes long pages feel twitchy
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(el => io.observe(el));

    /* Anything already above the fold when the observer attaches would
       otherwise sit at opacity:0 until the first scroll. */
    requestAnimationFrame(() => {
      revealables.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    });
  }

  /* ── number count-up ─────────────────────────────────────────────────────
     The markup already holds the final string ("3,119", "~1,600", "23").
     We read it, animate up to it, then write the ORIGINAL string back so no
     rounding or formatting difference can survive the animation. */

  const counters = document.querySelectorAll('[data-count]');

  const runCount = (el) => {
    const final = el.textContent;
    const match = final.match(/[\d,]+/);
    if (!match) return;

    const target = Number(match[0].replace(/,/g, ''));
    if (!Number.isFinite(target) || target === 0) return;

    const prefix = final.slice(0, match.index);
    const suffix = final.slice(match.index + match[0].length);
    const dur = 900;
    const t0 = performance.now();

    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
        requestAnimationFrame(step);
      } else {
        el.textContent = final;   // restore verbatim
      }
    };
    requestAnimationFrame(step);
  };

  if (!reduced && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        co.unobserve(entry.target);
        runCount(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  }

  /* ── nav scroll-spy ──────────────────────────────────────────────────── */

  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const sections = links
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
})();
