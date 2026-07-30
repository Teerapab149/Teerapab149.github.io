# HANDOFF — เว็บ portfolio (Teerapab Boonsri)

> เขียน 2026-07-27 · แก้ใหญ่ 2026-07-30 (จาก case study เดี่ยว → พอร์ตโฟลิโอ 3 โปรเจกต์ ธีมสว่าง)
> · แก้ครั้งล่าสุด 2026-07-30 รอบเย็น — **เว็บเปลี่ยนเป็นภาษาอังกฤษทั้งหมด** · เพิ่ม
> section **About me** พร้อมช่องรูปตัวเองเป็นส่วนแรกของหน้าแรก (ดู §13) · **เจ้าของเลือก Verdure
> แล้ว** จึงสลับ `index-verdure.html` → `index.html` ลบแบบ A ทิ้ง และ**แปลง case study ทั้งสามหน้า
> เป็นพาเลตต์ Verdure** ด้วย (ดู §12)
> สำหรับ Claude คนถัดไป และสำหรับเจ้าของโปรเจกต์
> อ่านไฟล์นี้ก่อนแตะอะไรทั้งสิ้น แล้วค่อยดู `CLAUDE.md` (กติกา) และ `docs/CONTENT-SOURCE.md` (ข้อเท็จจริงของระบบเลือกตั้ง)

---

## 0. หนึ่งย่อหน้าว่าโปรเจกต์นี้คืออะไร

เว็บพอร์ตโฟลิโอ (static) ของ **Teerapab Boonsri** นักศึกษา Business Information Systems
คณะวิทยาการจัดการ ม.สงขลานครินทร์ สำหรับให้ HR และคนที่สนใจจ้างงานเข้ามาดู
เป้าหมายคือแสดงสามอย่างพร้อมกัน — **ออกแบบระบบเป็น** · **ทำ UX/UI เป็น** ·
และ**สื่อสารได้ว่าอยากทำงานสายไหน** (Analyst / Management มาก่อนสาย dev)

ไม่มี build step ไม่มี framework ไม่มี dependency — HTML + CSS + JS ล้วน เพื่อให้ deploy ฟรีได้ทุกที่
และให้คนที่มารับช่วงต่ออ่านออกทันที

---

## 1. สถานะปัจจุบัน (2026-07-30)

| ส่วน | สถานะ |
|---|---|
| `index.html` — หน้าแรก **Verdure**: About me + รูปตัวเอง → hero → capsule ที่ขยายตอน scroll → 3 โปรเจกต์ → งานที่มองหา → ทักษะ → ประวัติ → ติดต่อ | ✅ เสร็จ · อังกฤษ |
| หน้าแรกแบบ A (ม่วง/เทา) | 🗑️ ลบแล้ว — เจ้าของเลือก Verdure (ดู §12) |
| `fms-election.html` — case study ระบบเลือกตั้ง | ✅ เสร็จ · อังกฤษ · Verdure |
| `credit-tracker.html` — case study ใหม่ 7 หัวข้อ | ✅ เสร็จ · อังกฤษ · Verdure |
| `psu-chatbot.html` — case study ใหม่ 7 หัวข้อ | ✅ เสร็จ · อังกฤษ · Verdure |
| contrast ทุกคู่สีของทั้ง 4 หน้า (วัดจริงจาก computed style + ผสม alpha) | ✅ ผ่านทั้งหมด — แก้ 3 จุดที่ไม่ผ่าน (ดู §12) |
| **ภาพตัวเอง (portrait) ใน section About me** | ❌ **ยังเป็นกล่องเส้นประ — รอเจ้าของอัปโหลด (ดู §11)** |
| design system ธีมสว่าง — `verdure.css` (หน้าแรก) + `style.css` (case study) ใช้พาเลตต์ Verdure ชุดเดียวกัน | ✅ เสร็จ |
| scroll reveal + count-up + scroll-spy (`assets/motion.js`) | ✅ เสร็จ |
| ตรวจ responsive 1440 / 1024 / 768 / 390 / 360 px — รอบอังกฤษตรวจ 4 หน้าที่แก้ (แบบ B + case study ×3) = 20 ชุด | ✅ ผ่านทั้ง 20 ไม่มี overflow แนวนอน |
| console error / รูปเสีย / ลิงก์เสีย ทั้ง 4 หน้า | ✅ ไม่มี (ลิงก์+ไฟล์ 29 รายการตอบ 200) |
| ทดสอบกรณี JS ไม่ทำงาน (ถอด `.js-anim`) | ✅ ผ่าน เนื้อหาอ่านได้ครบ |
| gallery ของหน้า fms-election (6 แท็บ · 23 ธีม · 8 มือถือ) หลังเปลี่ยนธีม | ✅ ยังทำงาน |
| **ภาพตัวเอง 1 รูป + Credit Tracker 9 รูป + PSU Chatbot 6 รูป** | ❌ **ยังเป็นกล่องเส้นประ — รอเจ้าของอัปโหลด (ดู §11)** |
| **เปิด GitHub Pages** | ✅ **เปิดแล้ว — `https://teerapab149.github.io/` เสิร์ฟของจริง (ตรวจสด 2026-07-30)** |
| push การแก้รอบ 2026-07-30 ขึ้น GitHub | ✅ push แล้ว commit `f1e83ef` — **เจ้าของสั่งให้ push เอง** |

