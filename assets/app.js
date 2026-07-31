/* Portfolio interactions — vanilla, no dependencies.
   Rule inherited from the project itself: never hide content behind JS.
   Everything here ADDS (galleries, lightbox); nothing is invisible until a
   script runs, except the two galleries which are explicitly script-built
   and would otherwise be 100+ <img> tags of hand-written markup.

   SCROLL REVEALS ARE NOT HERE. assets/reveal.js owns .is-in for every entrance
   class on every page and is loaded before this file; the only observer left
   below is the nav scroll-spy, which watches sections, not revealables. Do not
   add a second reveal observer here — one element observed twice means two
   observers racing for one class. */

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

  // ── live theme demo ─────────────────────────────────────────────────────
  // Six Layer-1 tokens per family, lifted verbatim from the election repo's own
  // palette files (src/utils/*Palettes.js) — NOT sampled off the screenshots, so
  // the demo cannot drift into being "about right". Each family is represented
  // by its base theme, the one shipped as that family's identity.
  var DEMO = {
    '01-original':    { name: 'Original',      bg: '#F8F9FD', surface: '#FFFFFF', ink: '#0F172A', muted: '#5B6478', line: '#E9D5FF', accent: '#8A2680', accentInk: '#FFFFFF', soft: '#FAF5FF' },
    '02-gumroad':     { name: 'Gumroad',       bg: '#FFF6EC', surface: '#FFFDFA', ink: '#26271C', muted: '#5C5A4B', line: '#26271C', accent: '#FF9CE9', accentInk: '#26271C', soft: '#C2F47E' },
    '03-studio-dark': { name: 'Studio Dark',   bg: '#14140F', surface: '#1B1B14', ink: '#F2EDDF', muted: '#B5B0A2', line: '#2E2E22', accent: '#D5FF3F', accentInk: '#14140F', soft: '#232319' },
    '04-verdure':     { name: 'Verdure',       bg: '#F0EBDF', surface: '#FDFBF7', ink: '#1B362B', muted: '#3A5E4D', line: '#E6DFD2', accent: '#722F55', accentInk: '#FDFBF7', soft: '#F0EBDF' },
    '05-blossom':     { name: 'Blossom',       bg: '#FCF9FA', surface: '#FFFFFF', ink: '#2B2028', muted: '#B02E7A', line: '#EDE2E8', accent: '#FF6FBF', accentInk: '#2B2028', soft: '#FFE1F0' },
    '06-receipt':     { name: 'Receipt Paper', bg: '#F7F4EE', surface: '#FDFCF9', ink: '#1C1815', muted: '#6B6155', line: '#E2DCD1', accent: '#1C1815', accentInk: '#FDFCF9', soft: '#F5EDDA' },
  };

  var demo = $('#themeDemo');
  if (demo) {
    var swatches = $('.demo__swatches', demo);
    var demoName = $('#demoName', demo);

    var paint = function (key) {
      var t = DEMO[key]; if (!t) return;
      demo.dataset.theme = key;
      var s = demo.querySelector('.demo__stage').style;
      s.setProperty('--t-bg', t.bg);
      s.setProperty('--t-surface', t.surface);
      s.setProperty('--t-ink', t.ink);
      s.setProperty('--t-muted', t.muted);
      s.setProperty('--t-line', t.line);
      s.setProperty('--t-accent', t.accent);
      s.setProperty('--t-accent-ink', t.accentInk);
      s.setProperty('--t-soft', t.soft);
      if (demoName) demoName.textContent = t.name;
      if (swatches) {
        swatches.innerHTML = ['bg', 'surface', 'ink', 'line', 'accent', 'soft']
          .map(function (k) {
            return '<li><i style="background:' + t[k] + '"></i>' + t[k].toUpperCase() + '</li>';
          }).join('');
      }
      $$('.demo__chip', demo).forEach(function (c) {
        c.classList.toggle('is-on', c.dataset.family === key);
      });
    };

    $$('.demo__chip', demo).forEach(function (c) {
      c.addEventListener('click', function () {
        paint(c.dataset.family);
        // these chips replaced the old .tabs row — one control, not two doing the
        // same job — so they drive the screenshot gallery directly
        renderFamily(c.dataset.family);
      });
    });
    paint('01-original');
  }

  // ── the 23-theme deck ───────────────────────────────────────────────────
  // Name, one-line character and accent hex per theme. The hexes are read out
  // of the election repo's palette files (originalPalettes.js, gumroadPalettes
  // .js, studioDarkPalettes.js, verdurePalettes.js, blossomPalettes.js,
  // receiptPalettes.js) — the same rule the live demo above follows: copied,
  // never sampled off a screenshot. The descriptions are translations of those
  // files' own comments, so a theme cannot end up described as something it is
  // not.
  var DECK = [
    ['Original',            'Original',      '#8A2680', 'SAMO purple on white — the identity the faculty actually runs'],
    ['Gumroad',             'Gumroad',       '#FF9CE9', 'Warm pop: chunky black frames, pink and lime tiles'],
    ['Gumroad Cyber',       'Gumroad',       '#00F0FF', 'Light gray, pitch-black frames, neon cyan and electric violet'],
    ['Gumroad Retro',       'Gumroad',       '#FF9233', 'Y2K arcade: pastel-yellow paper, tangerine and teal'],
    ['Gumroad Acid',        'Gumroad',       '#CCFF00', 'Acid industrial: stark off-white, volt lime, hot coral'],
    ['Gumroad Premium',     'Gumroad',       '#FF4B91', 'Cyber-pop premium: vivid pink with cyber-blue and mint bento'],
    ['Gumroad Bubblegum',   'Gumroad',       '#FF74C4', 'Pink-first pastel pop'],
    ['Studio Dark',         'Studio Dark',   '#D5FF3F', 'A warm dark canvas, hairline rules, one electric lime'],
    ['Studio Dark Cyber',   'Studio Dark',   '#38BDF8', 'Cool blue-blacks with a sky-cyan accent — technical, crisp'],
    ['Studio Dark Magenta', 'Studio Dark',   '#F472B6', 'Plum-tinted blacks, hot magenta — expressive, bold'],
    ['Studio Dark Amber',   'Studio Dark',   '#F59E0B', 'Amber-blacks and molten gold — prestigious, warm'],
    ['Verdure',             'Verdure',       '#722F55', 'Classic premium: deep forest and rich burgundy on ivory'],
    ['Verdure Honey',       'Verdure',       '#A9863F', 'Modern academic: deep navy and muted gold on warm gray'],
    ['Verdure Teal',        'Verdure',       '#AF5232', 'Contemporary: terracotta accent, sage button, pale sand'],
    ['Verdure Berry',       'Verdure',       '#4F46E5', 'Minimal tech: ink black and electric indigo on off-white'],
    ['Blossom',             'Blossom',       '#FF6FBF', 'Soft-pop civic: candy pink on calm blush paper'],
    ['Blossom Sky',         'Blossom',       '#6FB4FF', 'Friendly sky blue'],
    ['Blossom Mint',        'Blossom',       '#5BD6A0', 'Fresh mint green'],
    ['Blossom Butter',      'Blossom',       '#FFC85C', 'Warm butter yellow'],
    ['Receipt Paper',       'Receipt Paper', '#8A2680', 'Everything on screen is something that could be printed'],
    ['Receipt Ink Blue',    'Receipt Paper', '#2E5297', 'Ink-blue print on cool-white office paper'],
    ['Receipt Teal',        'Receipt Paper', '#00657A', 'Teal-navy on carbonless blue copy paper'],
    ['Receipt Carbon',      'Receipt Paper', '#4E463C', 'Warm dark gray on gray copy paper'],
  ];

  var deck = $('#themeDeck');
  if (deck && DECK.length === THEMES.length) {
    var stage = el('div', 'deck__stage');
    stage.tabIndex = 0;
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', 'Theme cards — use the left and right arrow keys');
    var track = el('ul', 'deck__track');

    THEMES.forEach(function (slug, i) {
      var d = DECK[i];
      var src = 'assets/img/themes/' + slug + '.webp';
      // the six base themes are named after their family, so "Blossom · Blossom"
      var cap = d[0] === d[1] ? d[0] : d[0] + ' · ' + d[1];
      var li = el('li', 'deck__item');
      li.style.setProperty('--o', i);
      li.innerHTML =
        '<button type="button" class="deck__card" data-i="' + i + '"' +
        ' data-full="' + src + '" data-cap="' + cap + '">' +
        '<img loading="lazy" src="' + src + '" alt="The home page rendered in the ' + d[0] + ' theme">' +
        '<span class="deck__tag" style="--c:' + d[2] + '">' + d[0] + '</span>' +
        '</button>';
      track.appendChild(li);
    });

    stage.appendChild(track);

    var bar = el('div', 'deck__bar');
    bar.innerHTML =
      '<button type="button" class="deck__nav" data-d="-1" aria-label="Previous theme">&#8249;</button>' +
      '<div class="deck__meta">' +
      '<p class="deck__idx"><b class="deck__swap"><span>01</span></b> / ' + THEMES.length + '</p>' +
      '<h3 class="deck__name deck__swap"><span></span></h3>' +
      '<p class="deck__desc deck__swap"><span></span></p></div>' +
      '<button type="button" class="deck__nav" data-d="1" aria-label="Next theme">&#8250;</button>';

    var rail = el('ol', 'deck__rail');
    DECK.forEach(function (d, i) {
      var li = el('li');
      li.innerHTML = '<button type="button" style="--c:' + d[2] + '" data-i="' + i + '"' +
        ' aria-label="Theme ' + (i + 1) + ', ' + d[0] + '"></button>';
      rail.appendChild(li);
    });

    deck.appendChild(stage);
    deck.appendChild(bar);
    deck.appendChild(rail);

    var items = $$('.deck__item', track);
    var railBtns = $$('button', rail);
    var swaps = $$('.deck__swap', bar);
    var idxEl = $('.deck__idx b span', bar);
    var nameEl = $('.deck__name span', bar);
    var descEl = $('.deck__desc span', bar);
    var navs = $$('.deck__nav', bar);
    var at = -1;

    // re-run the mask animation from the top. Removing the class and reading a
    // layout property in between is what forces the restart; without the read
    // the browser coalesces both changes and nothing plays.
    function replay() {
      swaps.forEach(function (s) {
        s.classList.remove('is-swap');
        void s.offsetWidth;
        s.classList.add('is-swap');
      });
    }

    var N = DECK.length;
    var first = true;      // the opening render should not play the swap

    /* The deck WRAPS. Not for the sake of infinite scrolling — it is so there
       is always a card peeking on both sides, which is what makes it read as a
       deck instead of a lone screenshot with a stray one beside it. Offsets are
       folded into [-11, +11]; the cards that jump the seam are past three deep,
       so they are already hidden when they teleport. */
    function go(i) {
      i = ((i % N) + N) % N;
      if (i === at) return;
      at = i;
      items.forEach(function (li, k) {
        var o = k - i;
        if (o >  N / 2) o -= N;
        if (o < -N / 2) o += N;
        li.style.setProperty('--o', o);
        li.classList.toggle('is-on', o === 0);
        // past three deep a card is invisible anyway; keep it out of the
        // compositor rather than stacking 23 transformed layers
        li.classList.toggle('is-far', Math.abs(o) > 2);
      });
      railBtns.forEach(function (b, k) { b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      idxEl.textContent = String(i + 1).padStart(2, '0');
      nameEl.textContent = DECK[i][0];
      descEl.textContent = DECK[i][3];
      if (first) first = false; else replay();
    }

    navs.forEach(function (b) {
      b.addEventListener('click', function () { go(at + Number(b.dataset.d)); });
    });
    railBtns.forEach(function (b) {
      b.addEventListener('click', function () { go(Number(b.dataset.i)); });
    });

    // a card that is not the active one moves the deck; the active one opens
    track.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('.deck__card') : null;
      if (!card) return;
      var i = Number(card.dataset.i);
      if (i !== at) { go(i); return; }
      openLb(card.dataset.full, card.dataset.cap);
    });

    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(at - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(at + 1); e.preventDefault(); }
    });

    /* Drag. The deck follows the pointer live rather than waiting to find out
       whether the gesture passed a threshold — a carousel that does nothing
       until you let go feels broken on a touchscreen. .6 of the travel, so the
       deck reads as heavy; release always snaps, either to the next card or
       back to this one. */
    var x0 = null;
    var setDrag = function (px) { track.style.setProperty('--drag', px + 'px'); };

    stage.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      x0 = e.clientX;
      track.classList.add('is-drag');
    });
    stage.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      setDrag((e.clientX - x0) * .6);
    });

    var endDrag = function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      track.classList.remove('is-drag');
      setDrag(0);
      if (Math.abs(dx) > 44) go(at - Math.sign(dx));
    };
    // on window, not the stage: a drag that ends past the edge still counts
    addEventListener('pointerup', endDrag);
    addEventListener('pointercancel', function () {
      if (x0 === null) return;
      x0 = null; track.classList.remove('is-drag'); setDrag(0);
    });

    go(0);
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
