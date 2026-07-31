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

  /* ── reveal on enter ─────────────────────────────────────────────────────
     One observer drives both the .up rises and the .scrawl draw-on: a scrawl
     inside a revealed block inherits .is-in from its ancestor, and a standalone
     one is observed directly. */

  /* ── line-mask ───────────────────────────────────────────────────────────
     Headings arrive one line at a time, sliding up from behind their own edge.
     docs/PLAN-AWWWARDS.md law L3: type slides out of a mask, it does not fade.

     THREE-TIER FALLBACK, in order of how badly things went:
       · no JS at all      → no .is-split, no start state, text simply visible
       · split refused/failed → the element keeps its .up reveal (both classes
                                are in the markup; .is-split is what switches
                                .up off), so it still animates, just plainly
       · reduced motion    → CSS jumps every line to its end state

     COST. The measuring pass is the expensive part, so it is kept small and
     honest about it:
       · opt-in — only elements marked .lm are touched, and never a paragraph
         (masking a body paragraph line by line just slows down reading)
       · one Range measurement per WORD, all reads batched before any write, so
         the whole split costs a single layout rather than one per word
       · re-split only when an element's own INLINE size actually changed —
         ResizeObserver fires on height too, and a split changes height, which
         is exactly how this turns into an infinite loop if you skip the check
       · 180ms trailing debounce, then the work happens inside one rAF

     THAI. Never split Thai below line level: sระ and tone marks are combining
     characters, and Thai has no spaces between words. Lines are safe; anything
     finer is not. See CLAUDE.md and the plan. */

  const LM_STAGGER = 80;                 // ms between consecutive lines
  const lmEls = Array.from(document.querySelectorAll('.lm'));
  const lmWidth = new WeakMap();

  const lmSplit = el => {
    // always measure from the original markup, never from a previous split
    if (el.__lmHTML == null) el.__lmHTML = el.innerHTML;
    else el.innerHTML = el.__lmHTML;
    el.classList.remove('is-split');

    const tokens = [];
    let ok = true;

    el.childNodes.forEach(node => {
      if (node.nodeType === 3) {
        const re = /\S+\s*/g;
        let m;
        while ((m = re.exec(node.data))) tokens.push({ node, s: m.index, e: m.index + m[0].length });
      } else if (node.nodeType === 1) {
        // a child element is ATOMIC: breaking one apart would strip an <svg> of
        // its namespace and cut .mark-wrap away from the scrawl it positions
        if (node.tagName === 'BR') tokens.push({ br: true });
        else tokens.push({ el: node });
      }
    });
    if (tokens.length < 2) return false;

    // ── every read happens here, before a single write ──
    const range = document.createRange();
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    const rects = tokens.map(t => {
      if (t.br) return null;
      if (t.el) return t.el.getBoundingClientRect();
      range.setStart(t.node, t.s);
      range.setEnd(t.node, t.e);
      return range.getBoundingClientRect();
    });

    // an atomic child that wrapped over two lines cannot be masked as one line
    rects.forEach(r => { if (r && lh && r.height > lh * 1.65) ok = false; });
    if (!ok) return false;

    const lines = [];
    let cur = null, top = 0;
    tokens.forEach((t, i) => {
      if (t.br) { cur = null; return; }
      const r = rects[i];
      if (!r) return;
      if (!cur || Math.abs(r.top - top) > 2) { cur = []; lines.push(cur); top = r.top; }
      cur.push(t);
    });
    if (!lines.length) return false;

    // ── now the writes, one fragment, one insertion ──
    const frag = document.createDocumentFragment();
    lines.forEach((line, i) => {
      const outer = document.createElement('span');
      outer.className = 'lm__l';
      const inner = document.createElement('span');
      inner.className = 'lm__i';
      inner.style.setProperty('--i', i);
      line.forEach(t => inner.appendChild(
        t.el ? t.el : document.createTextNode(t.node.data.slice(t.s, t.e))
      ));
      outer.appendChild(inner);
      frag.appendChild(outer);
    });
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(frag);
    el.classList.add('is-split');
    lmWidth.set(el, Math.round(el.getBoundingClientRect().width));
    return true;
  };

  const lmTry = el => {
    // Splitting something the visitor is already looking at would flash: the
    // text is on screen, then hidden, then re-revealed. Leave those to .up.
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;
    try { lmSplit(el); } catch { el.innerHTML = el.__lmHTML || el.innerHTML; el.classList.remove('is-split'); }
  };

  const lmAll = () => lmEls.forEach(lmTry);

  if (!reduced) {
    lmAll();

    // fonts change where lines break, so the first split is provisional
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => raf(lmAll));

    if ('ResizeObserver' in window) {
      let timer = 0;
      const ro = new ResizeObserver(entries => {
        let dirty = false;
        entries.forEach(e => {
          const w = Math.round(e.contentRect.width);
          // WIDTH only. Height changes when we split, and reacting to those is
          // how this becomes a loop that never settles.
          if (lmWidth.get(e.target) !== w) { lmWidth.set(e.target, w); e.__dirty = true; dirty = true; }
        });
        if (!dirty) return;
        clearTimeout(timer);
        timer = setTimeout(() => raf(lmAll), 180);
      });
      lmEls.forEach(el => ro.observe(el));
    }
  }

  /* i18n.js replaces innerHTML wholesale. If it wrote into a split element it
     would both destroy the split and cache the split markup as "the English
     version". So it hands control back here: restore the originals, let it
     swap the language, then split whatever the new text turned out to be. */
  window.__lmRestore = () => {
    lmEls.forEach(el => {
      if (el.__lmHTML != null) { el.innerHTML = el.__lmHTML; el.__lmHTML = null; }
      el.classList.remove('is-split');
      lmWidth.delete(el);
    });
    return () => { if (!reduced) raf(lmAll); };
  };

  const risers = document.querySelectorAll('.up, .scrawl, .lm');

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
