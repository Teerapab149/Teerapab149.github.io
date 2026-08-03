/* nav.js — the wipe between pages. Loaded by all five pages.

   Clicking through to a case study used to be a white flash: the page you were
   reading vanished and a different one appeared. That flash is where the whole
   sense of one continuous piece of work leaks out. So a panel wipes UP over the
   page you are leaving, the browser navigates behind it, and on the new page
   the same panel keeps travelling in the same direction and uncovers what is
   underneath — one gesture, split across a page load.

   IT MUST DEGRADE TO A PLAIN LINK. Everything here is added on top of anchors
   that already work:
     · no JS            → ordinary navigation, no overlay, no covered page
     · reduced motion   → this file returns immediately
     · slow/failed load → the overlay is fixed-position over a page that is
                          already fully rendered; the browser's own navigation
                          is what actually moves

   The INCOMING half cannot be done from here, because this file runs at the end
   of <body> and the page would flash before it could cover anything. So each
   page carries a one-line inline script in <head> that sets html.nav-in when
   the session flag is present. The panel that covers a fresh page is a ::before
   on <html> — it exists before first paint, which is the only way to win that
   race. See the NAV block in verdure.css / style.css. */

(() => {
  'use strict';

  const root = document.documentElement;
  const KEY = 'nav';

  // The name of where you are going. Derived from the filename rather than the
  // link text, because the chooser cards' text is a whole paragraph.
  const TITLES = {
    'index.html': 'Portfolio',
    '': 'Portfolio',
    'fms-election.html': 'FMS Online Voting System',
    'credit-tracker.html': 'FMS Credit Tracker',
    'psu-chatbot.html': 'PSU Chatbot',
    'megubot.html': 'MeguBot',
  };
  const nameOf = path => TITLES[path.split('/').pop()] || 'Portfolio';

  /* ── arriving ─────────────────────────────────────────────────────────── */
  const clearFlag = () => { try { sessionStorage.removeItem(KEY); } catch { /* private mode */ } };

  if (root.classList.contains('nav-in')) {
    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = nameOf(location.pathname);
    label.setAttribute('aria-hidden', 'true');
    document.body.appendChild(label);

    clearFlag();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add('nav-out');
      setTimeout(() => { root.classList.remove('nav-in', 'nav-out'); label.remove(); }, 620);
    }));
  } else {
    clearFlag();
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  /* ── leaving ──────────────────────────────────────────────────────────── */
  let leaving = false;

  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = '<span class="nav-label"></span>';
  document.body.appendChild(panel);
  const panelLabel = panel.firstChild;

  document.addEventListener('click', e => {
    // let the browser handle every case a browser handles better
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.origin !== location.origin) return;
    if (a.pathname === location.pathname) return;          // same page, or a #hash
    if (leaving) return;

    /* Leaving the Work rail is the one journey this wipe does not cover: the
       panel's picture morphs into the hero image instead, and covering that
       with a panel would hide the only thing worth watching. assets/morph.js
       sets .has-morph, and only in browsers that can actually do it — where it
       cannot, this wipe stays in charge of every link on the page. */
    if (root.classList.contains('has-morph') && a.closest('#work-rail')) return;

    e.preventDefault();
    leaving = true;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* the wipe just does not play on arrival */ }

    panelLabel.textContent = '→ ' + nameOf(a.pathname);
    panel.classList.add('is-in');

    const href = a.href;
    setTimeout(() => { location.href = href; }, 340);
  });

  /* Back-forward cache: the browser can restore this page mid-wipe, panel and
     all. Without this the visitor lands on a dark rectangle with no way out. */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leaving = false;
    panel.classList.remove('is-in');
    root.classList.remove('nav-in', 'nav-out');
  });
})();
