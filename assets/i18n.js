/* i18n.js — Thai for the landing page. English lives in index.html itself.

   WHY IT IS BUILT THIS WAY
   The project rule is that nothing may be hidden behind JS: if this file never
   loads, the page must still read completely. So English is the real content in
   the markup, and Thai is applied over it on request. That also means the page
   is never blank while a dictionary loads, and search engines index real text.

   WHY SELECTORS AND NOT data-* ATTRIBUTES
   The obvious alternative is data-th="…" on every element. It was rejected on
   purpose: it would put a second full copy of the page's prose inside the markup
   and double the size of every line you have to read while editing layout. Here
   the whole Thai version is one file you can read top to bottom, and index.html
   stays untouched.

   THE COST, STATED PLAINLY: these selectors are positional. Reorder the facts in
   the cover, add a project, or rename a class, and the matching line here goes
   silently stale. If you change the landing page, re-run the check at the bottom
   of this file (window.__i18nCheck()) — it lists every selector that no longer
   matches anything.

   Thai sentences do not end in a full stop; that is the house rule for Thai in
   this repo, and it applies to the site copy too.

   THE EYEBROW NUMBERS RUN 01–08 IN DOM ORDER, not in the order they appear in
   this file. The Thai strings here are keyed by selector, so their order on the
   page is set by index.html: cover 01 · method 02 · pick 03 · rail 04 · roles 05
   · skills 06 · background 07 · contact 08. Move a section and BOTH files have
   to be renumbered together, or one language will contradict the other. */

