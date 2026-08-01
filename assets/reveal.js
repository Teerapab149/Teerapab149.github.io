/* reveal.js — the entrance engine, shared by ALL five pages.

   Extracted from assets/verdure.js on 2026-07-31 (PLAN-AWWWARDS P6): the four
   case-study pages needed the same line-mask and the same enter observer, and
   two copies of a measuring engine is how they drift apart. verdure.js keeps
   everything that is genuinely about the landing page (the cover timeline, --p
   / --cp / --py, the dimension-line readout, the count-up, the bar toggle).

   LOAD ORDER MATTERS. Every page loads this file FIRST, before verdure.js /
   app.js / motion.js and before i18n.js — i18n.js calls window.__lmRestore()
   and must find it already defined.

   Everything here is an ENHANCEMENT. Delete this file and every page still
   reads in full: the start states live under html.js-anim (set by an inline
   script in <head>), so no class means no opacity:0 and nothing to un-hide.

   Reduced motion is honoured by jumping to the end state, never by leaving
   something half-animated. */

(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raf = requestAnimationFrame;

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
    /* Splitting text the visitor is WATCHING would flash: it is on screen, then
       hidden behind its own mask, then re-revealed. Still true — but only once
       the element has been revealed. Before .is-in an unrevealed .lm is sitting
       at its .up / .reveal start state at opacity 0, so there is nothing on
       screen to flash and no reason to refuse.

       The viewport test used to stand alone, and it cost every case-study hero
       <h1> its line-mask: those are all above the fold at load, so the very
       first pass refused them and they fell back to .up without a word. Both
       halves of the condition have to hold. */
    const r = el.getBoundingClientRect();
    if (el.classList.contains('is-in') && r.top < innerHeight && r.bottom > 0) return;
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

  /* ── reveal on enter ─────────────────────────────────────────────────────
     One observer drives every kind of entrance: the .up rises, the .scrawl
     draw-on (a scrawl inside a revealed block inherits .is-in from its
     ancestor, a standalone one is observed directly), the line-masks, and the
     four directional primitives from law L3.

     .reveal is the case-study pages' original name for the plain rise; it is in
     this list because motion.js used to run its own observer for it and no
     longer does. One element must never be observed twice — the second observer
     would fight the first for the same .is-in class and, worse, an element
     dropped from BOTH lists would stay at opacity:0 forever. */

  /* .scene has no visual rules of its own. It marks a SECTION whose internal
     entrance timeline should start when the section arrives, rather than on
     load — the cover uses it now that it is the second screen, because an
     entrance nobody is present for is a wasted one. */
  const risers = document.querySelectorAll('.reveal, .up, .scrawl, .lm, .draw, .stamp, .wipe, .deal, .scene');

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
})();
