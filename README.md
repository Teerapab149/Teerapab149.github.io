# Portfolio — Teerapab Boonsri

เว็บ case study หน้าเดียวของโปรเจกต์ **FMS Online Voting System** — ระบบเลือกตั้งออนไลน์
ของสโมสรนักศึกษา คณะวิทยาการจัดการ ม.สงขลานครินทร์

static ล้วน ไม่มี build step ไม่มี dependency — เปิดไฟล์ก็ทำงานได้ deploy ที่ไหนก็ได้ที่เสิร์ฟไฟล์ static

## รันดูในเครื่อง

```bash
node serve.js
```

เปิด `http://localhost:4173`

## Deploy

push ขึ้น GitHub แล้วเปิด Pages (Settings → Pages → Source = GitHub Actions)
workflow อยู่ที่ `.github/workflows/deploy.yml` publish ให้อัตโนมัติทุกครั้งที่ push เข้า `main`

```bash
gh repo create portfolio --public --source=. --remote=origin --push
```

Cloudflare Pages / Netlify / Vercel ก็ใช้ได้เหมือนกัน — ไม่ต้องตั้ง build command
กำหนด output directory เป็น root พอ

## โครงสร้าง

```
index.html            เนื้อหาทั้งหมด
assets/style.css      design system (ตัวแปรอยู่บนสุด)
assets/app.js         gallery + lightbox + scroll-spy
assets/img/           108 ภาพ (webp) — desktop / mobile / themes / admin
docs/HANDOFF.md       ⭐ อ่านก่อนแก้อะไร
docs/CONTENT-SOURCE.md ที่มาของทุกตัวเลขในหน้าเว็บ + เวอร์ชันสั้นสำหรับ resume/LinkedIn
CLAUDE.md             กติกาสำหรับ AI ที่มาทำต่อ
```

ภาพทั้งหมดถ่ายอัตโนมัติจากระบบจริงด้วย Playwright โดยชุด desktop/mobile/themes ใช้หน้าพรีวิว
ที่เป็นข้อมูลจำลองล้วน ไม่มีข้อมูลนักศึกษาจริง — สคริปต์แคปอยู่ในโปรเจกต์ต้นทาง
(`docs/portfolio-shots/_scripts/`)
