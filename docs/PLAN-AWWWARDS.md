# PLAN-AWWWARDS v2 — "The Living Blueprint" (เขียนโดย Fable · ให้ Opus ลงมือ)

เจ้าของ brief 2026-07-31 (สองรอบ รอบสองคือตัวจริง):
1. *"อยากให้ทั้งตัวเว็บไซต์เป็นผลงานด้วย ไม่ใช่แค่ตัวข้อมูลภายใน"*
2. *"ไม่ได้อยากให้เหมือนของเขา (2xa) อยากให้ unique และดู cinematic … เข้ามาครั้งแรกก็ wow เลย
   ระดับ awwwards nominee … ปัจจุบันมันยังดูแข็งทื่อค่อนข้างมาก"*

**อ่าน CLAUDE.md + HANDOFF §15–16 ก่อน** — งาน `.fms` rebuild + theme deck ยังไม่ commit
แผนนี้สร้างต่อจากมัน ห้าม revert

---

## 1. วินิจฉัย: ทำไมตอนนี้ "แข็งทื่อ"

ไม่ใช่ animation น้อย — แต่**ทุกอย่างขยับแบบเดียวกัน**:

- **เมตรอนอม**: ทุก element ใช้ `.up` (fade + rise 14px, 300ms) เท่ากันหมด ทิศเดียว ระยะเดียว
  สมองจับ pattern ได้ใน 2 วินาทีแล้วเลิกสนใจ
- **ไม่มีพระเอกของฉาก**: ของเข้าทีละชิ้นน้ำหนักเท่ากัน ไม่มีการจัดว่าอะไรคือจุดโฟกัส อะไรคือตัวประกอบ
- **ตายตอนหยุดนิ่ง**: reveal จบ = ภาพนิ่งสนิท ไม่มี idle life
- **ไม่มีเนื้อเยื่อเชื่อมฉาก**: ระหว่าง section ตัดชนดื้อ ๆ · เปลี่ยนหน้า = จอขาววูบ
- **โทนเดียวยาว**: มืด (cover) แล้วสว่างตลอดจนจบ — ไม่มีอาร์ค ไม่มี "องก์"

## 2. คอนเซปต์: The Living Blueprint — ไม่ใช่ 2xa clone

2xa = สตูดิโอ generative → ภาษาเขาคือ "โค้ดวาดศิลปะ" (printer SVG, canvas quadtree)
เจ้าของ = **นักวิเคราะห์ระบบ** → ภาษาเราคือ **แบบพิมพ์เขียวที่มีชีวิต**:

> ทุกอย่างบนจอถูก **วัด → ขีดเส้น → ประทับ** ขึ้นมา ไม่ใช่จางเข้ามาลอย ๆ

DNA มีอยู่แล้วโดยไม่ตั้งใจ: chrome bar ของ `.grow` ที่มี URL + เลข px + ไฟ breakpoint
แผนนี้คือขยายภาษานั้นให้ครอบทั้งเว็บ · โครงเรื่อง 3 องก์:
**มืด (title sequence) → สว่าง (โลกงานบนกระดาษ) → มืด (end credits)**

### กฎการกำกับ (Orchestration Laws — ใช้ตัดสินทุกการเคลื่อนไหว)

- **L1 ฉากละหนึ่งพระเอก** — ทุก viewport มี hero move เดียว ตัวประกอบเคลื่อนระยะ/เวลาแค่ 40–60% ของพระเอก
- **L2 ซ้อน ไม่ต่อคิว** — ตัวถัดไปเริ่มเมื่อตัวก่อนถึง ~60% ไม่รอจบ (stagger 70–90ms/บรรทัด)
- **L3 ทิศทางมีความหมาย** — เส้น/โครงสร้าง = *วาด* (scaleX/clip) · ตัวหนังสือ = *สไลด์ขึ้นจากใต้ mask* ·
  ภาพ = *wipe* (clip-path) · ตัวเลข = *นับ* · fade เปล่า ๆ ใช้ได้กับ meta จิ๋วเท่านั้น
- **L4 settle ไม่เด้ง** — identity คือความแม่นยำ: ease-out เท่านั้น ไม่มี spring/overshoot
  (ยกเว้น "ประทับตรา" ให้เกิน 1–2px แล้วกลับ)
- **L5 idle life มีโควตา** — สูงสุด 2 ชิ้นที่ขยับพร้อมกันต่อ viewport, ทุกอันอยู่ใต้
  `prefers-reduced-motion: no-preference`
- **L6 เวลามาจาก token เท่านั้น** — 150/300/600/900ms + easing `--ease: cubic-bezier(.22,.7,.24,1)`
  ประกาศใน :root ทั้ง verdure.css และ style.css ห้ามตั้งเลขลอย

