/* motion.js — the three case-study pages that are not fms-election (which uses
   app.js instead). Vanilla, no dependency, no build step.
   The header used to say "home.js — landing page only", which stopped being
   true two renames ago.

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
     GONE FROM HERE. assets/reveal.js now owns .is-in for every entrance class
     on every page — .reveal included — and it is loaded before this file.
     Observing an element twice means two observers racing for one class, and
     the real hazard is the mirror image of that: an element dropped from both
     lists sits at opacity:0 for good. One owner, one list. */

  /* ── number count-up ─────────────────────────────────────────────────────
     The markup already holds the final string ("3,119", "1,643", "23").
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