(() => {
  'use strict';

  const TH = {
    /* ── top bar ─────────────────────────────────────────────────────────── */
    '.bar a[href="#work"]': 'ผลงาน',
    '.bar a[href="#contact"]': 'ติดต่อ',

    /* ── cover ───────────────────────────────────────────────────────────── */
    '.cover .tag.rise': '01 — เกี่ยวกับผม',
    /* YEARS ARE CE THROUGHOUT THIS FILE, NOT BE — settled 2026-08-03.
       It used to mix the two: "ตั้งแต่ปี 2023" and "คาดว่าจบปี 2027" a few lines
       above "16 พ.ย. 2569", which is the same year written two ways within one
       screen. A Thai reader hitting "จบปี 2027" and then "ฝึกงาน 2569" has to
       stop and work out which comes first, and it happened on the single most
       important fact on the page. CE also means the Thai and the English never
       drift apart when a date is edited, and the owner has said repeatedly he
       does not want the page to read as officialese.
       THE TWO EXCEPTIONS ARE DELIBERATE: "ภาคเรียน 2/2568" and
       "ประจำปีการศึกษา 2569" stay BE because they are the registrar's own names
       for that term and that academic year, not dates. */
    '.cover__seek b': 'ฝึกงานสหกิจศึกษา · 16 พ.ย. 2026 – 7 มี.ค. 2027',
    '.cover__seek span': 'System Analyst · Business Analyst · Management Trainee',
    '.cover__lede': '<strong>นักศึกษาสาขาระบบสารสนเทศทางธุรกิจ</strong> คณะวิทยาการจัดการ ' +
      'มหาวิทยาลัยสงขลานครินทร์ · ถัดจากนี้คือสี่ระบบ และสิ่งที่ผมลงมือทำในแต่ละระบบ',
    '.bio > div:nth-child(1) dt': 'กำลังเรียน',
    '.bio > div:nth-child(1) dd': '<strong>บริหารธุรกิจบัณฑิต สาขาระบบสารสนเทศทางธุรกิจ</strong>',
    '.bio > div:nth-child(2) dt': 'มหาวิทยาลัย',
    '.bio > div:nth-child(2) dd': 'มหาวิทยาลัยสงขลานครินทร์ · หาดใหญ่ ตั้งแต่ปี 2023',
    '.bio > div:nth-child(3) dt': 'จบการศึกษา',
    '.bio > div:nth-child(3) dd': 'คาดว่าปี 2027 · GPAX 3.03',
    '.bio > div:nth-child(4) dt': 'กำลังมองหา',
    '.bio > div:nth-child(4) dd': '<strong>ฝึกงานสหกิจศึกษา · 16 พ.ย. 2026 – 7 มี.ค. 2027</strong>' +
      '<br>System Analyst · Business Analyst · Management Trainee',
    '.cover__cue': 'เลื่อนลงไปดูผลงาน',

    /* ── chooser ─────────────────────────────────────────────────────────── */
    '#pick .tag': '03 — อยากเริ่มดูตรงไหน',
    '#pick h2': 'เลือกงานที่คุณสนใจ<br>— หรือเลื่อนดูไปเรื่อย ๆ ก็ได้',
    '.pick__card:nth-child(1) .pick__d': 'ระบบเลือกตั้งที่คณะใช้งานจริง ผู้มีสิทธิ์ 3,119 คน',
    '.pick__card:nth-child(1) .pick__role': 'System Analyst · Developer · UI/UX',
    '.pick__card:nth-child(1) .pick__live': 'ใช้งานจริง',
    '.pick__card:nth-child(2) .pick__d': 'อ่านทรานสคริปต์จากไฟล์ PDF แล้วบอกว่ายังขาดหน่วยกิตอะไร',
    '.pick__card:nth-child(2) .pick__role': 'System Analyst · Full-stack · UI/UX',
    /* อดีตกาล และต้องเป็นอดีตกาลต่อไป — subscription ของ Azure ที่จ่ายค่า VM หมดอายุ
       และ URL หายไปด้วย · `psu-chatbot.html` เขียนไว้ตรง ๆ แล้ว ถ้าหน้าแรกยังบอกว่ายังรันอยู่
       เว็บจะขัดกันเอง */
    '.pick__card:nth-child(3) .pick__d': 'แชตบอตตอบคำถามนักศึกษาบน Azure ที่ deploy ขึ้นใช้จริง ' +
      'และรันตลอด 24 ชม. ตลอดทั้งเทอมของรายวิชา',
    '.pick__card:nth-child(3) .pick__role': 'System Analyst · Cloud · Front-end',
    '.pick__card:nth-child(4) .pick__d': 'บอต Discord ที่เพื่อน ๆ ใช้ทุกวัน — ผมออกแบบ คนอื่นเขียนโค้ด',
    '.pick__card:nth-child(4) .pick__role': 'ออกแบบและวิเคราะห์เท่านั้น',
    '.pick__skip': 'ยังไม่แน่ใจ? เลื่อนต่อได้เลย — หน้านี้อ่านจากบนลงล่างได้ทั้งหน้า ' +
      'และ<a href="#contact">ช่องทางติดต่อ</a>อยู่ท้ายสุดอยู่แล้ว',

    /* ── hero ────────────────────────────────────────────────────────────── */
    '.hero__type .tag--honey': 'ฝึกงานสหกิจศึกษา · 16 พ.ย. 2026 – 7 มี.ค. 2027',
    /* The biggest line on the page, and it was missing from this file until the
       Thai read-through of 2026-08-03 found it — the same blind spot that hid
       the rail head, and the reason __i18nCheck() is not the translation gate.
       The <svg class="scrawl"> inside .mark-wrap is dropped, exactly as #roles
       and #contact already drop theirs: the scrawl is drawn to the length of
       the English phrase, and a Thai phrase of another width wears it badly.
       The highlight itself stays, so the emphasis survives the switch. */
    '.hero__type h2': 'ผมออกแบบระบบ<br>ที่มี<span class="mark-wrap">คนใช้จริง</span>',
    '.hero__side .tag': 'สี่โปรเจค · เส้นเรื่องเดียวกัน',
    /* nth-of-type counts every <p>, and the first one here is the .tag — so the
       two body paragraphs are 2 and 3, not 1 and 2. The check at the bottom of
       this file caught that.
       The Thai for paragraph 2 lost its closing clause on 2026-08-03 with the
       English: "ส่วนโปรเจคที่สี่ผมทำแค่ครึ่งแรก … แล้วส่งต่อให้คนเขียนโค้ด" was the third
       of four sightings of that point inside five screens · what survives here
       is the sentence CLAUDE.md rule 8 names as the source of the four stages
       in #method, so do not trim it further */
    '.hero__side p.small:nth-of-type(2)': 'สามโปรเจคแรกผมทำครบทั้งวงจร ตั้งแต่นั่งเก็บ requirement กับผู้ใช้ ' +
      'ออกแบบ ER diagram และ business flow ไปจนถึงเขียนโค้ด ทำ UI และ deploy เอง',
    '.hero__side p.small:nth-of-type(3)': 'การเขียนโค้ดเป็นเครื่องมือที่ทำให้ผมออกแบบระบบได้แม่นขึ้น ' +
      '<strong>ไม่ใช่ปลายทางที่ผมอยากไป</strong>',
    '.stats-inline > div:nth-child(1) span': 'ผู้มีสิทธิ์ในระบบที่ใช้งานจริง',
    '.stats-inline > div:nth-child(2) span': 'ผู้ใช้สิทธิ์จริง',
    '.stats-inline > div:nth-child(3) span': 'ระบบที่ทำเองครบวงจร',

    /* ── method · how he works ───────────────────────────────────────────────
       The stage NAMES stay in English, the same rule the ballot diagram used
       before it moved to fms-election.html: they are labels on a drawing, and
       four one-word English labels read as a diagram in either language. Only
       the captions turn. */
    '.method .tag': '02 — ผมทำงานยังไง',
    '.flow li:nth-of-type(1) span': 'นั่งคุยกับคนที่จะใช้จริง ก่อนจะขีดอะไรลงไป',
    '.flow li:nth-of-type(2) span': 'use case, business rule, ER diagram',
    '.flow li:nth-of-type(3) span': 'โค้ดกับหน้าจอ ออกแบบจากมือถือก่อน',
    '.flow li:nth-of-type(4) span': 'ขึ้นระบบจริง แล้วมีคนใช้จริง',
    '.flow__note': 'สามในสี่โปรเจกต์ที่นี่ ผมทำเองครบทั้งสี่ขั้น ' +
      'ส่วน MeguBot ผมหยุดที่ขั้นที่สองแล้วส่งแบบให้เพื่อนเขียนต่อ — ซึ่งคืองานที่ผมกำลังสมัคร',
    '.method__line': 'ผมเขียนแบบระบบ<br>ก่อนลงมือสร้าง',

    /* ── the tally ─────────────────────────────────────────────────────────
       Two items since 2026-08-03, not four: 3,119 and 1,643 were cut from the
       markup because the reader has met them three times before reaching this
       screen. The two that remain were nth-child(3) and (4) — if you restore
       the cut pair, these two lines have to shift back down or the captions
       will land on the wrong numbers, silently. */
    '.tally .tag': 'หน้าเว็บที่คุณเพิ่งย่อขยาย',
    '.tally__i:nth-child(1) span': 'commit ตลอดเจ็ดเดือน',
    '.tally__i:nth-child(2) span': 'ธีม สลับได้จากหน้า admin',
    '.tally .big': 'คนเดียวทำทั้งการวิเคราะห์<br>การออกแบบ และการเขียนโค้ด',

    /* ── the work rail ─────────────────────────────────────────────────────
       "ผลงาน" is the same word the top bar already uses for the Work link, so
       the eyebrow and the nav agree instead of offering two names for one
       section.

       .rail__count is NOT registered here, and must not be. It reads "01 / 04" —
       digits and a slash, nothing to translate — and rail.js caches the inner
       <b> once at load (`const idxEl = …('.rail__count b')`, line 33) and writes
       the centred panel's number into it on every scroll frame. Writing
       innerHTML over the parent would replace that <b> with a fresh node, and
       rail.js would spend the rest of the session updating an element that is no
       longer in the document — the counter freezes at whatever it last said.

       The hint names the axis rather than the payoff: the surprising thing about
       this section is that it moves sideways at all, and "ไปด้านข้าง" is the
       part a visitor cannot guess. It covers both gestures, as the English does,
       because on a laptop there is nothing to swipe. */
    '.rail__head .tag': '04 — ผลงาน',
    '.rail__hint': 'ปัดหรือเลื่อนแถวนี้ไปด้านข้าง',

    /* ── project 01 ──────────────────────────────────────────────────────── */
    '.grow__over .tag': 'ระบบใช้งานจริง · โปรเจค 01',
    '.grow__note': 'ไม่ใช่ภาพหน้าจอ — หน้านี้ถูกสร้างใหม่ด้วย HTML ล้วน และหักที่ breakpoint จริงของระบบ',
    /* The captions the growing window writes about itself. Exactly one is lit at
       a time by a @container rule keyed on data-a, so each needs its own line
       here — and the selector must carry the data-a, not a positional index, or
       a reordered label would silently take another one's caption. Writing
       innerHTML replaces only the children, so the attribute the container
       query reads survives untouched.
       The numbers stay Arabic and unlabelled because they are breakpoints, the
       same reason sm/md/lg/xl beside them stay English. */
    '.anno__t[data-a="1"]': 'เมนูแฮมเบอร์เกอร์ · คอลัมน์เดียว',
    '.anno__t[data-a="2"]': 'เกิน 640 · ปุ่มเข้าสู่ระบบเลิกกินความกว้างเต็มแถว',
    '.anno__t[data-a="3"]': 'เกิน 768 · โลโก้กับโปสเตอร์ขยับขึ้นมาใหญ่ขึ้น',
    '.anno__t[data-a="4"]': 'เกิน 1024 · เมนูโผล่ออกมา · คอลัมน์เดียวกลายเป็นสอง',
    '.anno__t[data-a="5"]': 'เกิน 1280 · ขนาดตัวอักษรทั้งชุดขยับขึ้นอีกขั้น',
    '.rail__track > li:nth-of-type(1) > .panel__body > .tag': 'ใช้งานจริง · ธ.ค. 2025 – ปัจจุบัน',
    '.rail__track > li:nth-of-type(1) .tag--honey': 'System Analyst · Core Developer · UI/UX',
    '.rail__track > li:nth-of-type(1) .small': 'ระบบเลือกตั้งสโมสรนักศึกษา คณะวิทยาการจัดการ ม.อ. ที่ผมทำคนเดียวทั้งระบบ ' +
      'โจทย์ที่ยากไม่ใช่การทำให้เว็บกดโหวตได้ แต่คือทำให้ผลคะแนน<strong>พิสูจน์ได้ว่าไม่ถูกแก้</strong> ' +
      'ขณะที่<strong>ไม่มีใครสืบได้ว่าใครเลือกพรรคไหน</strong> · ปิดหีบโดยมี<strong>เคสลงคะแนนซ้ำเป็นศูนย์</strong>',
    '.rail__track > li:nth-of-type(1) .facts > div:nth-child(1) span': 'ผู้มีสิทธิ์ นำเข้าผ่าน API ของมหาวิทยาลัย',
    '.rail__track > li:nth-of-type(1) .facts > div:nth-child(2) span': 'ผู้ใช้สิทธิ์จริง',
    '.rail__track > li:nth-of-type(1) .facts > div:nth-child(3) span': 'commits ใน 7 เดือน',
    '.rail__track > li:nth-of-type(1) .facts > div:nth-child(4) span': 'ธีม สลับได้จากหน้า admin',

    /* ── project 02 ──────────────────────────────────────────────────────── */
    '.rail__track > li:nth-of-type(2) > .panel__body > .tag': 'รายวิชา 477-303 BISA&amp;D · ภาคเรียน 2/2568',
    '.rail__track > li:nth-of-type(2) .tag--honey': 'System Analyst · Full-stack Developer · UI/UX',
    '.rail__track > li:nth-of-type(2) .small': 'นักศึกษาอัปโหลดใบเกรดกับใบลงทะเบียนเป็น PDF ' +
      'แล้วระบบ<strong>อ่านข้อความออกมาเทียบกับโครงสร้างหลักสูตรให้เอง</strong> ' +
      'ว่าหมวดไหนครบแล้ว หมวดไหนยังขาด',
    '.rail__track > li:nth-of-type(2) .facts > div:nth-child(1) span': 'API routes',
    '.rail__track > li:nth-of-type(2) .facts > div:nth-child(2) span': 'ตารางฐานข้อมูล',
    '.rail__track > li:nth-of-type(2) .facts > div:nth-child(3) span': 'หน้าจอฝั่งนักศึกษา + admin',
    '.rail__track > li:nth-of-type(2) .facts > div:nth-child(4) span': 'บรรทัด TypeScript',

    /* ── project 03 ──────────────────────────────────────────────────────── */
    '.rail__track > li:nth-of-type(3) > .panel__body > .tag': 'รายวิชา 477-302 Cloud Computing Platform · ต.ค. 2025',
    '.rail__track > li:nth-of-type(3) .tag--honey': 'System Analyst · Cloud Developer · Front-end',
    '.rail__track > li:nth-of-type(3) .small': 'แชตบอตตอบคำถามนักศึกษา สร้างบน Azure Bot Service ต่อกับ Language Studio ' +
      'แล้วฝังลงหน้าเว็บผ่าน Direct Line API โดยมี Node.js คั่นกลางแลก secret key เป็น token ' +
      '<strong>เพื่อไม่ให้ key หลุดไปอยู่ฝั่ง frontend</strong>',
    '.rail__track > li:nth-of-type(3) .facts > div:nth-child(1) span': 'Bot Service + Language Studio',
    '.rail__track > li:nth-of-type(3) .facts > div:nth-child(2) span': 'อยู่บน Azure VM (Ubuntu) ตลอดทั้งเทอม',
    '.rail__track > li:nth-of-type(3) .facts > div:nth-child(3) span': 'Nginx + Certbot + pm2',
    '.rail__track > li:nth-of-type(3) .facts > div:nth-child(4) span': 'คนในทีม ส่วนระบบผมทำเอง',

    /* ── project 04 ──────────────────────────────────────────────────────── */
    '.rail__track > li:nth-of-type(4) > .panel__body > .tag': 'โปรเจคส่วนตัวกับเพื่อน · ยังทำอยู่',
    '.rail__track > li:nth-of-type(4) .tag--honey': 'System Analyst · เจ้าของฟีเจอร์ · ไม่ได้เป็นคนเขียนโค้ด',
    '.rail__track > li:nth-of-type(4) .small': 'บอตสารพัดประโยชน์ที่เซิร์ฟเวอร์ Discord ของพวกเราใช้กันทุกวัน ' +
      '<strong>ผมออกแบบระบบและฟีเจอร์ เพื่อนเป็นคนเขียนโค้ด</strong> ' +
      'เป็นโปรเจคที่ใกล้เคียงกับงานที่ผมสมัครมากที่สุด',
    /* The only panel whose <b> figures are words instead of numbers, so it is
       the only one whose <b> needs translating at all. Panel 03 leaves Azure
       and HTTPS alone on purpose — those are names of things; Design, Code and
       Daily are just English. 24/7 is left out for the same reason the other
       panels' figures are: it is a number. */
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(1) b': 'ออกแบบ',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(2) b': 'โค้ด',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(4) b': 'ทุกวัน',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(1) span': 'ระบบและฟีเจอร์ ผมออกแบบเอง',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(2) span': 'เพื่อนเขียน ไม่ใช่ผม',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(3) span': 'ย้ายจากโน้ตบุ๊กขึ้นคลาวด์',
    '.rail__track > li:nth-of-type(4) .facts > div:nth-child(4) span': 'ใช้จริงทุกวัน ไม่ใช่เดโม',

    /* ── buttons that repeat ─────────────────────────────────────────────── */
    '.btn[href="fms-election.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="credit-tracker.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="psu-chatbot.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="megubot.html"]': 'อ่านรายละเอียดโปรเจค',

    /* ── roles ───────────────────────────────────────────────────────────── */
    '#roles > .inner > .tag': '05 — งานที่ผมมองหา',
    '#roles h2': 'ผมอยากอยู่ตรงกลาง<br>ระหว่างคนใช้งานกับ<span class="mark-wrap">ระบบ</span>',
    /* THE LABELS SAY WHERE HE FITS, NOT WHERE THE READER RANKS — 2026-08-03.
       "อันดับแรก / อันดับสอง / สนใจเช่นกัน" ranked the reader: a recruiter hiring
       front-end — which is most of the co-op market open to a BIS student —
       read "สนใจเช่นกัน" and saw themselves as the leftover. The English changed
       for the same reason, and the ORDER did not change in either: CLAUDE.md
       fixes analyst first, Management Trainee second, development third.
       The <a> in blocks 1 and 3 must survive the switch — they are the only
       links in nine screens of #roles + #cv, so a Thai string without them puts
       a reader who switched language straight back into the dead end. */
    '.role:nth-child(1) .role__n': 'ตรงกับผมที่สุด',
    '.role:nth-child(1) .small': 'ตรงกับสิ่งที่ผมทำมาจริงที่สุด — ทุกโปรเจคในนี้ผมเริ่มจากเก็บ requirement ' +
      'เขียน use case ออกแบบ ER diagram และวาง business rule ก่อนจะแตะโค้ดบรรทัดแรกเสมอ ' +
      /* the space before the <a> sits OUTSIDE it on purpose — a leading space
         inside an inline element collapses away and the words run together,
         which is the same trap docs/HANDOFF.md §13 records for .mark-wrap */
      'ส่วน <a href="megubot.html">MeguBot</a> ผมทำถึงตรงนั้นแล้วส่งต่อให้ dev เลย ' +
      '· ข้อได้เปรียบของผมคือคุยกับ dev รู้เรื่อง เพราะผมเคยเขียนเอง',
    '.role:nth-child(2) .role__n': 'เข้ากับผมได้ดีเช่นกัน',
    '.role:nth-child(2) .role__t': 'Management Trainee',
    '.role:nth-child(2) .small': 'ผมเรียนบริหารธุรกิจ ไม่ใช่วิศวกรรม มุมมองของผมจึงเริ่มจากปัญหาขององค์กรก่อนเสมอ ' +
      'ในงานกลุ่มผมเป็นคนคุมภาพรวมและประสานงานเอง จึงถนัดงานที่ต้องหมุนหลายฝ่าย',
    '.role:nth-child(3) .role__n': 'เริ่มงานได้ทันที',
    '.role:nth-child(3) .small': 'งาน UI ของ<a href="fms-election.html">ระบบเลือกตั้ง</a>คือส่วนที่ผมภูมิใจที่สุด ' +
      '— ระบบธีม 23 แบบที่สลับได้ทั้งเว็บจากหน้า admin และทุกหน้าออกแบบจากมือถือก่อนเสมอ ' +
      '· ถ้าตำแหน่งเป็นสายพัฒนา ผมเริ่มงานได้ตั้งแต่วันแรก และการเขียนแบบก่อนลงมือคือสิ่งที่ทำให้โค้ดของผมอยู่ได้ในระยะยาว',

    /* ── skills + cv ─────────────────────────────────────────────────────── */
    '#cv > .inner > .tag:nth-of-type(1)': '06 — ทักษะ',
    '#cv h2.big': 'สิ่งที่ได้ใช้จริงในโปรเจคข้างบน',
    '.block:nth-child(1) h3': 'วิเคราะห์ระบบและธุรกิจ',
    '.block:nth-child(1) .tag': 'จุดเริ่มต้นของทุกโปรเจค',
    '.block:nth-child(2) h3': 'ออกแบบประสบการณ์ใช้งาน',
    '.block:nth-child(2) .tag': 'UI/UX และการทำต้นแบบ',
    '.block:nth-child(3) h3': 'พัฒนาเว็บ',
    '.block:nth-child(3) .tag': 'เครื่องมือที่ใช้สร้างจริง',
    '.block:nth-child(4) h3': 'คลาวด์และการส่งมอบ',
    '.block:nth-child(4) .tag': 'ทำให้ขึ้นใช้งานได้จริง',
    /* ── the pair under the skills grid ────────────────────────────────────
       These two used to be somewhere else, or nowhere. The AI card was the
       .note box at the foot of #cv, opening "เรื่องที่ผมพูดตรง ๆ เสมอ" — an
       announcement that a confession is coming, planted under four CV rows
       claiming solo work. Same facts, stated as a skill.
       The language card was on neither language version of the page: it existed
       only inside the Business Analyst PDF.
       .block:nth-child(n) would collide with the four cards in .grid2 above —
       both are .block and both are the nth child of their own parent — so these
       are scoped through .pair. Keep it that way if a card is ever added.
       THE LEVELS ARE THE CV'S OWN WORDS AND STAY IN ENGLISH: Native, Working
       Proficiency, Conversational. Translating them invites rounding up, and
       "Working Proficiency" has no Thai equivalent that means exactly it. Only
       the language NAMES turn. */
    '.pair .block:nth-child(1) h3': 'การพัฒนาโดยมี AI ช่วย',
    '.pair .block:nth-child(1) .tag': 'ผมใช้มันยังไง',
    '.pair .block:nth-child(1) .small': 'ผมใช้ AI เป็นคู่คิดในทุกโปรเจค และผมชัดเจนว่าเส้นแบ่งอยู่ตรงไหน — ' +
      '<strong>สถาปัตยกรรมระบบ โมเดลความปลอดภัย และโครงสร้างข้อมูล เป็นการตัดสินใจที่ผมเลือกเองและอธิบายได้</strong> ' +
      '· ทุกโปรเจคมี decision log เขียนไว้ และผมยินดีพาไล่ดูทีละข้อ',
    '.pair .block:nth-child(2) h3': 'ภาษา',
    '.pair .block:nth-child(2) .tag': 'ภาษาที่ผมทำงานได้',
    '.pair .block:nth-child(2) li:nth-child(1)': 'ไทย — Native',
    '.pair .block:nth-child(2) li:nth-child(2)': 'อังกฤษ — Working Proficiency',
    '.pair .block:nth-child(2) li:nth-child(3)': 'ญี่ปุ่น — Conversational',
    '#cv > .inner > .tag:nth-of-type(2)': '07 — ประวัติ',
    '.cv__row:nth-child(1) .cv__when': '2023 – ปัจจุบัน',
    '.cv__row:nth-child(1) em': 'การศึกษา',
    '.cv__row:nth-child(1) h3': 'ม.สงขลานครินทร์ · บริหารธุรกิจบัณฑิต',
    '.cv__row:nth-child(1) .small': 'สาขาระบบสารสนเทศทางธุรกิจ คณะวิทยาการจัดการ · GPAX 3.03 · คาดว่าจบปี 2027',
    '.cv__row:nth-child(2) .cv__when': 'ต.ค. 2025',
    '.cv__row:nth-child(2) h3': 'แชตบอตบน Azure ที่ deploy ขึ้นใช้งานจริง',
    '.cv__row:nth-child(2) .small': 'ออกแบบ conversation flow และสถาปัตยกรรมคลาวด์ภายใต้งบที่จำกัด ' +
      'จบด้วยการ deploy ขึ้น Azure VM พร้อม HTTPS · รองคณบดีซึ่งเป็นอาจารย์ประจำวิชาชวนให้ไปทำแชตบอตของคณะต่อ ' +
      'แต่ตอนนั้นผมงานล้นมือเลยไม่ได้ตามเรื่องต่อ',
    '.cv__row:nth-child(3) .cv__when': 'ธ.ค. 2025 – ปัจจุบัน',
    '.cv__row:nth-child(3) h3': 'ระบบเลือกตั้งของสโมสรนักศึกษา',
    '.cv__row:nth-child(3) .small': 'เก็บ requirement กับคณะกรรมการเลือกตั้ง ออกแบบ threat model ฐานข้อมูล ' +
      'และวิธีเก็บบัตรลงคะแนน · นำเข้าผู้มีสิทธิ์ 3,119 คนผ่าน API ของมหาวิทยาลัยโดยไม่มีข้อมูลผิดพลาด',
    '.cv__row:nth-child(4) .cv__when': 'ภาคเรียน 2/2568',
    '.cv__row:nth-child(4) h3': 'ระบบติดตามหน่วยกิตที่อ่านทรานสคริปต์เอง',
    '.cv__row:nth-child(4) .small': 'ออกแบบ use case, context diagram และ ER diagram ก่อนลงมือ ' +
      'แล้วพัฒนาเป็นเว็บแอป Next.js + TypeScript ที่มีทั้งฝั่งนักศึกษาและฝั่งผู้ดูแลหลักสูตร',

    /* ── contact ─────────────────────────────────────────────────────────── */
    '#contact .tag': '08 — ติดต่อ',
    /* The English heading changed from a second claim about sitting between
       two worlds — which the roles section already makes — to an invitation.
       The Thai follows the same turn: it asks, it does not re-assert. */
    '#contact h2': 'เริ่มจาก<br><span class="mark-wrap">โจทย์</span>ก่อนดีกว่า',
    '#contact p.small': 'ผมกำลังมองหา<strong>ฝึกงานสหกิจศึกษา ตั้งแต่ 16 พฤศจิกายน 2026 ถึง 7 มีนาคม 2027</strong> ' +
      'ในตำแหน่ง <strong>System Analyst</strong>, <strong>Business Analyst</strong> หรือ ' +
      '<strong>Management Trainee</strong> · ยินดีคุยรายละเอียดทุกโปรเจคแบบเจาะลึก เปิดโค้ดให้ดูได้',
    /* ── the two résumés ───────────────────────────────────────────────────
       The <i> carries the format and the weight and has to survive the switch:
       it is inside the <a>, so it is part of what a screen reader announces
       before someone commits to a download.
       "CV" is left as CV in Thai — it is what people write and say here, and
       "ประวัติย่อ" beside a file called Teerapab-Boonsri-CV-… reads as two names
       for one thing. The role names stay English for the reason the cover and
       the contact paragraph already state theirs in English. */
    '.dl > li:nth-child(1) .btn': 'CV — System Analyst (PDF) <i>125 KB</i>',
    '.dl > li:nth-child(1) .small': 'น้ำหนักไปทางลงมือสร้าง — Next.js, React, Prisma, PostgreSQL, Docker และ Azure ' +
      'พร้อมระบบที่ผม deploy ขึ้นใช้จริง',
    '.dl > li:nth-child(2) .btn': 'CV — Business Analyst (PDF) <i>125 KB</i>',
    '.dl > li:nth-child(2) .small': 'น้ำหนักไปทางวิเคราะห์ — การเก็บ requirement การทำงานกับผู้มีส่วนได้ส่วนเสีย ' +
      'และ cost-benefit · และเป็นฉบับเดียวที่มีหัวข้อภาษา',
    /* The availability strip. One selector for the whole row rather than one
       per span, because this file applies a selector to the FIRST match only
       and the row is written out four times over — a per-span rule would turn
       one repeat Thai and leave three in English, mid-scroll, in the same view.
       .repeat(4) keeps the markup's own rule intact: half the row must be at
       least as wide as the box, or the loop shows a gap at -50%.
       The three job titles stay English here for the same reason they do in the
       cover and the contact paragraph — they are the titles he is applying
       under, and translating them would stop matching what a recruiter reads. */
    '.ticker__row': ('<span class="ticker__on">ว่างรับงาน</span><em>◆</em>' +
      '<span>สหกิจศึกษา · 16 พ.ย. 2026 — 7 มี.ค. 2027</span><em>◆</em>' +
      '<span>System Analyst</span><em>◆</em>' +
      '<span>Business Analyst</span><em>◆</em>' +
      '<span>Management Trainee</span><em>◆</em>').repeat(4),
    '.foot small': 'ธีรภัทร บุญศรี · หาดใหญ่ สงขลา<br>ระบบสารสนเทศทางธุรกิจ · มหาวิทยาลัยสงขลานครินทร์',
    '.sign': 'จบพอร์ตโฟลิโอ — เริ่มบทสนทนา',
  };

  /* ── the switch ──────────────────────────────────────────────────────────
     English is what the markup says, so it is captured lazily the first time
     Thai is applied and restored verbatim on the way back. */

  const EN = new Map();
  const KEY = 'lang';
  const html = document.documentElement;

  const apply = lang => {
    const toThai = lang === 'th';
    /* verdure.js may have split some headings into per-line spans. Writing over
       that would destroy the split AND cache the split markup as the English
       original, so it unwinds first and re-splits after. Absent on the case
       study pages, which do not load verdure.js. */
    const resplit = window.__lmRestore ? window.__lmRestore() : null;
    for (const sel in TH) {
      let el;
      try { el = document.querySelector(sel); } catch { continue; }
      if (!el) continue;
      if (!EN.has(sel)) EN.set(sel, el.innerHTML);
      el.innerHTML = toThai ? TH[sel] : EN.get(sel);
    }
    html.lang = toThai ? 'th' : 'en';
    document.querySelectorAll('.lang__btn').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.lang === (toThai ? 'th' : 'en'))));
    try { localStorage.setItem(KEY, toThai ? 'th' : 'en'); } catch {}
    if (resplit) resplit();
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('.lang__btn');
    if (b) { e.preventDefault(); apply(b.dataset.lang); }
  });

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  if (saved === 'th') apply('th');
  else document.querySelectorAll('.lang__btn').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === 'en')));

  /* Run window.__i18nCheck() in the console after editing index.html: it prints
     every selector in this file that no longer matches an element. */
  window.__i18nCheck = () => {
    const dead = Object.keys(TH).filter(s => { try { return !document.querySelector(s); } catch { return true; } });
    console.log(dead.length ? 'STALE SELECTORS:\n' + dead.join('\n') : 'all ' + Object.keys(TH).length + ' selectors match');
    return dead;
  };
})();