remote คือ `https://github.com/Teerapab149/Teerapab149.github.io.git` (branch `main`)

> ⚠️ **URL เดิมเปลี่ยนความหมายแล้ว** — `teerapab149.github.io/` เคยเป็นหน้า case study ของระบบเลือกตั้ง
> ตอนนี้เป็นหน้าพอร์ตโฟลิโอ ส่วน case study ย้ายไป `teerapab149.github.io/fms-election.html`
> ถ้าเคยส่งลิงก์เดิมให้ใครไว้ ลิงก์ยังใช้ได้ แต่จะเห็นหน้าใหม่

---

## 2. แผนที่ไฟล์

```
portfolio-teerapab/
├── index.html               ← หน้าแรก (พอร์ตโฟลิโอ) — Verdure · เดิมชื่อ index-verdure.html
├── fms-election.html        ← case study ระบบเลือกตั้ง — เดิมคือ index.html
├── credit-tracker.html      ← case study ระบบติดตามหน่วยกิต
├── psu-chatbot.html         ← case study แชตบอต
├── serve.js                 ← static server สำหรับพรีวิว (node serve.js → :4173)
├── .claude/launch.json      ← ให้ preview tool รัน serve.js ได้เอง
├── assets/
│   ├── verdure.css          ← design system ของหน้าแรก ทั้งชุด (ไม่โหลด style.css)
│   ├── verdure.js           ← reveal + count-up + capsule ที่ขยาย + scroll readout ของหน้าแรก
│   ├── style.css            ← design system ของ case study 3 หน้า (พาเลตต์ Verdure เหมือนกัน)
│   ├── motion.js            ← scroll reveal + count-up + scroll-spy (credit-tracker, psu-chatbot)
│   ├── app.js               ← gallery + lightbox + scroll-spy ของหน้า fms-election
│   └── img/
│       ├── desktop/01-original … 06-receipt/   6 ตระกูล × 9 หน้า
│       ├── mobile/01-original … 06-receipt/    6 ตระกูล × 4 หน้า
│       ├── themes/01 … 23                      ทุกธีม หน้าแรก
│       ├── admin/1 … 7                         หน้า admin
│       ├── me/README.md                        ⬜ ว่าง — รูปตัวเอง 1 รูป (portrait.webp)
│       ├── credit/README.md                    ⬜ ว่าง — ตารางบอกว่าต้องใส่ไฟล์ชื่ออะไร
│       └── chatbot/README.md                   ⬜ ว่าง — ตารางบอกว่าต้องใส่ไฟล์ชื่ออะไร
├── docs/
│   ├── HANDOFF.md           ← ไฟล์นี้
│   └── CONTENT-SOURCE.md    ← ข้อเท็จจริงทุกตัวเลขของ *ระบบเลือกตั้ง* + เวอร์ชันสั้นสำหรับ resume/LinkedIn
├── CLAUDE.md                ← กติกาสำหรับ AI ที่มาทำต่อ
├── README.md
└── .github/workflows/deploy.yml
```

