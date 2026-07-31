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
   this repo, and it applies to the site copy too. */

(() => {
  'use strict';

  const TH = {
    /* ── top bar ─────────────────────────────────────────────────────────── */
    '.bar a[href="#work"]': 'ผลงาน',
    '.bar a[href="#contact"]': 'ติดต่อ',

    /* ── cover ───────────────────────────────────────────────────────────── */
    '.cover .tag.rise': '01 — เกี่ยวกับผม',
    '.cover__lede': '<strong>นักศึกษาสาขาระบบสารสนเทศทางธุรกิจ</strong> คณะวิทยาการจัดการ ' +
      'มหาวิทยาลัยสงขลานครินทร์ · ผมทำงานอยู่ตรงเส้นแบ่งระหว่างคนที่ใช้ระบบกับตัวระบบเอง ' +
      'ตั้งแต่เก็บ requirement วาดโฟลว์และโครงสร้างข้อมูล ไปจนถึงลงมือสร้างและเอาขึ้นใช้จริงด้วยตัวเอง',
    '.bio > div:nth-child(1) dt': 'กำลังเรียน',
    '.bio > div:nth-child(1) dd': '<strong>บริหารธุรกิจบัณฑิต สาขาระบบสารสนเทศทางธุรกิจ</strong>',
    '.bio > div:nth-child(2) dt': 'มหาวิทยาลัย',
    '.bio > div:nth-child(2) dd': 'มหาวิทยาลัยสงขลานครินทร์ · หาดใหญ่ ตั้งแต่ปี 2023',
    '.bio > div:nth-child(3) dt': 'จบการศึกษา',
    '.bio > div:nth-child(3) dd': 'คาดว่าปี 2027 · GPAX 3.03',
    '.bio > div:nth-child(4) dt': 'กำลังมองหา',
    '.bio > div:nth-child(4) dd': '<strong>ฝึกงานสหกิจศึกษา · 16 พ.ย. 2569 – 7 มี.ค. 2570</strong>' +
      '<br>System Analyst · Business Analyst · Management Trainee',
    '.cover__cue': 'เลื่อนลงไปดูผลงาน',

    /* ── chooser ─────────────────────────────────────────────────────────── */
    '#pick .tag': '02 — อยากเริ่มดูตรงไหน',
    '#pick h2': 'เลือกงานที่คุณสนใจ<br>— หรือเลื่อนดูไปเรื่อย ๆ ก็ได้',
    '.pick__card:nth-child(1) .pick__d': 'ระบบเลือกตั้งที่คณะใช้งานจริง ผู้มีสิทธิ์ 3,119 คน',
    '.pick__card:nth-child(1) .pick__role': 'System Analyst · Developer · UI/UX',
    '.pick__card:nth-child(1) .pick__live': 'ใช้งานจริง',
    '.pick__card:nth-child(2) .pick__d': 'อ่านทรานสคริปต์จากไฟล์ PDF แล้วบอกว่ายังขาดหน่วยกิตอะไร',
    '.pick__card:nth-child(2) .pick__role': 'System Analyst · Full-stack · UI/UX',
    '.pick__card:nth-child(3) .pick__d': 'แชตบอตตอบคำถามนักศึกษาบน Azure ที่ deploy ขึ้นใช้จริงตลอด 24 ชม.',
    '.pick__card:nth-child(3) .pick__role': 'System Analyst · Cloud · Front-end',
    '.pick__card:nth-child(4) .pick__d': 'บอต Discord ที่เพื่อน ๆ ใช้ทุกวัน — ผมออกแบบ คนอื่นเขียนโค้ด',
    '.pick__card:nth-child(4) .pick__role': 'ออกแบบและวิเคราะห์เท่านั้น',
    '.pick__skip': 'ยังไม่แน่ใจ? เลื่อนต่อได้เลย — หน้านี้อ่านจากบนลงล่างได้ทั้งหน้า ' +
      'และ<a href="#contact">ช่องทางติดต่อ</a>อยู่ท้ายสุดอยู่แล้ว',

    /* ── hero ────────────────────────────────────────────────────────────── */
    '.hero__type .tag--honey': 'ฝึกงานสหกิจศึกษา · 16 พ.ย. 2569 – 7 มี.ค. 2570',
    '.hero__side .tag': 'สี่โปรเจค · เส้นเรื่องเดียวกัน',
    /* nth-of-type counts every <p>, and the first one here is the .tag — so the
       two body paragraphs are 2 and 3, not 1 and 2. The check at the bottom of
       this file caught that. */
    '.hero__side p.small:nth-of-type(2)': 'สามโปรเจคแรกผมทำครบทั้งวงจร ตั้งแต่นั่งเก็บ requirement กับผู้ใช้ ' +
      'ออกแบบ ER diagram และ business flow ไปจนถึงเขียนโค้ด ทำ UI และ deploy เอง ' +
      'ส่วนโปรเจคที่สี่ผมทำแค่ครึ่งแรกคือฝั่งออกแบบ แล้วส่งต่อให้คนเขียนโค้ด',
    '.hero__side p.small:nth-of-type(3)': 'การเขียนโค้ดเป็นเครื่องมือที่ทำให้ผมออกแบบระบบได้แม่นขึ้น ' +
      '<strong>ไม่ใช่ปลายทางที่ผมอยากไป</strong>',
    '.stats-inline > div:nth-child(1) span': 'ผู้มีสิทธิ์ในระบบที่ใช้งานจริง',
    '.stats-inline > div:nth-child(2) span': 'ผู้ใช้สิทธิ์จริง',
    '.stats-inline > div:nth-child(3) span': 'ระบบที่ทำเองครบวงจร',

    /* ── project 01 ──────────────────────────────────────────────────────── */
    '.grow__over .tag': 'ระบบใช้งานจริง · โปรเจค 01',
    '.grow__note': 'ไม่ใช่ภาพหน้าจอ — หน้านี้ถูกสร้างใหม่ด้วย HTML ล้วน และหักที่ breakpoint จริงของระบบ',
    '#p01 .work__head .tag': 'ใช้งานจริง · ธ.ค. 2025 – ปัจจุบัน',
    '#p01 .tag--honey': 'System Analyst · Core Developer · UI/UX',
    '#p01 .cols p.small': 'ระบบเลือกตั้งสโมสรนักศึกษา คณะวิทยาการจัดการ ม.อ. ที่ผมทำคนเดียวทั้งระบบ ' +
      'โจทย์ที่ยากไม่ใช่การทำให้เว็บกดโหวตได้ แต่คือทำให้ผลคะแนน<strong>พิสูจน์ได้ว่าไม่ถูกแก้</strong> ' +
      'ขณะที่<strong>ไม่มีใครสืบได้ว่าใครเลือกพรรคไหน</strong> — สองข้อนี้ขัดกันเองโดยธรรมชาติ ' +
      'และเป็นที่มาของการออกแบบเกือบทั้งหมดในระบบ',
    '#p01 .facts > div:nth-child(1) span': 'ผู้มีสิทธิ์ นำเข้าผ่าน API ของมหาวิทยาลัย',
    '#p01 .facts > div:nth-child(2) span': 'ผู้ใช้สิทธิ์จริง',
    '#p01 .facts > div:nth-child(3) span': 'commits ใน 7 เดือน',
    '#p01 .facts > div:nth-child(4) span': 'ธีม สลับได้จากหน้า admin',

    /* ── project 02 ──────────────────────────────────────────────────────── */
    '#p02 .work__head .tag': 'รายวิชา 477-303 BISA&amp;D · ภาคเรียน 2/2568',
    '#p02 .tag--honey': 'System Analyst · Full-stack Developer · UI/UX',
    '#p02 .cols p.small': 'ระบบติดตามหน่วยกิตของนักศึกษาคณะวิทยาการจัดการ นักศึกษาอัปโหลดใบเกรดกับใบลงทะเบียนเป็น PDF ' +
      'แล้วระบบ<strong>อ่านข้อความออกมาเทียบกับโครงสร้างหลักสูตรให้เอง</strong> ' +
      'ว่าหมวดไหนครบแล้ว หมวดไหนยังขาด แทนการนั่งไล่กาเองในตารางที่คนส่วนใหญ่ทำผิด',
    '#p02 .facts > div:nth-child(1) span': 'API routes',
    '#p02 .facts > div:nth-child(2) span': 'ตารางฐานข้อมูล',
    '#p02 .facts > div:nth-child(3) span': 'หน้าจอฝั่งนักศึกษา + admin',
    '#p02 .facts > div:nth-child(4) span': 'บรรทัด TypeScript',

    /* ── project 03 ──────────────────────────────────────────────────────── */
    '#p03 .work__head .tag': 'รายวิชา 477-302 Cloud Computing Platform · ต.ค. 2025',
    '#p03 .tag--honey': 'System Analyst · Cloud Developer · Front-end',
    '#p03 .cols p.small': 'แชตบอตตอบคำถามนักศึกษา สร้างบน Azure Bot Service ต่อกับ Language Studio ' +
      'แล้วฝังลงหน้าเว็บผ่าน Direct Line API โดยมี Node.js คั่นกลางแลก secret key เป็น token ' +
      '<strong>เพื่อไม่ให้ key หลุดไปอยู่ฝั่ง frontend</strong> · ทั้งระบบรัน 24 ชั่วโมงบน Azure VM',
    '#p03 .facts > div:nth-child(1) span': 'Bot Service + Language Studio',
    '#p03 .facts > div:nth-child(2) span': 'รันบน Azure VM (Ubuntu)',
    '#p03 .facts > div:nth-child(3) span': 'Nginx + Certbot + pm2',
    '#p03 .facts > div:nth-child(4) span': 'คนในทีม ส่วนระบบผมทำเอง',

    /* ── project 04 ──────────────────────────────────────────────────────── */
    '#p04 .work__head .tag': 'โปรเจคส่วนตัวกับเพื่อน · ยังทำอยู่',
    '#p04 .tag--honey': 'System Analyst · เจ้าของฟีเจอร์ · ไม่ได้เป็นคนเขียนโค้ด',
    '#p04 .cols p.small': 'บอตสารพัดประโยชน์ที่เซิร์ฟเวอร์ Discord ของพวกเราใช้กันทุกวัน ' +
      'ทั้งพูดบอกว่าใครเข้าใครออกห้อง voice อ่านข้อความให้คนที่ไม่มีไมค์ จำชื่อเล่นรายคน เปิดเสียงเพลง ' +
      'และมีเกมเล็ก ๆ ไว้เล่นแก้เบื่อ · <strong>ผมออกแบบระบบและฟีเจอร์ เพื่อนเป็นคนเขียนโค้ด</strong> ' +
      'เป็นโปรเจคที่ใกล้เคียงกับงานที่ผมสมัครมากที่สุด',
    '#p04 .facts > div:nth-child(1) span': 'ระบบและฟีเจอร์ ผมออกแบบเอง',
    '#p04 .facts > div:nth-child(2) span': 'เพื่อนเขียน ไม่ใช่ผม',
    '#p04 .facts > div:nth-child(3) span': 'ย้ายจากโน้ตบุ๊กขึ้นคลาวด์',
    '#p04 .facts > div:nth-child(4) span': 'ใช้จริงทุกวัน ไม่ใช่เดโม',

    /* ── buttons that repeat ─────────────────────────────────────────────── */
    '.btn[href="fms-election.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="credit-tracker.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="psu-chatbot.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href="megubot.html"]': 'อ่านรายละเอียดโปรเจค',
    '.btn[href*="cvs.fms.psu.ac.th"]': 'เปิดระบบจริง',
    '.btn[href*="github.com/OtsutsukiMiho"]': 'ดู repository',

    /* ── roles ───────────────────────────────────────────────────────────── */
    '#roles > .inner > .tag': '03 — งานที่ผมมองหา',
    '#roles h2': 'ผมอยากอยู่ตรงกลาง<br>ระหว่างคนใช้งานกับ<span class="mark-wrap">ระบบ</span>',
    '.role:nth-child(1) .role__n': 'อันดับแรก',
    '.role:nth-child(1) .small': 'ตรงกับสิ่งที่ผมทำมาจริงที่สุด — ทุกโปรเจคในนี้ผมเริ่มจากเก็บ requirement ' +
      'เขียน use case ออกแบบ ER diagram และวาง business rule ก่อนจะแตะโค้ดบรรทัดแรกเสมอ ' +
      'ส่วน MeguBot ผมทำถึงตรงนั้นแล้วส่งต่อให้ dev เลย · ข้อได้เปรียบของผมคือคุยกับ dev รู้เรื่อง เพราะผมเคยเขียนเอง',
    '.role:nth-child(2) .role__n': 'อันดับสอง',
    '.role:nth-child(2) .role__t': 'Management Trainee',
    '.role:nth-child(2) .small': 'ผมเรียนบริหารธุรกิจ ไม่ใช่วิศวกรรม มุมมองของผมจึงเริ่มจากปัญหาขององค์กรก่อนเสมอ ' +
      'ในงานกลุ่มผมเป็นคนคุมภาพรวมและประสานงานเอง จึงถนัดงานที่ต้องหมุนหลายฝ่าย',
    '.role:nth-child(3) .role__n': 'สนใจเช่นกัน',
    '.role:nth-child(3) .small': 'งาน UI ของระบบเลือกตั้งคือส่วนที่ผมภูมิใจที่สุด — ระบบธีม 23 แบบที่สลับได้ทั้งเว็บจากหน้า admin ' +
      'และทุกหน้าออกแบบจากมือถือก่อนเสมอ · ถ้าตำแหน่งเป็นสายพัฒนา ผมทำได้ทันที เพียงแต่เป้าหมายระยะยาวของผมคือสายวิเคราะห์ระบบ',

    /* ── skills + cv ─────────────────────────────────────────────────────── */
    '#cv > .inner > .tag:nth-of-type(1)': '04 — ทักษะ',
    '#cv h2.big': 'สิ่งที่ได้ใช้จริงในโปรเจคข้างบน',
    '.block:nth-child(1) h3': 'วิเคราะห์ระบบและธุรกิจ',
    '.block:nth-child(1) .tag': 'จุดเริ่มต้นของทุกโปรเจค',
    '.block:nth-child(2) h3': 'ออกแบบประสบการณ์ใช้งาน',
    '.block:nth-child(2) .tag': 'UI/UX และการทำต้นแบบ',
    '.block:nth-child(3) h3': 'พัฒนาเว็บ',
    '.block:nth-child(3) .tag': 'เครื่องมือที่ใช้สร้างจริง',
    '.block:nth-child(4) h3': 'คลาวด์และการส่งมอบ',
    '.block:nth-child(4) .tag': 'ทำให้ขึ้นใช้งานได้จริง',
    '#cv > .inner > .tag:nth-of-type(2)': '05 — ประวัติ',
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
    '.note .small': '<strong>เรื่องที่ผมพูดตรง ๆ เสมอ</strong> — ผมใช้ AI เป็นคู่คิดในการพัฒนาทุกโปรเจค ' +
      'แต่การตัดสินใจเชิงสถาปัตยกรรม ความปลอดภัย และการออกแบบระบบทั้งหมดเป็นของผม ' +
      'และผมบันทึกบทเรียนที่เจอไว้เป็นเอกสารเพื่อไม่ให้ผิดซ้ำ',

    /* ── contact ─────────────────────────────────────────────────────────── */
    '#contact .tag': '06 — ติดต่อ',
    '#contact h2': 'คุยกับ dev รู้เรื่อง<br>และเข้าใจ<span class="mark-wrap">ฝั่งธุรกิจ</span>',
    '#contact p.small': 'ผมกำลังมองหา<strong>ฝึกงานสหกิจศึกษา ตั้งแต่ 16 พฤศจิกายน 2569 ถึง 7 มีนาคม 2570</strong> ' +
      'ในตำแหน่ง <strong>System Analyst</strong>, <strong>Business Analyst</strong> หรือ ' +
      '<strong>Management Trainee</strong> · ยินดีคุยรายละเอียดทุกโปรเจคแบบเจาะลึก เปิดโค้ดให้ดูได้',
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