## 3. กติกาที่ห้ามชน (เหมือนเดิม เข้มเท่าเดิม)

1. ห้าม dependency/build — ทุกอย่าง vanilla (พิสูจน์แล้ว: 2xa เองก็ไม่มี GSAP/Lenis)
2. JS ตาย → เนื้อหาครบ 100% · start-state อยู่ใต้ `html.js-anim` เท่านั้น
3. reduced-motion → กระโดดไป end state ไม่มีของค้างครึ่งทาง
4. คู่สีใหม่ทุกคู่วัด contrast จริง (≥4.5:1 เล็ก / ≥3:1 ใหญ่) แล้วจดเลขไว้ในคอมเมนต์
5. body ห้าม scroll แนวนอน — audit 1440/1024/768/390/360 ด้วย getBoundingClientRect
6. ห้ามแต่งตัวเลข/เคลมใหม่ — ทุกคำโตต้องมีที่มาใน CONTENT-SOURCE.md
7. ห้าม zoom ทุกชนิด (เจ้าของ reject แล้ว) · ห้าม smooth-scroll hijack
8. animate เฉพาะ transform / opacity / clip-path · ห้าม blur บนพื้นที่ใหญ่ ·
   `will-change` ใส่ตอนกำลังเล่นแล้วถอด

### ⚠ กับดักภาษาไทย (สำคัญสุดในไฟล์นี้)

**ห้าม split ไทยเป็นตัวอักษรเด็ดขาด** — สระบน/ล่าง วรรณยุกต์ เป็น combining mark แยก span แล้ว render พัง
และไทยไม่มีช่องว่างระหว่างคำ → **mask ได้แค่ระดับ "บรรทัด"** (line-mask) ซึ่งรอดทั้ง EN/TH
· ต้อง re-split หลัง `document.fonts.ready`, หลัง resize (debounce), และหลัง i18n `apply()`
· effect ระดับตัวอักษร (scramble ฯลฯ) ทำได้เฉพาะ label mono ภาษาอังกฤษที่ i18n ไม่แตะ

---

## 4. ฉากต่อฉาก (หน้าแรก index.html)

### SCENE 0 — Title Sequence (จอแรก · โจทย์ "เข้ามาแล้ว wow เลย")

cover เลย์เอาต์เดิม ห้ามรื้อ — เปลี่ยนเฉพาะ**วิธีที่มันปรากฏ**: จากตอนนี้ (ทุกอย่าง wipe เข้าพร้อม ๆ กัน)
เป็นลำดับ "เขียนแบบ" ที่มีจังหวะหายใจ · ไทม์ไลน์ (เริ่มนับหลัง `is-ready`):

| ms | อะไร | อย่างไร |
|---|---|---|
| 0 | กริดพิมพ์เขียว | พื้น cover มีเส้นกริดจาง (opacity 0→0.05, 900ms) — มีอยู่แล้วใน `.fms__bg` เอา pattern เดียวกันมาใช้โทน `--sea` |
| 120 | เส้นบรรทัดฐาน | เส้น hairline ใต้ตำแหน่งชื่อ *วาด* scaleX 0→1 (700ms) พร้อม**เลข px วิ่ง** `0 → 1440` ด้วย mono จิ๋วท้ายเส้น (ใช้ count-up engine เดิม) — โมเมนต์ "ระบบกำลังวัดหน้ากระดาษ" คือลายเซ็นของเว็บนี้ |
| 200 | eyebrow `01 — เกี่ยวกับผม` | สไลด์ขึ้นจาก mask (300ms) |
| 300 / 390 | ชื่อบรรทัด 1 / 2 | `.ln` wipe เดิม (600ms, stagger 90ms) — **พระเอกของฉาก (L1)** |
| 480 | scrawl ใต้ Boonsri | วาดเส้นเหมือนเดิม |
| 560 | portrait | clip-path เผยจากล่างเหมือนเดิม + settle translateY 8px→0 |
| 700+ | ย่อหน้า + facts | facts ทีละคอลัมน์ (stagger 70ms) ตัวเลข **นับ** ไม่ fade (L3) |
| 950 | HUD มุมจอ | readout `%scroll` เดิม + ป้าย section จางเข้า (fade ได้ — meta จิ๋ว) |

- **Skip ทันที** เมื่อ scroll/click/keydown — ทุกอย่างกระโดดจบ ห้ามบังคับดู
- โหลดซ้ำใน session เดียว (sessionStorage) → เล่นแบบสั้น (ครึ่งเวลา) กันรำคาญ
- reduced-motion → ทุกอย่างเสร็จทันที · JS ตาย → หน้านิ่งสมบูรณ์เหมือนปัจจุบัน

### SCENE 0.5 — Cover exit (เลื่อนออกจากชื่อ)