**ทุกหน้าอยู่ที่ root โดยตั้งใจ** — จะได้ใช้ `assets/...` เหมือนกันหมด ไม่ต้องมี `../`
ถ้าย้ายหน้าลงโฟลเดอร์ย่อยเมื่อไร ต้องไล่แก้ path รูปทุกอันในหน้านั้น

**หลักสำคัญ:** รายการภาพใน gallery ของหน้า fms-election ถูกประกาศเป็น array บนหัวไฟล์ `assets/app.js`
(`FAMILIES`, `PAGES`, `THEMES`, `MOBILE`) — จะเพิ่ม/ลด/สลับภาพ แก้ที่ array พวกนั้นที่เดียว

---

## 3. รันดูในเครื่อง

```bash
cd E:/portfolio-teerapab
node serve.js
```

แล้วเปิด `http://localhost:4173` (เปิดไฟล์ตรง ๆ ด้วย `file://` ก็ได้ แต่บางเบราว์เซอร์บล็อกภาพ)

---

## 4. Deploy ฟรี — GitHub Pages (แนะนำ)

workflow เขียนรอไว้แล้วที่ `.github/workflows/deploy.yml` — push ขึ้น branch `main` แล้วมันจะ
publish ให้เอง ไม่ต้อง build อะไร

repo อยู่ที่ **https://github.com/Teerapab149/Teerapab149.github.io** และ
**Pages เปิดใช้งานแล้ว** — ตรวจสดเมื่อ 2026-07-30 ว่า https://teerapab149.github.io/
เสิร์ฟหน้าเวอร์ชันอังกฤษ + About me จริง (ทั้ง 4 หน้าตอบ 200) ดังนั้น
**push เข้า `main` = เผยแพร่ทันที** รอ 1-2 นาทีให้ workflow รันจบ

ถ้าวันหนึ่งเว็บไม่อัปเดตหลัง push ให้ดูแท็บ Actions ว่า job `deploy` เขียวไหม
· ถ้าไม่มี workflow รันเลย ให้เช็ค **Settings → Pages → Build and deployment → Source = GitHub Actions**

ถ้า push ใหม่แล้วเว็บไม่อัปเดต ให้ดูแท็บ Actions ว่า job `deploy` เขียวไหม
· ถ้าไม่มี workflow รันเลย แปลว่ายังไม่ได้ตั้ง Source เป็น GitHub Actions

**ทางเลือกฟรีอื่น ๆ** (ถ้าไม่อยากใช้ GitHub Pages)
- **Cloudflare Pages** — ต่อ repo แล้วตั้ง build command ว่าง, output directory = `/` · ฟรี ไม่จำกัด bandwidth
- **Netlify** — ลาก folder ทั้งอันไปวางบนหน้า drop ได้เลย ไม่ต้องมี git
- **Vercel** — import repo, framework preset = Other

ทุกเจ้าเสิร์ฟไฟล์ static ตรง ๆ ไม่ต้อง build ดังนั้นย้ายไปมาได้อิสระ

**ทุก path ในหน้าเว็บเป็น relative (`assets/...`) ทั้งหมด** — ย้ายไป subpath ไหนก็ไม่พัง
อย่าเปลี่ยนเป็น absolute path (`/assets/...`) เด็ดขาด ไม่งั้น GitHub Pages แบบ subpath จะรูปหายทั้งหน้า

---

## 5. ที่มาของเนื้อหา — ห้ามแต่งตัวเลขเอง

