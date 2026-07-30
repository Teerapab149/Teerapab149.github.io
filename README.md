# Portfolio — Teerapab Boonsri

เว็บพอร์ตโฟลิโอส่วนตัว **ภาษาอังกฤษ** · ธีมสว่าง Verdure (ครีม/มอส/ทอง) ทั้งเว็บ
หน้าแรกเริ่มด้วย About me (ชื่อ ที่เรียน งานที่มองหา — System Analyst / Business Analyst เป็นหลัก)
แล้วแยกเป็น case study สามหน้า

1. **FMS Online Voting System** — ระบบเลือกตั้งสโมสรนักศึกษาที่ใช้งานจริง
2. **FMS Credit Tracker** — ระบบติดตามหน่วยกิตที่อ่านทรานสคริปต์ PDF เอง
3. **PSU Chatbot** — แชตบอตบน Azure ที่ deploy ขึ้นใช้งานจริง

static ล้วน ไม่มี build step ไม่มี dependency — เปิดไฟล์ก็ทำงานได้ deploy ที่ไหนก็ได้ที่เสิร์ฟไฟล์ static

## รันดูในเครื่อง

```bash
node serve.js
```

เปิด `http://localhost:4173`

## Deploy

repo อยู่ที่ https://github.com/Teerapab149/Teerapab149.github.io · เปิด Pages ครั้งเดียวที่
**Settings → Pages → Build and deployment → Source = GitHub Actions**
จากนั้นทุกครั้งที่ push เข้า `main` workflow ใน `.github/workflows/deploy.yml` จะ publish ให้เอง

เว็บจะอยู่ที่ https://teerapab149.github.io/

Cloudflare Pages / Netlify / Vercel ก็ใช้ได้เหมือนกัน — ไม่ต้องตั้ง build command
กำหนด output directory เป็น root พอ

## โครงสร้าง

```
index.html             หน้าแรก — Verdure ครีม/มอส/ทอง · เริ่มด้วย About me
fms-election.html      case study · ระบบเลือกตั้ง
credit-tracker.html    case study · ระบบติดตามหน่วยกิต
psu-chatbot.html       case study · แชตบอตบน Azure

assets/verdure.css     design system ของหน้าแรก ทั้งชุด (ไม่โหลด style.css)
assets/verdure.js      reveal + count-up + capsule ที่ขยายตอน scroll ของหน้าแรก
assets/style.css       design system ของ case study 3 หน้า (พาเลตต์ Verdure ชุดเดียวกัน)
assets/motion.js       scroll reveal + count-up + scroll-spy (credit-tracker, psu-chatbot)
assets/app.js          gallery + lightbox + scroll-spy ของหน้า fms-election

assets/img/            desktop / mobile / themes / admin — 108 ภาพจริงของระบบเลือกตั้ง
assets/img/me/         ⬜ ยังว่าง — รูปตัวเอง 1 รูปสำหรับ section About me
assets/img/credit/     ⬜ ยังว่าง — ดู README ในโฟลเดอร์ว่าต้องใส่ไฟล์ชื่ออะไรบ้าง
assets/img/chatbot/    ⬜ ยังว่าง — ดู README ในโฟลเดอร์ว่าต้องใส่ไฟล์ชื่ออะไรบ้าง

docs/HANDOFF.md        ⭐ อ่านก่อนแก้อะไร
docs/CONTENT-SOURCE.md ที่มาของทุกตัวเลขของระบบเลือกตั้ง + เวอร์ชันสั้นสำหรับ resume/LinkedIn
CLAUDE.md              กติกาสำหรับ AI ที่มาทำต่อ
```

## ภาพที่ยังขาด

section About me ของหน้าแรกแบบ B ยังรอ **รูปตัวเอง** อยู่ที่ `assets/img/me/portrait.webp`
(แนวตั้ง 4:5) — เป็นภาพแรกที่คนเห็นตอนเข้าเว็บ ควรใส่ก่อนภาพอื่น

หน้า Credit Tracker กับ PSU Chatbot ยังใช้ **กล่องเส้นประที่บอกชื่อไฟล์ที่รออยู่** แทนภาพจริง
วางไฟล์ตามชื่อใน `assets/img/credit/README.md` และ `assets/img/chatbot/README.md`
แล้วเปลี่ยน `<figure class="slot">…</figure>` เป็น `<figure class="figure"><img …></figure>`

ภาพของระบบเลือกตั้งถ่ายอัตโนมัติด้วย Playwright โดยชุด desktop/mobile/themes ใช้หน้าพรีวิว
ที่เป็นข้อมูลจำลองล้วน ไม่มีข้อมูลนักศึกษาจริง — สคริปต์แคปอยู่ในโปรเจกต์ต้นทาง
(`docs/portfolio-shots/_scripts/`)
