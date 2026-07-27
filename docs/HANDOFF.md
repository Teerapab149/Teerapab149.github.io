# HANDOFF — เว็บ portfolio (FMS Online Voting System)

> เขียน 2026-07-27 · สำหรับ Claude คนถัดไป และสำหรับเจ้าของโปรเจกต์
> อ่านไฟล์นี้ก่อนแตะอะไรทั้งสิ้น แล้วค่อยดู `CLAUDE.md` (กติกา) และ `docs/CONTENT-SOURCE.md` (ข้อเท็จจริงทั้งหมด)

---

## 0. หนึ่งย่อหน้าว่าโปรเจกต์นี้คืออะไร

เว็บหน้าเดียว (static) ที่เป็น **case study ของโปรเจกต์ FMS Online Voting System** สำหรับให้ HR
และคนที่สนใจจ้างงานเข้ามาดู เจ้าของคือ **Teerapab Boonsri** นักศึกษา/ผู้พัฒนา คณะวิทยาการจัดการ
ม.สงขลานครินทร์ เป้าหมายของหน้านี้คือแสดงให้เห็นสองอย่างพร้อมกัน — **ออกแบบระบบเป็น** และ
**ทำ UX/UI เป็น** เพราะเจ้าของมองว่างาน UI ของระบบเลือกตั้งนั้นเป็นจุดแข็งที่ไม่ควรถูกมองข้าม

ไม่มี build step ไม่มี framework ไม่มี dependency — HTML + CSS + JS ล้วน เพื่อให้ deploy ฟรีได้ทุกที่
และให้คนที่มารับช่วงต่ออ่านออกทันที

---

## 1. สถานะปัจจุบัน (2026-07-27)

| ส่วน | สถานะ |
|---|---|
| หน้าเว็บ `index.html` ครบ 9 หัวข้อ + hero + footer | ✅ เสร็จ |
| CSS design system (`assets/style.css`) | ✅ เสร็จ |
| JS: gallery แท็บ 6 ตระกูล, กริด 23 ธีม, mobile strip, lightbox, scroll-spy | ✅ เสร็จ |
| ภาพ 108 ไฟล์ (webp, 11MB) ใน `assets/img/` | ✅ ครบ |
| ตรวจ responsive 1440 / 1024 / 768 / 390 / 360 px — ไม่มี horizontal overflow | ✅ ผ่าน |
| console error / รูปเสีย | ✅ ไม่มี |
| GitHub Actions deploy workflow | ✅ เขียนไว้แล้ว ยังไม่ได้รัน |
| **push ขึ้น GitHub + เปิด Pages** | ❌ **ยังไม่ทำ — เจ้าของต้องเป็นคนสั่งเอง (ดู §4)** |
| ลิงก์ GitHub / LinkedIn / อีเมล ใน footer | ✅ ครบแล้ว |
| โปรเจกต์อื่นนอกจาก FMS-OVS | ❌ ยังไม่มี ตอนนี้เป็น case study เดี่ยว |

**ยังไม่เคย commit ขึ้น remote ใด ๆ** — repo นี้ init ไว้ในเครื่องแล้วเท่านั้น

---

## 2. แผนที่ไฟล์

```
portfolio-teerapab/
├── index.html               ← เนื้อหาทั้งหมดอยู่ที่นี่ไฟล์เดียว
├── serve.js                 ← static server สำหรับพรีวิว (node serve.js → :4173)
├── assets/
│   ├── style.css            ← design system ทั้งหมด (ตัวแปรอยู่บนสุด)
│   ├── app.js               ← gallery + lightbox + scroll-spy (vanilla, ไม่มี dep)
│   └── img/
│       ├── desktop/01-original … 06-receipt/   6 ตระกูล × 9 หน้า
│       ├── mobile/01-original … 06-receipt/    6 ตระกูล × 4 หน้า
│       ├── themes/01 … 23                      ทุกธีม หน้าแรก
│       └── admin/1 … 7                         หน้า admin
├── docs/
│   ├── HANDOFF.md           ← ไฟล์นี้
│   └── CONTENT-SOURCE.md    ← ข้อเท็จจริงทุกตัวเลขที่ใช้ในหน้าเว็บ + เวอร์ชันสั้นสำหรับ resume/LinkedIn
├── CLAUDE.md                ← กติกาสำหรับ AI ที่มาทำต่อ
├── README.md
└── .github/workflows/deploy.yml
```