ทุกตัวเลขในหน้าเว็บดึงจาก repo จริงที่ `E:/fms-election/fms_election69` เมื่อ 2026-07-27 (HEAD `5ae8f4b`)
รายละเอียดครบอยู่ใน `docs/CONTENT-SOURCE.md` ซึ่งเป็นสำเนาของ `docs/PORTFOLIO.md` ในโปรเจกต์นั้น

| ตัวเลขในหน้าเว็บ | ที่มา |
|---|---|
| 587 commits | `git rev-list --count HEAD` |
| 62,400 บรรทัด / 283 ไฟล์ | `find src -name "*.js" -o -name "*.jsx"` |
| 26 API routes · 8 models | นับ `route.js` และ `^model` ใน schema.prisma |
| 6 ตระกูล 23 ธีม | `BUILT_IN_TEMPLATES` ใน `src/components/admin/editor/templates/index.js` (ไม่นับ legacy 4 ตัว) |
| smoke 15 · e2e 35 | นับ `test(` ใน `scripts/smoke/*.mjs` และ `e2e/*.spec.js` |
| readiness 14 รายการ | `src/app/api/admin/readiness/route.js` |
| 125 P-LOG | `DECISIONS.md` |

**ถ้าจะอัปเดตตัวเลข ต้องไปนับใหม่จาก repo จริง ห้ามเดา** — README ของโปรเจกต์ต้นทางเองก็เคยค้าง
(บอก e2e 9 เคส ทั้งที่จริง 35) ตัวเลขในหน้านี้ถูกกว่า README ของโปรเจกต์ต้นทาง

---

## 6. TODO ที่ยังค้าง (เรียงตามความสำคัญ)

1. **[เจ้าของ] อัปโหลดภาพ 16 รูป** ตาม §11 — เริ่มจาก **รูปตัวเอง** ก่อน เพราะมันคือสิ่งแรกที่คนเห็นตอนเข้าเว็บ
   · ตอนนี้เว็บ live แล้ว แปลว่ากล่องเส้นประที่รอรูปอยู่ **คนนอกเห็นด้วย** จึงควรรีบใส่
2. ~~เปิด GitHub Pages~~ ✅ เปิดแล้ว · ~~push รอบ 2026-07-30~~ ✅ push แล้ว (`f1e83ef`)
   เจ้าของสั่งให้ push เอง — ครั้งต่อไปก็ต้องให้เขาสั่งเหมือนกัน (กติกาข้อ 7 ของ `CLAUDE.md`)
3. **`og:image` ของสองหน้าใหม่** — `credit-tracker.html` กับ `psu-chatbot.html` ยังไม่มี `og:image`
   เพราะยังไม่มีภาพจริง · พอใส่ภาพแล้วให้เพิ่มบรรทัด `og:image` ชี้ไป URL เต็มของภาพหลักแต่ละหน้า
4. ~~**สถานะ deploy ของระบบเลือกตั้ง**~~ ✅ แก้แล้ว 2026-07-30 — เจ้าของยืนยันว่าใช้งานจริงแล้ว
   ผู้มีสิทธิ์ 3,119 คน · ผู้ใช้สิทธิ์จริงราว 1,600 คน
5. **ปีการศึกษาในภาพเป็น 2570 / SAMO 50** เพราะเป็นข้อมูลจำลองของหน้าพรีวิว ไม่ใช่ SAMO 49 ที่เล่าในเนื้อหา
   ถ้าอยากให้ตรงกัน: แก้ `src/utils/editorDummyData.js` ในโปรเจกต์ต้นทาง แล้วแคปใหม่ (ดู §7)
6. ~~**เวอร์ชันภาษาอังกฤษ**~~ ✅ แก้แล้ว 2026-07-30 — เจ้าของสั่งให้เป็นอังกฤษทั้งเว็บ
   เลยไม่ทำสวิตช์ภาษาและไม่มีเวอร์ชันไทยเลย · ถ้าอยากได้สองภาษาในอนาคตต้องทำ `th/` แยก
   เนื้อหาไทยของ 3 หน้า case study อยู่ใน git history (commit `1b6422e` ย้อนหลัง)
   แต่**หน้าแรกแบบไทยไม่มีใน history** เพราะไม่เคยถูก commit (ดู §12)