มี `--cp` + parallax แล้ว · เพิ่ม: ชื่อสองบรรทัด **เฉือนแยกทิศ** ตาม `--cp`
(บรรทัดบน translateX(-2vw), ล่าง +2vw) + เส้นบรรทัดฐาน scaleX หดกลับ →
title sequence "สลายเป็นเส้น" ก่อนโลกสว่างเข้ามา · ห้ามแตะ opacity ของเนื้อหาเกิน 0.72 ที่ตกลงไว้

### SCENE 1 — Chooser (`#pick`)

การ์ด 4 ใบ "แจกไพ่ลงโต๊ะ": เข้าด้วย translateY 28px + rotate สลับ ±1.2deg → settle ตรง
(stagger 80ms) · hover: ยกขึ้น 4px + เส้น accent ใต้การ์ด*วาด* + ลูกศรขยับ 4px
· idle: ไอคอนการ์ดลอยหายใจ ±3px คาบ 6s สลับเฟสกัน (โควตา L5)

### SCENE 2 — Hero "I design systems people actually use"

- หัวโตเปลี่ยนจาก wipe ก้อนเดียว → **line-mask ทีละบรรทัด** (นี่คือระบบใหม่หลัก ดู §5)
- capsule มือถือ: idle ลอย ±4px คาบ 7s + เงาขยับตาม — ฆ่าความ "รูปนิ่งแปะไว้"
- ตัวเลข stats **นับ**เมื่อเข้าจอ (มีแล้ว — คงไว้)

### SCENE 3 — `.grow` (มีอยู่แล้ว = set piece ที่แรงสุด) + ลายเซ็นใหม่

เพิ่ม **self-annotation**: ตอนกรอบขยายผ่าน breakpoint จริง มี "เส้นวัด + ป้าย mono"
วาดชี้จุดที่ layout เพิ่งเปลี่ยน แล้วหดหาย เช่น
- ผ่าน 1024px: เส้นชี้ nav → `hamburger → links` · เส้นคร่อมสองคอลัมน์ → `1 col → 2 col`
- ผ่าน 640px: ชี้ CTA → `full-width → hug`

ทำด้วย container query + transition ล้วน (ไฟ sm/md/lg/xl ตอนนี้ก็ทำแบบนี้อยู่แล้ว)
**เว็บที่อธิบายการ reflow ของตัวเองแบบนี้ไม่มีใครทำ — นี่คือ "printer effect" ของเรา**

### SCENE 4 — Interstitial "ตัวเลขเต็มจอ" (ฉากคั่นใหม่ 1 ฉาก ระหว่าง `.grow` กับ p01)

จอเดียว พื้นสว่าง ตัวเลขยักษ์นับขึ้น + คำกำกับ line-mask:
`3,119 ELIGIBLE VOTERS / ~1,600 BALLOTS CAST / 23 THEMES / 1 ANALYST`
(ทุกตัวมีที่มาแล้วใน CONTENT-SOURCE — **ห้ามเพิ่มเคลมใหม่**) · มีเวอร์ชัน TH ใน i18n.js

### SCENE 5 — โปรเจกต์ p01–p04

- ภาพ `.shot` เข้าแบบ **wipe** (clip-path inset ล่าง→บน 600ms) ไม่ fade (L3)
- ชื่อโปรเจกต์ line-mask · index `01` โต ๆ **ประทับ** (scale 1.02→1 + opacity, 300ms — L4)
- เส้นคั่น section ทุกเส้น *วาด* scaleX เมื่อเข้าจอ

### SCENE 6 — `#roles` = เข้าองก์มืด

section นี้เปลี่ยนเป็นพื้น `--deep` ตัวหนังสือ `--paper` **แบบ static ใน CSS**
(JS ตายก็มืดถูกต้อง) → body transition พื้นหลัง 600ms ตอน section ครองครึ่งจอ
(IntersectionObserver สลับ class บน body) · `.bar` ใช้กลไก `bar--dark` เดิมให้ฟังตัวนี้ด้วย
· **ทุกคู่สีวัดใหม่** — `--sea` บน `--deep` = 7.5:1 (วัดแล้วตอน cover) ใช้กับ accent ได้

### SCENE 7 — End credits (`#cv` + `#contact` อยู่ในองก์มืดต่อเนื่อง)

- ticker ชื่อ `TEERAPAB BOONSRI —` วิ่งช้า ๆ เต็มความกว้าง (transform loop, GPU,
  หยุดเมื่อ reduced-motion) — กลิ่น end credits
- ปุ่ม email: hover แบบ label สองชั้นสลับใน mask (150ms)
- ปิดด้วยบรรทัด mono: `— END OF PORTFOLIO · START OF CONVERSATION` line-mask เข้า

