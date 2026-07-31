/* Portfolio interactions — vanilla, no dependencies.
   Rule inherited from the project itself: never hide content behind JS.
   Everything here ADDS (galleries, lightbox); nothing is invisible until a
   script runs, except the two galleries which are explicitly script-built
   and would otherwise be 100+ <img> tags of hand-written markup. */

(function () {
  'use strict';

  // ── data ────────────────────────────────────────────────────────────────
  var FAMILIES = {
    '01-original':    'Original',
    '02-gumroad':     'Gumroad',
    '03-studio-dark': 'Studio Dark',
    '04-verdure':     'Verdure',
    '05-blossom':     'Blossom',
    '06-receipt':     'Receipt Paper'
  };

  var PAGES = [
    { file: '1-home',             label: 'Home' },
    { file: '2-candidates',       label: 'Party list' },
    { file: '3-party',            label: 'Party page' },
    { file: '4-vote-multi',       label: 'Ballot · several parties' },
    { file: '5-vote-single',      label: 'Ballot · single party' },
    { file: '6-results-embargo',  label: 'Results · still sealed' },
    { file: '7-results-revealed', label: 'Results · revealed' },
    { file: '8-success',          label: 'Vote cast' },
    { file: '9-closed',           label: 'Polls closed' }
  ];

  var THEMES = [
    '01-original', '02-gumroad', '03-gumroad-cyber', '04-gumroad-retro',
    '05-gumroad-acid', '06-gumroad-premium', '07-gumroad-bubblegum',
    '08-studio-dark', '09-studio-dark-cyber', '10-studio-dark-magenta',
    '11-studio-dark-amber', '12-verdure', '13-verdure-honey', '14-verdure-teal',
    '15-verdure-berry', '16-blossom', '17-blossom-sky', '18-blossom-mint',
    '19-blossom-butter', '20-receipt', '21-receipt-ink-blue', '22-receipt-teal',
    '23-receipt-carbon'
  ];

  var MOBILE = [
    { family: '02-gumroad',     file: '1-home',    label: 'Gumroad · home' },
    { family: '02-gumroad',     file: '2-vote',    label: 'Gumroad · ballot' },
    { family: '04-verdure',     file: '2-vote',    label: 'Verdure · ballot' },
    { family: '06-receipt',     file: '2-vote',    label: 'Receipt · ballot' },
    { family: '03-studio-dark', file: '3-results', label: 'Studio Dark · results' },
    { family: '05-blossom',     file: '3-results', label: 'Blossom · results' },
    { family: '06-receipt',     file: '4-success', label: 'Receipt · vote cast' },
    { family: '01-original',    file: '1-home',    label: 'Original · home' }
  ];

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function shotButton(src, title, meta) {
    var b = el('button', 'shot');
    b.type = 'button';
    b.dataset.full = src;
    b.dataset.cap = title;
    b.innerHTML =
      '<span class="shot__frame"><img loading="lazy" src="' + src + '" alt="' + title + '"></span>' +
      '<span class="shot__cap">' + title + ' <span>' + (meta || '') + '</span></span>';
    return b;
  }

  // ── family gallery (tabs) ───────────────────────────────────────────────
  var familyShots = $('#familyShots');

  function renderFamily(key) {
    if (!familyShots) return;
    familyShots.innerHTML = '';
    PAGES.forEach(function (p) {
      familyShots.appendChild(
        shotButton('assets/img/desktop/' + key + '/' + p.file + '.webp', p.label, FAMILIES[key])
      );
    });
  }

  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      tab.setAttribute('aria-selected', 'true');
      renderFamily(tab.dataset.family);
    });
  });
  renderFamily('01-original');

  // ── theme grid ──────────────────────────────────────────────────────────
  var themeGrid = $('#themeGrid');
  if (themeGrid) {
    THEMES.forEach(function (t) {
      var name = t.replace(/^\d+-/, '');
      themeGrid.appendChild(shotButton('assets/img/themes/' + t + '.webp', name, ''));
    });
  }

  // ── mobile strip ────────────────────────────────────────────────────────
  var strip = $('#phoneStrip');
  if (strip) {
    MOBILE.forEach(function (m) {
      var src = 'assets/img/mobile/' + m.family + '/' + m.file + '.webp';
      var fig = el('figure', 'phone');
      fig.innerHTML =
        '<div class="phone__frame"><img loading="lazy" src="' + src + '" alt="' + m.label + '"></div>' +
        '<p>' + m.label + '<em>scroll inside · click to open</em></p>';
      // the frame scrolls; the caption is the click target for the lightbox, so
      // scrolling a phone never fires it by accident
      fig.querySelector('p').style.cursor = 'zoom-in';
      fig.querySelector('p').dataset.full = src;
      fig.querySelector('p').dataset.cap = m.label;
      strip.appendChild(fig);
    });
  }

  // ── lightbox ────────────────────────────────────────────────────────────
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');

  function openLb(src, cap) {
    lbImg.src = src;
    lbImg.alt = cap || '';
    lbCap.textContent = cap || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-full]');
    if (trigger) { openLb(trigger.dataset.full, trigger.dataset.cap); return; }
    if (e.target === lb || e.target.id === 'lbClose') closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLb();
  });

  // ── nav scroll-spy ──────────────────────────────────────────────────────
  var links = $$('.nav__links a');
  var targets = links
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }
})();