7. **ยังไม่มี CONTENT-SOURCE ของสองโปรเจกต์ใหม่** — ตัวเลขของ Credit Tracker นับสดจาก
   `E:/psucredit-project-main` เมื่อ 2026-07-30 (30 API routes · 13 models · 87 ไฟล์ · 11,996 บรรทัด · 15 หน้า)
   ส่วน Chatbot ไม่มี repo ในเครื่อง ตัวเลขมาจากสไลด์ล้วน — ถ้าจะอัปเดตต้องนับใหม่เอง

---

## 7. แคปภาพใหม่ (เมื่อดีไซน์ของระบบเลือกตั้งเปลี่ยน)

สคริปต์อยู่ในโปรเจกต์ต้นทาง ไม่ได้อยู่ที่นี่:

```bash
cd E:/fms-election/fms_election69
node docs/portfolio-shots/_scripts/portfolio-shots.js all      # ต้องมี dev server รันที่ :3000
node docs/portfolio-shots/_scripts/portfolio-admin-shots.js    # ต้องมี .dev-admin-token.local
node docs/portfolio-shots/_scripts/optimize-shots.js           # png → webp
cp -r docs/portfolio-shots/web/* E:/portfolio-teerapab/assets/img/
```

ข้อสำคัญ: ภาพชุด `desktop/`, `mobile/`, `themes/` ถ่ายจาก `/template-preview` ซึ่งใช้ **ข้อมูลจำลองล้วน**
จึงไม่มีทางที่ชื่อหรือรหัสนักศึกษาจริงจะหลุด · แต่ชุด `admin/` ถ่ายจากหน้า admin จริงที่ต่อ DB ของเครื่อง dev
— **ต้องดูทุกภาพก่อนเผยแพร่ทุกครั้ง**

---

## 8. กติกาของหน้านี้ (สืบทอดจากโปรเจกต์ต้นทาง)

1. **ห้ามซ่อนเนื้อหาไว้หลัง JS** — ห้ามใส่ `opacity: 0` แล้วรอ scroll reveal เด็ดขาด
   ถ้า JS ไม่ทำงาน เนื้อหาทั้งหมดต้องยังอ่านได้ (มีข้อยกเว้นเดียวคือ gallery สองอันที่ app.js สร้าง
   ซึ่งถ้าไม่มี JS ก็แค่หายไป ไม่ทำให้เนื้อหาหลักพัง)
2. **ห้ามให้ body scroll แนวนอน** — ทดสอบที่ 1440 / 1024 / 768 / 390 / 360 px ทุกครั้งที่แก้ layout
   ตารางกับ code block ต้อง scroll ในกล่องตัวเอง
3. **ประโยคภาษาไทยห้ามลงท้ายด้วยจุด** — ประโยคอังกฤษกับตัวย่อไทยยังใส่ได้
4. **ไม่เกิน 3 สีต่อวิว** — ม่วง brand + เทากลาง + accent (เขียวมิ้นต์) ใช้เฉพาะความหมาย "ผ่าน/ยืนยันแล้ว"
5. **motion เฉพาะที่มีความหมาย** 150-300ms ease-out และเคารพ `prefers-reduced-motion`
6. **ห้ามเพิ่ม dependency** — ไม่มี npm install ไม่มี build step นั่นคือจุดขายของ repo นี้
   (ยกเว้น Google Fonts ที่โหลดจาก CDN — ตัวเดียวที่ยอมให้พึ่งภายนอก)
7. **ห้ามแต่งตัวเลขหรือความสำเร็จที่ไม่มีจริง** — ถ้าไม่แน่ใจตัวเลขไหน ไปนับจาก repo ต้นทาง
   หรือถามเจ้าของ อย่าเดา หน้า portfolio ที่เกินจริงพังเร็วกว่าหน้าที่ถ่อมตัว

