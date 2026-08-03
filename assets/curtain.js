/* curtain.js — the first thing anyone sees. index.html only.

   A solid ink field with a counter that lifts away and drags the cover up
   behind it. This replaces the FMS ballot diagram that used to hold the first
   screen: that drawing belongs to the election system, so it moved to
   fms-election.html, and the first frame is now the owner's name and face.

   THIS FILE MUST BE INLINE-BLOCKING AT THE TOP OF <body>. The overlay has to
   exist before the first paint, or the page flashes once before being covered
   and the entrance reads as a glitch. It is a separate file only so it can be
   read and reviewed; index.html loads it with a plain <script src> in <body>,
   above everything else.

   IT DOES NOT RUN WHEN ARRIVING FROM A CASE STUDY. nav.js already owns that
   journey with its labelled wipe, and two full-screen covers in a row reads as
   a stutter. The session flag nav.js writes is the signal.

   FAILSAFES, because this thing covers the entire page:
     · --lead defaults to 3600ms in CSS, so the cover's entrance fires even if
       nothing here runs
     · index.html's <head> carries a 4s timer that puts .is-in on the cover
       regardless of this file
     · a CSS keyframe force-hides .loader at 5s
     · the release below is driven by setTimeout, not by the frame loop —
       browsers stop serving animation frames to a backgrounded tab, and a
       counter alone would strand the visitor behind a solid field

   No JS at all: no overlay is ever created, .js-anim is never set, and the
   cover renders finished. */

(() => {
  'use strict';

  const root = document.documentElement;
  if (!root.classList.contains('js-anim')) return;

  /* The entrance handshake: --lead unblocks the CSS, .is-in runs the cover's
     own choreography — which is why .cover no longer carries .scene. This file
     owns that timing now, not the scroll observer.

     The cover is looked up HERE, not at the top of the file. This script runs
     first in <body>, so at parse time the parser has not reached the <section>
     yet and querySelector returns null — caching it there meant the cover
     silently never revealed. */
  const reveal = () => {
    root.style.setProperty('--lead', '0ms');
    const cover = document.querySelector('.cover');
    if (cover) cover.classList.add('is-in');
  };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let arriving = false;
  try { arriving = !!sessionStorage.getItem('nav'); } catch { /* private mode */ }

  if (reduced || arriving) { reveal(); return; }

  /* MIN is the floor the counter needs to be legible at all: on a warm cache
     the real assets are ready in ~50ms, and with no floor the number flashes
     0 → 100 in two frames, which reads as a glitch rather than a load.

     500ms, NOT the 1200 it was until 2026-08-03. The old value was an
     artificial hold kept for tension, and docs/HANDOFF.md §9 records the owner
     rejecting exactly that — "no long loading screens for the sake of looking
     cool". 1200 meant seven tenths of a second in which nothing was being
     waited for. 500 is the shortest hold in which the scrub is still readable
     as a count rather than a flicker: at 0.14 chase per frame the shown value
     needs ~30 frames to converge, which is half a second at 60fps, so anything
     lower would clip the end of the count instead of shortening it.

     MAX is untouched — it is the ceiling for a slow connection, not a hold. */
  const MIN = 500, MAX = 2600;

  const ov = document.createElement('div');
  ov.className = 'loader';
  ov.setAttribute('aria-hidden', 'true');
  const pct = document.createElement('span');
  pct.className = 'loader__pct';
  pct.textContent = '0';
  ov.appendChild(pct);
  document.body.appendChild(ov);

  const t0 = performance.now();
  let ready = false, done = false, shown = 0, last = -1;

  const guard = setTimeout(() => release(false), MAX + 250);

  function release(instant) {
    if (done) return;
    done = true;
    clearTimeout(guard);
    reveal();                       /* the cover starts moving UNDER the field */
    if (instant) {
      ov.classList.add('loader--gone');
      setTimeout(() => ov.remove(), 80);
      return;
    }
    pct.textContent = '100';
    ov.classList.add('loader--out');
    setTimeout(() => ov.remove(), 1700);   /* .18s delay + 1.2s slide + margin */
  }

  /* The counter SCRUBS rather than steps. Two clocks make a target — the
     artificial floor, and a 92% ceiling while the assets are still out, so the
     number visibly waits on something real instead of lying. The shown value
     then chases that target by a fraction each frame, which is what turns a
     stepping readout into a smooth one and hides the moment the assets land. */
  function frame(now) {
    if (done) return;
    const el = now - t0;
    const byTime = Math.min(1, el / MIN);
    const byCeiling = Math.min(1, el / MAX);
    const target = Math.max(Math.min(byTime, ready ? 1 : 0.92), byCeiling);

    shown += (target - shown) * 0.14;
    if (target - shown < 0.004) shown = target;

    const v = Math.round(shown * 100);
    if (v !== last) { pct.textContent = v; last = v; }

    if (shown >= 0.9999) { release(false); return; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* what the counter is actually waiting for: the fonts the name is set in,
     and the one picture the first screen shows */
  const img = new Image();
  img.src = 'assets/img/me/portrait.webp';
  Promise.all([
    img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
    (document.fonts && document.fonts.ready) || Promise.resolve(),
  ]).then(() => { ready = true; });

  ['scroll', 'pointerdown', 'keydown'].forEach(ev => {
    addEventListener(ev, () => { root.classList.add('is-skip'); release(true); },
      { once: true, passive: true });
  });
})();