**หลักสำคัญ:** รายการภาพใน gallery ถูกประกาศเป็น array บนหัวไฟล์ `assets/app.js`
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

**คำสั่งที่เจ้าของต้องรันเอง** (AI ไม่ควร push แทน เพราะเป็นการเผยแพร่สู่สาธารณะ):

```bash
gh repo create portfolio --public --source=. --remote=origin --push
```

จากนั้นเปิด repo บน GitHub → **Settings → Pages → Build and deployment → Source = GitHub Actions**
รอ workflow รันจบ เว็บจะอยู่ที่ `https://<username>.github.io/portfolio/`

> ถ้าตั้งชื่อ repo เป็น `<username>.github.io` เว็บจะอยู่ที่ root domain เลย ไม่มี subpath —
> **แนะนำแบบนี้** เพราะลิงก์สั้นกว่าและไม่ต้องกังวลเรื่อง path ของรูป

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

1. **[เจ้าของ] push + เปิด GitHub Pages** ตาม §4 — นี่คือสิ่งเดียวที่ขวางไม่ให้ HR เข้าดูได้
2. ~~**[เจ้าของ] ให้ URL GitHub / LinkedIn**~~ ✅ เสร็จ 2026-07-27 — footer มีครบสามช่องทางแล้ว:
   `Teerapab.bs@gmail.com` · `github.com/Teerapab149` ·
   `linkedin.com/in/teerapab-boonsri-bb2404394`
   (อีเมลติดต่อของเจ้าของคือ **Teerapab.bs@gmail.com** ไม่ใช่อันที่ผูกกับ git)
3. **ปีการศึกษาในภาพเป็น 2570 / SAMO 50** เพราะเป็นข้อมูลจำลองของหน้าพรีวิว ไม่ใช่ SAMO 49 ที่เล่าในเนื้อหา
   ถ้าอยากให้ตรงกัน: แก้ `src/utils/editorDummyData.js` ในโปรเจกต์ต้นทาง แล้วแคปใหม่ (ดู §7)
4. **สถานะ deploy ของระบบเลือกตั้ง** — หัวข้อ "บันทึกตรงไปตรงมา" เขียนว่ายังไม่ deploy จริง
   ถ้าขึ้น production แล้วต้องกลับมาแก้ประโยคนั้นและเปลี่ยนเป็น "ใช้งานจริงแล้ว"
5. **ยังไม่มีภาพไดอะแกรม** — สถาปัตยกรรมกับ ballot lifecycle ตอนนี้วาดด้วย CSS ในหน้าเว็บเลย
   (ดีอยู่แล้ว ไม่ต้องมีภาพก็ได้) แต่ถ้าจะทำ OG image สวย ๆ ต้องวาดแยก
6. **`og:image` / `og:url` ตั้งเป็น `https://teerapab149.github.io/portfolio/` ไว้แล้ว**
   ซึ่งตรงกับ repo ชื่อ `portfolio` ตามคำสั่งใน §4 — **ถ้าตั้งชื่อ repo เป็นอย่างอื่น
   (เช่น `Teerapab149.github.io`) ต้องแก้สองบรรทัดนี้ใน `<head>` ของ `index.html`**
   ไม่งั้นแชร์ลิงก์แล้วภาพพรีวิวจะไม่ขึ้น
7. **เวอร์ชันภาษาอังกฤษ** — ตอนนี้เป็นไทยล้วน ถ้าจะสมัครงานต่างชาติต้องทำ `en/index.html`
   หรือทำสวิตช์ภาษา (เนื้อหาภาษาอังกฤษบางส่วนมีใน `docs/CONTENT-SOURCE.md` ข้อ 12 แล้ว)
8. **เพิ่มโปรเจกต์อื่น** — โครงหน้าออกแบบมาให้เป็น case study เดี่ยว ถ้าจะเพิ่มโปรเจกต์ที่ 2
   ควรทำหน้า index รวมแยก แล้วให้หน้านี้กลายเป็น `projects/fms-ovs.html`

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
4. แก้แล้วต้องทดสอบ responsive 5 ความกว้างตามข้อ §8.2 ทุกครั้ง และแปะผลจริงให้เจ้าของดู
   ห้ามบอกแค่ว่า "ตรวจแล้วผ่าน"