---

## 9. รสนิยมของเจ้าของ (สำคัญ — เคย reject งานมาแล้วจริง)

- ✅ ชอบ: โมเดิร์น รุ่นใหม่ ไม่ทางการ สีสวย สบายตา ดูแพงแต่ไม่พยายามเกินไป
- ❌ ไม่เอา: ความราชการ/พิธีการ, เลขไทย, serif แบบเก่า, 3D/particle/cursor แปลก ๆ,
  loading ที่นานเพื่อความเท่
- ❌ **ห้าม rewrite สิ่งที่เจ้าของบอกว่าชอบแล้ว** — ถ้าจะเสนอดีไซน์ใหม่ ให้ทำเป็นไฟล์/หน้าใหม่แยก
  แล้วให้เขาเลือก ไม่ใช่แก้ทับของเดิม
- เจ้าของสื่อสารแบบกระชับ ไม่ต้องมีคำสุภาพยาว ๆ เสร็จแล้วบอกว่าเสร็จ ติดตรงไหนบอกตรง ๆ

---

## 10. ถ้าคุณคือ Claude คนใหม่ ให้เริ่มแบบนี้

1. อ่านไฟล์นี้จบ → อ่าน `CLAUDE.md` → เปิด `docs/CONTENT-SOURCE.md` ไว้เป็นแหล่งอ้างอิง
2. `node serve.js` แล้วเปิด `http://localhost:4173` ดูของจริงก่อนแก้อะไร
3. เช็ค §6 ว่า TODO ข้อไหนยังค้าง แล้วถามเจ้าของว่าจะทำข้อไหนต่อ
4. แก้แล้วต้องทดสอบ responsive 5 ความกว้าง × ทุกหน้าที่แตะ ตามข้อ §8.2 ทุกครั้ง
   และแปะผลจริงให้เจ้าของดู ห้ามบอกแค่ว่า "ตรวจแล้วผ่าน"

   ⚠️ **`document.scrollWidth` ใช้ตรวจ overflow ไม่ได้ในโปรเจกต์นี้** — `style.css` ตั้ง
   `overflow-x: clip` ไว้บน `html` และ `body` (จำเป็น ไม่งั้น `position: sticky` ของ nav พัง)
   ซึ่ง clip จะไม่สร้าง scrollable region เลย ทำให้ `scrollWidth` เท่ากับ `clientWidth` เสมอ
   แม้จะมี element ล้นอยู่จริง · วิธีที่ถูกคือไล่ดู `getBoundingClientRect()` ของทุก element
   แล้วข้ามตัวที่อยู่ใต้กล่องที่ `overflow-x` เป็น `auto/scroll/hidden/clip`
   (marquee, code block, ตาราง, แถบมือถือ ตั้งใจให้กว้างเกินแล้วคลิปในตัวเอง)

---

## 11. ภาพที่ยังรออยู่ (16 รูป)

สองหน้าใหม่ใช้ **กล่องเส้นประที่พิมพ์ชื่อไฟล์ที่รออยู่** แทนภาพจริง ตั้งใจให้เห็นชัดว่ายังไม่เสร็จ
จะได้ไม่มีใครเผลอคิดว่านี่คือดีไซน์ที่ตั้งใจ

รายละเอียดว่าไฟล์ไหนคือภาพอะไรอยู่ใน:
- `assets/img/me/README.md` — **1 รูป (รูปตัวเอง แนวตั้ง 4:5)** ใช้ใน section About me ของหน้าแรกแบบ B
- `assets/img/credit/README.md` — 9 รูป (dashboard, upload, verify, results, use case, context, ER, admin ×2)
- `assets/img/chatbot/README.md` — 6 รูป (หน้าเว็บสว่าง/มืด, workflow, Language Studio, Web Chat, Direct Line key)

ต้นทางของภาพทั้งหมดคือสไลด์นำเสนอสองไฟล์ที่เจ้าของมีอยู่แล้ว

