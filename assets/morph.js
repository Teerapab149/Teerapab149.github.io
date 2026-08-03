/* morph.js — the rail panel becomes the case study's hero image.

   Click a project in the Work rail and its picture does not disappear and get
   replaced. It travels: the cropped panel frame grows into the hero shot on the
   page you are arriving at, while the two backgrounds cross-fade under it. One
   object, one continuous move, across a page load.

   WHY THERE IS NO startViewTransition() HERE. That function is same-document
   only — it snapshots the page, runs your callback, snapshots again, tweens
   between the two. A navigation destroys the document, so there is no second
   snapshot for it to take. Morphing ACROSS pages is a different mechanism:
   the CSS `@view-transition { navigation: auto }` rule in verdure.css and
   style.css opts both documents in, the browser holds the old page's pixels
   through the load itself, and the two `pageswap` / `pagereveal` events below
   are the only places JS gets a word in. Everything here is bookkeeping around
   those two moments.

   WHAT THIS FILE ACTUALLY DOES, given the browser does the animating:
     1. remembers which panel was clicked
     2. `pageswap`   — names that panel's frame on the way out
     3. `pagereveal` — names the hero image on the way in, so the browser has a
                       pair to match, and forces the hero's own reveal open
                       first, because otherwise it is snapshotted mid-wipe and
                       the panel morphs into an empty rectangle

   IT ONLY TOUCHES RAIL LINKS. `navigation: auto` opts in every same-origin
   navigation, which would have quietly replaced the labelled wipe in nav.js
   everywhere on the site. So any navigation that did not start in the rail gets
   skipTransition() below and keeps the wipe it already had.

   FALLBACK. A browser without cross-document view transitions never fires
   pageswap, so none of this runs, `navigation: auto` is an unknown at-rule it
   drops, and nav.js does what it has always done. Reduced motion skips the
   transition outright. No JS at all is still an ordinary link. */

(() => {
  'use strict';

  const root = document.documentElement;

  /* `onpageswap in window` is the honest test. document.startViewTransition
     exists in browsers that only do the same-document kind, so checking for it
     would claim support we do not have. */
  if (!('onpageswap' in window)) return;

  /* nav.js reads this to know it should keep its hands off rail links. */
  root.classList.add('has-morph');

  const NAME = 'work-media';
  const KEY = 'morph';                        // survives the document swap
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const store = v => { try { sessionStorage.setItem(KEY, v); } catch { /* private mode: no morph, still navigates */ } };
  const take = () => {
    try { const v = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); return v; }
    catch { return null; }
  };

  /* ── outgoing ─────────────────────────────────────────────────────────── */

  /* Which panel is leaving. Recorded on click rather than worked out in
     pageswap, because by then the anchor is not in the event any more. */
  let from = null;

  document.addEventListener('click', e => {
    /* Cleared on EVERY click, not just rail ones. A click that records a panel
       and then does not navigate — the visitor hits Escape, or something calls
       preventDefault — would otherwise leave that panel armed, and the next
       navigation from anywhere on the page would morph a picture the visitor
       is not looking at. */
    from = null;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('#work-rail a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.origin !== location.origin || a.pathname === location.pathname) return;
    from = a.closest('.panel');
  }, true);

  addEventListener('pageswap', e => {
    const vt = e.viewTransition;
    if (!vt) return;                          // browser decided against one

    const panel = from;
    from = null;
    const frame = panel && panel.querySelector('.panel__media');

    /* Not a rail departure — hand the navigation back to nav.js's wipe. */
    if (!frame || reduced.matches) { vt.skipTransition(); return; }

    frame.style.viewTransitionName = NAME;

    /* The panel's own reveal clips this image (.unveil, rail.css). Click a
       panel while it is still resolving and the browser would snapshot a
       part-open clip and morph a sliver. Force it open with no transition, the
       mirror of what pagereveal does to the arriving hero. */
    frame.classList.add('vt-open');

    /* Panel 04 is a logo card, letterboxed rather than cropped. The other three
       are screenshots that fill their frame. The arriving page cannot see which
       it was, so send it along. */
    store(panel.classList.contains('panel--tall') ? 'contain' : 'cover');

    /* The old document is frozen, not discarded, until the transition ends — if
       the visitor comes back via bfcache this name would still be sitting on
       the element and would collide with a later one. */
    vt.finished.then(() => {
      frame.style.viewTransitionName = '';
      frame.classList.remove('vt-open');
    });
  });

  /* ── incoming ─────────────────────────────────────────────────────────── */

  addEventListener('pagereveal', e => {
    const fit = take();
    const vt = e.viewTransition;
    if (!vt) return;
    if (!fit || reduced.matches) { vt.skipTransition(); return; }

    /* Three case studies wrap the hero shot in .hero__shot; megubot uses the
       generic .figure because its hero is a captioned portrait. Name the IMG in
       both, not the figure — matching the caption box into a cropped panel
       frame would morph the box, then pop the caption in at the end. */
    const hero = document.querySelector('.hero .hero__shot img, .hero .figure img');
    if (!hero) { vt.skipTransition(); return; }

    /* The hero carries .wipe: under .js-anim it starts clipped to nothing and
       opens when reveal.js sees it. The snapshot is taken before any of that
       runs, so without this the panel morphs into a blank box.

       .is-in alone is NOT enough, which is not obvious: it opens the clip
       through a --t4 transition, so at the moment the browser captures, the
       computed clip is still inset(0 0 100%). Measured, not assumed — .is-in on
       its own leaves it shut. .vt-open opens it with no transition at all,
       and .is-in goes on too so reveal.js does not wipe it a second time when
       its observer catches up. */
    const wipe = hero.closest('.wipe');
    if (wipe) wipe.classList.add('is-in', 'vt-open');

    root.style.setProperty('--vt-fit', fit);
    hero.style.viewTransitionName = NAME;

    vt.finished.then(() => {
      hero.style.viewTransitionName = '';
      root.style.removeProperty('--vt-fit');
      /* Safe to drop: .is-in is still on, and it says open too, so nothing
         moves. This just leaves the DOM the way reveal.js would have. */
      if (wipe) wipe.classList.remove('vt-open');
    });
  });
})();
