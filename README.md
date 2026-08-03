# Portfolio — Teerapab Boonsri

เว็บพอร์ตโฟลิโอส่วนตัว **ภาษาอังกฤษ** (มีปุ่มสลับเป็นไทยที่หน้าแรก) · ธีมสว่าง Verdure ทั้งเว็บ
หน้าแรกเริ่มด้วยม่านโหลด → About me → วิธีทำงานสี่ขั้น → รางผลงานที่เลื่อนแนวนอน
→ งานที่มองหา → ติดต่อ · แล้วแยกเป็น case study สี่หน้า

1. **FMS Online Voting System** — ระบบเลือกตั้งสโมสรนักศึกษาที่ใช้งานจริง
2. **FMS Credit Tracker** — ระบบติดตามหน่วยกิตที่อ่านทรานสคริปต์ PDF เอง
3. **PSU Chatbot** — แชตบอตบน Azure ที่ deploy ขึ้นใช้งานจริง
4. **MeguBot** — บอต Discord ที่**เจ้าของออกแบบระบบ เพื่อนเป็นคนเขียนโค้ด**

static ล้วน ไม่มี build step ไม่มี dependency — เปิดไฟล์ก็ทำงานได้ deploy ที่ไหนก็ได้ที่เสิร์ฟไฟล์ static
(สิ่งเดียวที่โหลดจากภายนอกคือฟอนต์จาก Google Fonts)

## รันดูในเครื่อง

```bash
node serve.js
```

เปิด `http://localhost:4173`

## Deploy

repo อยู่ที่ https://github.com/Teerapab149/Teerapab149.github.io และ Pages เปิดใช้งานแล้ว
ทุกครั้งที่ push เข้า `main` workflow ใน `.github/workflows/deploy.yml` จะ publish ให้เอง

เว็บอยู่ที่ **https://teerapab149.github.io/** — push เข้า main = เผยแพร่ทันที

Cloudflare Pages / Netlify / Vercel ก็ใช้ได้เหมือนกัน — ไม่ต้องตั้ง build command
กำหนด output directory เป็น root พอ

> ⚠️ **ก่อน commit ครั้งต่อไป อ่าน `docs/HANDOFF.md` §6 ข้อ 1 ก่อน**
> ตอนนี้มีไฟล์ JS ที่ทั้งเว็บเรียกใช้อยู่แต่**ยังไม่ถูก track ใน git** ถ้า push ไปเลยจะ 404

## โครงสร้าง

```
index.html             หน้าแรก — Verdure · ม่านโหลด → cover → ราง Work → องก์มืด
fms-election.html      case study · ระบบเลือกตั้ง
credit-tracker.html    case study · ระบบติดตามหน่วยกิต
psu-chatbot.html       case study · แชตบอตบน Azure
megubot.html           case study · บอต Discord (ออกแบบเอง เพื่อนเขียนโค้ด)
```

**CSS**

```
assets/verdure.css     design system ของหน้าแรก ทั้งชุด (ไม่โหลด style.css)
assets/rail.css        ราง Work แนวนอน — ต่อยอดจาก verdure.css ต้องโหลดหลังมัน
assets/style.css       design system ของ case study 4 หน้า (พาเลตต์ Verdure ชุดเดียวกัน)
```

**JS ที่ทุกหน้าใช้ร่วมกัน**

```
assets/reveal.js       engine กลาง — line-mask + IntersectionObserver ตัวเดียวของทั้งเว็บ
                       ต้องโหลด "ก่อน" ไฟล์อื่นเสมอ
assets/feel.js         เคอร์เซอร์แบบจุด+วงแหวน · ภาพลอยตาม scroll เล็กน้อย
assets/nav.js          แผงปาดระหว่างหน้า (page transition)
assets/morph.js        ภาพในรางบินไปเป็น hero ของ case study — โหลดแบบ blocking ใน <head>
```

**JS ของหน้าแรกอย่างเดียว**

```
assets/curtain.js      ม่านโหลดจอแรก — ต้องเป็น <script> ตัวแรกใน <body>
assets/verdure.js      หน้าต่างที่ขยายตอน scroll · count-up · แถบบนเปลี่ยนสีตามพื้น
assets/i18n.js         สลับ TH/EN (อังกฤษคือ DOM จริง · ไทยทับด้วย selector map)
assets/inner.js        ภาพขยับอยู่ในกรอบของตัวเอง ให้รู้สึกมีความลึก
assets/rail.js         ยึดรางไว้แล้วแปลง scroll แนวตั้งเป็นการเลื่อนแนวนอน
```

**JS ของหน้า case study**

```
assets/app.js          gallery + lightbox + deck 23 ธีม + scroll-spy (fms-election)
assets/motion.js       count-up + scroll-spy (credit-tracker, psu-chatbot, megubot)
```

**ภาพและเอกสาร**

```
assets/img/            desktop / mobile / themes / admin — 108 ภาพจริงของระบบเลือกตั้ง
assets/img/me/         รูปเจ้าของ
assets/img/credit/     ภาพของ Credit Tracker
assets/img/chatbot/    ภาพของ PSU Chatbot
assets/img/megubot/    ภาพของ MeguBot
assets/img/fms/        โลโก้กับโปสเตอร์ ใช้ในหน้าต่างจำลองบนหน้าแรก

docs/HANDOFF.md        ⭐ อ่านก่อนแก้อะไร — เริ่มที่ §18 ถ้าจะแตะหน้าแรก
docs/CONTENT-SOURCE.md ที่มาของทุกตัวเลขของระบบเลือกตั้ง + เวอร์ชันสั้นสำหรับ resume/LinkedIn
docs/PLAN-AWWWARDS.md  แผนของระบบ motion ที่ใช้อยู่ตอนนี้
docs/PLAN-MOTION.md    แผนของ prototype ที่ยังไม่ได้เอามาใช้จริง
CLAUDE.md              กติกาสำหรับ AI ที่มาทำต่อ
```

`index-motion.html` · `index-motion_2.html` · `index-niika.html` ที่อยู่ใน root
เป็น **prototype ที่ยังไม่ได้เอามาใช้** และถูก `.gitignore` ไว้แล้ว เพราะทุก `.html` ที่ root
ถูก GitHub Pages เสิร์ฟหมด

## หลักการที่ยึดไว้ทั้งเว็บ

- **ไม่มี dependency ไม่มี build step** — ยกเว้นฟอนต์จาก Google Fonts
- **path เป็น relative เสมอ** (`assets/...` ไม่ใช่ `/assets/...`)
- **ห้ามซ่อนเนื้อหาไว้หลัง JS** — ทุก start state ของแอนิเมชันอยู่ใต้คลาส `.js-anim`
  ซึ่งถูกใส่ด้วย inline script บรรทัดเดียว · **ถ้า JS ไม่ทำงานเลย เนื้อหาทั้งหมดยังอ่านได้ครบ**
- **body ห้าม scroll แนวนอน** ที่ 1440 / 1024 / 768 / 390 / 360 px
- เคารพ `prefers-reduced-motion` ทุกจุดที่มี motion

ภาพของระบบเลือกตั้งถ่ายอัตโนมัติด้วย Playwright โดยชุด desktop/mobile/themes ใช้หน้าพรีวิว
ที่เป็นข้อมูลจำลองล้วน ไม่มีข้อมูลนักศึกษาจริง — สคริปต์แคปอยู่ในโปรเจกต์ต้นทาง
(`docs/portfolio-shots/_scripts/`) · ต้นฉบับก่อนปิดข้อมูลอยู่ใน `_source-images/`
ซึ่ง **gitignore ไว้และห้ามย้ายกลับ**
