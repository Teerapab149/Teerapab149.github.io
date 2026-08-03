/* inner.js — the picture drifts inside its frame while the frame holds still.

   A framed image that moves as one block is a moving box. An image that lags
   INSIDE a frame that stays put reads as depth: the frame is a window, the
   thing behind it is further away. That is the whole effect.

   SCOPE: .panel__media only, and only the ones that crop.

     · .portrait__frame is NOT handled here. It already has this exact
       parallax, driven by verdure.js as --py off the cover's own progress.
       Two drivers writing the same element would fight, so the change there
       was to move the existing --py from the frame onto the <img> — see the
       PORTRAIT block in verdure.css. Same effect, one owner.

     · .panel--tall is skipped. Its image is `contain`, not `cover` — MeguBot's
       profile card is a logo with padding around it. Drifting it would slide a
       letterboxed picture around inside its own empty margin, which looks like
       a layout bug rather than depth.

     · While the rail is pinned (html.can-pin), the page's vertical scroll is
       being converted into SIDEWAYS travel. A vertical drift there would have
       pictures sliding down while their panels move left. rail.css keeps its
       own horizontal --lag rule above this one for that case; --iy applies to
       the filmstrip below 1000px, where the rail scrolls normally.

   NO IDLE LOOP. There is no permanent requestAnimationFrame running. Scroll and
   resize request a single coalesced frame, and an IntersectionObserver keeps
   the work list to elements actually on screen — off-screen panels cost
   nothing. Scrolled to the bottom of the page with the rail out of view, this
   file does zero work per frame.

   Degrades to nothing: with no JS --iy is never written, the CSS fallback of
   0px applies, and the images simply sit still. */

(() => {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* Half the extra height the image is given in CSS. The image is
     `height: calc(100% + var(--iy-span))`, so it can travel this far in either
     direction before an edge of the frame shows through. Change one, change
     the other — they are the same number, expressed once here and once in
     rail.css. */
  const RANGE = 22;

  const frames = Array.from(document.querySelectorAll('.panel__media'))
    .filter(el => !el.closest('.panel--tall'));
  if (!frames.length) return;

  const live = new Set();
  const last = new WeakMap();
  let queued = false;

  const write = el => {
    const r = el.getBoundingClientRect();
    const vh = innerHeight || 1;

    /* p is +1 when the frame's centre is a full screen below the viewport
       centre and -1 when it is a full screen above, so it falls as the page
       scrolls down. Negating it is what makes the picture lag: the page pulls
       content up, the picture is left behind and slides down the frame. */
    const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
    const iy = -Math.max(-1, Math.min(1, p)) * RANGE;

    /* Sub-pixel churn is invisible but still costs a style recalc on every
       frame for every panel. */
    if (Math.abs((last.get(el) || 0) - iy) < 0.1) return;
    last.set(el, iy);
    el.style.setProperty('--iy', iy.toFixed(2) + 'px');
  };

  const frame = () => { queued = false; live.forEach(write); };
  const request = () => { if (!queued && live.size) { queued = true; requestAnimationFrame(frame); } };

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) live.add(e.target);
      else { live.delete(e.target); e.target.style.removeProperty('--iy'); last.delete(e.target); }
    }
    request();
  }, { rootMargin: '15% 0px' });   // start before the edge, so nothing snaps into place

  frames.forEach(el => io.observe(el));

  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
})();