**วิธีเปลี่ยนกล่องเป็นภาพจริง** — แทนที่ทั้งก้อน

```html
<figure class="slot" style="--ar: 16 / 10">
  <div class="slot__box">…</div>
  <figcaption>…</figcaption>
</figure>
```

ด้วย

```html
<figure class="figure">
  <img src="assets/img/credit/01-hero.webp" width="1600" height="1000" loading="lazy" alt="…">
  <figcaption>…</figcaption>
</figure>
```

เฉพาะภาพหลักบนสุดของแต่ละ case study ให้ใช้ `class="hero__shot"` แทน `class="figure"`
เพื่อให้ได้เงาและขอบแบบเดียวกับหน้า fms-election

> 🔒 **ก่อนอัปโหลดต้องดูทุกภาพ** — ห้ามมีชื่อจริง รหัสนักศึกษาจริง หรือเกรดจริงของใครติดมา
> และภาพ `chatbot/06-direct-line-key.webp` ต้องปิดบัง secret key ให้มิดก่อนเสมอ
> ถ้า key ตัวจริงเคยหลุด ให้กด regenerate ใหม่ใน Azure Bot Service ด้วย

**slot ของหน้าแรกกับของ case study เป็นคนละคลาสกัน** — หน้าแรกใช้ `.slot` ของ `verdure.css`
(ลูกเป็น `em` / `b` / `code` ตรง ๆ) ส่วน case study ใช้ `.slot` + `.slot__box` ของ `style.css`
ถ้าใส่ภาพของ Credit Tracker / Chatbot ต้องแก้ทั้งหน้าแรกและหน้า case study ของโปรเจกต์นั้น

---

## 12. เจ้าของเลือก Verdure — เว็บทั้งก้อนเป็นพาเลตต์เดียวแล้ว

เดิมมีหน้าแรกสองแบบให้เลือก (แบบ A ม่วง/เทา · แบบ B Verdure) · **2026-07-30 เจ้าของเลือกแบบ B**
แล้วสั่งให้สลับไฟล์และลบแบบ A ทิ้ง จึงทำสามอย่างนี้:

1. `index-verdure.html` → `index.html` · ลบ `index.html` เดิม (แบบ A) และ `assets/home.css`
   ลิงก์ทุกอันในหน้า case study ชี้ `index.html` อยู่แล้ว จึงไม่ต้องแก้ลิงก์เลย
2. **แปลง `style.css` (case study 3 หน้า) เป็นพาเลตต์ Verdure** — ไม่แตะคลาสหรือ layout
   แก้แค่ token สี + type ของหัวเรื่อง (Kanit 700/800 tracking ติดลบ เหมือน `.big` ของหน้าแรก)
   จึงต้องเพิ่ม `wght@700;800` ใน `<link>` ฟอนต์ของทั้งสามหน้า
3. hero shot + `og:image` ของ `fms-election.html` เปลี่ยนจากธีม `01-original` (ม่วง)
   เป็น `04-verdure` ให้เข้ากับหน้า · ธีม Original ยังเป็นแท็บแรกของ gallery §05 อยู่

**แบบ A หายไปแล้วจริง ๆ** — ไฟล์นั้นไม่เคยถูก commit (อยู่แต่ใน working tree)
ที่สำรองไว้อยู่ใน scratchpad ของ session 2026-07-30 (`variant-A-backup/index-plain-thai.html`
กับ `home.css`) ซึ่งไม่ถาวร · **ห้ามบอกเจ้าของว่า "กู้จาก git ได้"** เพราะกู้ไม่ได้

### สามจุดที่ contrast ไม่ผ่านและถูกแก้ในรอบนี้

วัดจริงจาก computed style ของทุก element ที่มี text node (ไม่ใช่เชื่อคอมเมนต์ในไฟล์)
และ**ผสม alpha ทับพื้นก่อนวัด** — สามจุดนี้ตกเกณฑ์:

