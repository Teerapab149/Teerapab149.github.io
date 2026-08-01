/* feel.js — the two things that make a page feel alive between the reveals.
   Loaded by all five pages, after reveal.js.

   The diagnosis this file answers: everything else on this site plays ONCE when
   an element crosses a threshold and then stops dead. A page built entirely out
   of one-shot entrances is static 95% of the time you are looking at it. What
   the reference sites do differently is keep something bound to the scroll and
   to the pointer the whole way down.

   Two mechanisms, both additive:

     1. CURSOR — a dot that tracks exactly and a ring that lags behind it, plus
        a magnetic pull on the things you can actually click.
     2. DRIFT  — every framed image travels at a slightly different rate from
        the page, continuously, for as long as it is on screen.

   EVERYTHING HERE IS OPTIONAL BY CONSTRUCTION:
     · pointer: coarse (phones, tablets) → the cursor half never initialises
     · prefers-reduced-motion → this whole file returns before doing anything
     · no JS → nothing exists; the cursor is the OS one and images sit still
   Nothing is hidden, nothing moves layout, and no element depends on it. */

(() => {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const raf = requestAnimationFrame;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── 1 · the cursor ──────────────────────────────────────────────────────
     Only on a device with a real pointer. `pointer: fine` is the right query
     rather than a touch sniff: it asks whether the input can hit a small
     target, which is exactly the thing a 6px dot needs. */

  const fine = matchMedia('(pointer: fine)').matches;

  if (fine) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cur cur--dot';
    ring.className = 'cur cur--ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    let mx = innerWidth / 2, my = innerHeight / 2;   // where the pointer is
    let rx = mx, ry = my;                            // where the ring has got to
    let shown = false;

    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; document.documentElement.classList.add('has-cur'); }
    }, { passive: true });

    // leaving the window should take the cursor with it, or it hangs at the edge
    addEventListener('pointerleave', () => document.documentElement.classList.remove('has-cur'));
    addEventListener('pointerenter', () => { if (shown) document.documentElement.classList.add('has-cur'); });

    /* The ring lags. That lag is the whole effect — a ring that tracks exactly
       is just a second cursor, and .16 is slow enough to read as weight without
       ever feeling like the page is behind you. */
    const follow = () => {
      rx = lerp(rx, mx, .16);
      ry = lerp(ry, my, .16);
      dot.style.transform  = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf(follow);
    };
    raf(follow);

    /* Hover state is delegated, so it keeps working for the galleries and the
       theme deck, which app.js builds after this file has run. */
    const HOT = 'a, button, [role="button"], .pick__card, .deck__card, .shot, summary';
    document.addEventListener('pointerover', e => {
      if (e.target.closest && e.target.closest(HOT)) document.documentElement.classList.add('cur-hot');
    }, { passive: true });
    document.addEventListener('pointerout', e => {
      if (e.target.closest && e.target.closest(HOT) &&
          !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOT)))
        document.documentElement.classList.remove('cur-hot');
    }, { passive: true });

    /* ── magnetic pull ─────────────────────────────────────────────────────
       Small controls lean toward the pointer as it approaches. Kept to buttons
       and nav arrows: a magnetic paragraph is a party trick, a magnetic button
       genuinely helps you land on it. Uses `translate`, not `transform`, so the
       hover lifts already on these elements keep working. */
    const magnets = Array.from(document.querySelectorAll('.btn, .deck__nav, .lang__btn, .cover__cue'));
    if (magnets.length) {
      let ticking = false;
      addEventListener('pointermove', () => {
        if (ticking) return;
        ticking = true;
        raf(() => {
          magnets.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.bottom < -200 || r.top > innerHeight + 200) return;   // off screen, skip the maths
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            const dx = mx - cx, dy = my - cy;
            const reach = Math.max(r.width, r.height) * .9 + 40;
            const d = Math.hypot(dx, dy);
            if (d < reach) {
              const pull = (1 - d / reach) * .32;
              el.style.translate = `${(dx * pull).toFixed(1)}px ${(dy * pull).toFixed(1)}px`;
            } else if (el.style.translate) {
              el.style.translate = '';
            }
          });
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ── 2 · drift ───────────────────────────────────────────────────────────
     Framed media travels at a slightly different rate from the page, the whole
     time it is on screen, so the page has depth rather than being one flat
     sheet that scrolls.

     It moves the FIGURE, not the image inside it. Translating the image would
     need every frame to have a fixed aspect and object-fit: cover, and .shot
     deliberately does not — a screenshot cropped to fit a frame is a worse
     screenshot. Moving the whole figure a few px needs no cropping, exposes no
     edge, and cannot open a gap.

     ±10px, which is felt and not seen. Anything larger starts colliding with
     the caption that overlaps .shot's lower edge.

     Writes `translate`, leaving `transform` to the hover scale already on these
     elements, and skips anything off screen. */

  const floaters = Array.from(document.querySelectorAll(
    '.shot, .capsule, .hero__shot, figure.figure'
  ));

  if (floaters.length) {
    let pending = false;
    const place = () => {
      const vh = innerHeight;
      floaters.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) return;
        // -1 as it enters from the bottom of the screen, +1 as it leaves the top
        const p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        el.style.translate = `0 ${(p * -10).toFixed(1)}px`;
      });
      pending = false;
    };
    const request = () => { if (!pending) { pending = true; raf(place); } };

    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request, { passive: true });
    place();
  }
})();