## 5. ระบบ Line-mask (เครื่องมือกลางที่ทุกฉากพึ่ง)

- JS หา line box จริงด้วย Range API → ห่อ `<span class="lm__line"><span class="lm__in">`
- start-state ใต้ `.js-anim`: `.lm__in { translateY(110%) }` → `.is-in` เลื่อนเป็น 0 ตาม `--d`
- fallback สามชั้น: ไม่มี JS → ไม่ซ่อนอะไร · split ล้มเหลว (มี inline element คร่อมบรรทัด) →
  ถอยไป `.up` เดิมของ element นั้น · reduced-motion → `.is-in` ทันที
- ใช้กับ: `.big` ทั้งหมด, `.pick__title`, `.cover` ตามไทม์ไลน์ Scene 0, section-head ของ
  case study 4 หน้า · **ห้ามใช้กับย่อหน้ายาว** (`.small` คง `.up`)

## 6. หน้า case study (4 หน้า) + การเชื่อมหน้า

- **Page transition**: คลิกลิงก์ภายใน → overlay `--deep` ปาดจากล่าง (clip-path, 380ms)
  พร้อมป้าย mono มุมจอบอกปลายทาง (`→ FMS ONLINE VOTING`) → navigate → หน้าใหม่ปาดออก
  · sessionStorage กัน entrance ตอนเข้าจากภายนอก · JS ตาย = ลิงก์ธรรมดา
- แต่ละ case study เปิดด้วย **mini title-card**: เลขโปรเจกต์ประทับ → ชื่อ line-mask →
  เส้นวาด → hero image wipe (ไทม์ไลน์ย่อของ Scene 0 · ~700ms รวม)
- **Slideshow 23 ธีม เปลี่ยนจาก 3D rotate เป็น glide** (โจทย์เดิมของเจ้าของ ยังยืนอยู่):
  ใบ active เกือบเต็ม stage, ใบข้างโผล่ขอบ ~6% · เปลี่ยนใบ = track translateX 600ms `--ease`
  + **ภาพในใบเลื่อนสวนทาง ~8%** (inner parallax) · ลาก follow นิ้วจริง ปล่อยแล้ว snap ·
  ชื่อธีม + เลข `08/23` re-animate ผ่าน mask ทุกครั้ง · โครง DOM/data/rail 23 สี (HANDOFF §16) คงเดิม
- gallery `.shots` ทุกหน้า: ภาพเข้าแบบ wipe ไล่ stagger แทน fade พร้อมกัน

## 7. ลำดับงาน + จุด commit (เรียงตาม wow-per-effort)

| # | งาน | ไฟล์หลัก |
|---|---|---|
| P1 | motion tokens + line-mask engine + Scene 0 title sequence | verdure.css/js, index.html |
| P2 | Scene 1–2 (chooser แจกไพ่, hero line-mask, idle life) + Scene 5 wipes | verdure.css/js |
| P3 | Slideshow glide | style.css, app.js |
| P4 | องก์มืด (Scene 6–7 + ticker + end credits) | verdure.css/js, index.html, i18n.js |
| P5 | `.grow` self-annotation + Scene 4 interstitial | verdure.css, index.html, i18n.js |
| P6 | Page transitions + mini title-cards ของ case study | ทุกหน้า, style.css, motion.js |
| P7 | micro-interactions (ปุ่ม mask-swap, underline วาด, hover ภาพ) | ทั้งคู่ css |

commit แยกทีละ P พร้อมผลตรวจ · เกตต่อ P:
JS-off ครบ / reduced-motion จบทันที / overflow 0 ที่ 5 ความกว้าง / contrast วัดแล้วจด /
`__i18nCheck()` ว่าง + สลับ TH แล้ว mask ไม่พังสระ / CPU 4× ไม่กระตุก / Lighthouse perf ไม่ตก

## 8. ตัดสินใจแล้วว่า "ไม่ทำ" (อย่าหยิบกลับมา)

- ลอกม printer/quadtree ของ 2xa — identity เขา ไม่ใช่เรื่องเล่าของเจ้าของ
- smooth-scroll hijack / scroll-jacking ทุกรูปแบบ
- zoom in/out ทุกชนิด (เจ้าของ reject: "ไม่เอา effect zoom")
- เสียง
- preloader ปลอมที่บังหน้าเว็บเกิน 1 วินาที — เว็บ static โหลดไว การแกล้งช้าคือโกหก
- blur/รack-focus บนพื้นที่ใหญ่ — แพงเกิน GPU มือถือ
- **ห้าม rewrite เนื้อหา/เลย์เอาต์ที่เจ้าของชอบแล้ว — แผนนี้เปลี่ยน "วิธีปรากฏ" ไม่ใช่ "สิ่งที่ปรากฏ"**