| จุด | เดิม | วัดได้ | แก้เป็น |
|---|---|---|---|
| `--moss-4` / `--dim` (ตัวเล็กสุดทั้งเว็บ) | `#5C7A6A` | 4.3:1 บนครีม · 3.7:1 บน `--paper-3` | `#4F6959` → 5.5:1 · 4.8:1 |
| `.work__idx` (เลข 01/02/03 ตัวใหญ่) | `--honey` | 2.24:1 | `--honey-deep` → 3.1:1 |
| `.end .tag` / `.end .foot small` (ครีมโปร่งบนมอส) | 58% / 55% | 4.5:1 / 4.2:1 | 64% → 5.3:1 |

`--honey #C5A059` เป็นสี**ประดับเท่านั้น** (3.1:1 บนครีม) — ห้ามเอาไปใส่ตัวหนังสือบนพื้นครีม
ถ้าอยากได้ทองที่อ่านได้ ใช้ `--honey-ink #7D6228` (5.2:1) หรือบนพื้นมอสใช้ honey ได้ (4.95:1)

---

## 13. section About me (ใหม่ 2026-07-30)

เจ้าของบอกว่าเว็บ "เน้นพรีเซนโปรเจกต์เลยตั้งแต่เข้าเว็บ ยังไม่ได้พรีเซนตัวผม"
จึงเพิ่ม stage แรกของหน้าแรกเป็น **About me** ก่อน hero เดิม
(ไม่แก้ทับ hero เดิมที่เขาชอบอยู่แล้ว — hero เลื่อนลงไปเป็น stage ที่ 2 เฉย ๆ)

โครง: กรอบรูปทรงโค้ง (arch) ซ้าย · ขวาเป็นชื่อตัวใหญ่ + ประโยคแนะนำตัว + `<dl class="bio">` 4 บรรทัด
(Studying / University / Graduating / Looking for) คั่นด้วยเส้น hairline เหมือน `.cv`

CSS ใหม่ที่เพิ่มใน `verdure.css`: `.intro__grid` `.portrait` `.portrait__frame` `.bio` `.slot--fill`

**กับดักที่เจอจริงตอนทำ (อย่าทำซ้ำ)** — `.portrait` ตอนแรกใส่แค่ `max-width` + `margin-inline: auto`
ที่ ≤900px แล้วรูปหดเหลือ 192px เพราะ **auto margin ปิด stretch ของ grid item**
ทำให้กล่องหดตาม fit-content ซึ่งก็คือความกว้างของ figcaption · ต้องใส่ `width: 100%` คู่ไปด้วยเสมอ

**กรอบรูปเป็นทรง arch ไม่ใช่ทรงแคปซูล** — ตั้งใจให้ไม่เหมือน `.capsule` / `.grow__card`
เพราะสองอันนั้นต้องอ่านว่าเป็น "วัตถุเดียวกันที่กำลังเปิดออก" ตอน scroll
ถ้าเอารูปตัวเองไปใช้ทรงเดียวกัน คนจะอ่านเป็นวัตถุที่สามและ effect นั้นพัง

**ช่องว่างก่อนคำที่มีเส้นวงกลม (`.mark-wrap`) ต้องอยู่นอก `<span>`** — ตอนแปลเป็นอังกฤษเคยเขียน
`people<span class="mark-wrap"> actually use…` แล้วช่องว่างหน้าคำถูกกลืนหาย เพราะ leading space
ที่ต้นของ inline-block ถูก collapse → อ่านเป็น "peopleactually" · ภาษาไทยไม่เจอปัญหานี้เพราะไม่มีเว้นวรรค

**ตรวจ responsive ด้วย iframe ได้เร็วกว่า resize จริง** — สร้าง iframe กว้างตามที่ต้องการทดสอบ
โหลดหน้าเข้าไป แล้วไล่ `getBoundingClientRect()` ทุก element ข้ามตัวที่อยู่ใต้กล่อง `overflow-x`
(ดูเหตุผลที่ห้ามใช้ `scrollWidth` ใน §10) · 4 หน้า × 5 ความกว้าง จบใน JS call เดียว
