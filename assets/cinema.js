/* cinema.js — drives the horizontal rail on index-cinema.html only.
   Loaded after reveal.js / verdure.js / feel.js, which it does not touch.

   The rail is an ordinary horizontally-scrollable filmstrip until this file
   decides pinning is a good idea and adds html.can-pin. It refuses to pin
   when:
     · reduced motion is asked for
     · the viewport is under 1000px — taking over vertical scroll to move
       something sideways on a phone fights the one gesture the device is best
       at, and a swipeable strip is genuinely the better interaction there
     · the track is not actually wider than the screen (nothing to travel)

   When it does pin, the rail's own height is COMPUTED from how far the track
   has to move, so one pixel of scrolling is one pixel of sideways travel. A
   hard-coded 400vh is what makes these things feel either sluggish or twitchy
   depending on the visitor's screen; deriving it means the gearing is the same
   on every monitor. */

(() => {
  'use strict';

  const rail = document.querySelector('.rail');
  const pin = document.querySelector('.rail__pin');
  const track = document.querySelector('.rail__track');
  if (!rail || !pin || !track) return;

  const root = document.documentElement;
  const raf = requestAnimationFrame;
  const clamp01 = n => n < 0 ? 0 : n > 1 ? 1 : n;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const panels = Array.from(track.children);
  const idxEl = document.querySelector('.rail__count b');
  const bar = document.querySelector('.rail__bar');

  let shift = 0;        // how far the track must travel, in px
  let travel = 0;       // how much page scroll that costs
  let pinned = false;

  /* ── decide, and size ─────────────────────────────────────────────────── */
  const measure = () => {
    // read the natural width by neutralising the transform first, or the
    // measurement includes however far we have already dragged it
    track.style.setProperty('--rx', '0px');

    const canPin = !reduced && innerWidth >= 1000;
    const overflow = track.scrollWidth - pin.clientWidth;

    if (!canPin || overflow <= 40) {
      if (pinned) { root.classList.remove('can-pin'); rail.style.removeProperty('--rail-h'); pinned = false; }
      shift = travel = 0;
      panels.forEach(p => { p.style.removeProperty('--near'); p.style.removeProperty('--lag'); });
      return;
    }

    root.classList.add('can-pin');
    pinned = true;
    shift = overflow;
    // one px of scroll per px of travel, plus a screen at each end so the rail
    // arrives and leaves rather than snapping in mid-move
    travel = shift;
    rail.style.setProperty('--rail-h', (travel + innerHeight) + 'px');
  };

  /* ── drive ────────────────────────────────────────────────────────────── */
  const draw = () => {
    if (!pinned) return;
    const r = rail.getBoundingClientRect();
    const p = travel > 0 ? clamp01(-r.top / travel) : 0;

    track.style.setProperty('--rx', (-shift * p).toFixed(1) + 'px');
    rail.style.setProperty('--rp', p.toFixed(4));

    /* Which panel is centred, and how close each one is to being it. --near
       runs 1 at centre to 0 a full panel away; CSS spends it on opacity and
       scale so the rail has a focus instead of four equal cards. --lag is the
       signed version, which the image inside uses to travel the other way. */
    const mid = pin.getBoundingClientRect().left + pin.clientWidth / 2;
    let best = 0, bestD = Infinity;
    panels.forEach((el, i) => {
      const pr = el.getBoundingClientRect();
      const d = (pr.left + pr.width / 2 - mid) / pr.width;   // in panel-widths
      el.style.setProperty('--near', Math.max(0, 1 - Math.abs(d)).toFixed(3));
      el.style.setProperty('--lag', Math.max(-1.5, Math.min(1.5, d)).toFixed(3));
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
    });

    if (idxEl) {
      const n = String(best + 1).padStart(2, '0');
      if (idxEl.textContent !== n) idxEl.textContent = n;
    }
  };

  let queued = false;
  const request = () => { if (!queued) { queued = true; raf(() => { draw(); queued = false; }); } };

  /* Re-measure on resize only — and re-measure BEFORE drawing, because the
     track width and the rail height both change with the viewport and drawing
     against stale numbers puts the panels somewhere they are not. */
  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { measure(); draw(); }, 150);
  }, { passive: true });

  addEventListener('scroll', request, { passive: true });

  // fonts change the panel text height, which can change the track width
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); draw(); });

  measure();
  draw();

  /* Keyboard and anchor links still have to be able to reach a panel. When the
     rail is pinned a panel is not scrollable-to in the normal way, so translate
     "show me panel N" into "scroll the page to where N is centred". */
  const goTo = i => {
    if (!pinned) { panels[i].scrollIntoView({ block: 'nearest', inline: 'center' }); return; }
    const per = shift / Math.max(1, panels.length - 1);
    scrollTo({ top: rail.offsetTop + per * i, behavior: reduced ? 'auto' : 'smooth' });
  };
  document.querySelectorAll('[data-rail-to]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); goTo(Number(a.dataset.railTo)); });
  });
})();
