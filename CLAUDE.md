# CLAUDE.md — เว็บ portfolio (static)

**อ่าน `docs/HANDOFF.md` ก่อนเสมอ** ไฟล์นี้เป็นแค่กติกาสั้น ๆ ที่ห้ามลืม

## โปรเจกต์นี้คืออะไร

เว็บพอร์ตโฟลิโอ static (HTML + CSS + JS ล้วน ไม่มี build ไม่มี dependency) สำหรับให้ HR เข้ามาดู
เจ้าของ: Teerapab Boonsri · **ธีมสว่าง**

**ภาษาของเว็บเป็นอังกฤษทั้งหมด** (เจ้าของสั่งเมื่อ 2026-07-30)
· **เอกสารใน repo (`docs/`, `README.md`, ไฟล์นี้) ยังเป็นไทย** เพราะเขียนให้เจ้าของกับ Claude อ่าน
ไม่ใช่ให้ HR อ่าน

สี่หน้า ทุกหน้าอยู่ที่ root (path รูปจึงเป็น `assets/...` เหมือนกันหมด):

| ไฟล์ | คืออะไร | CSS | JS |
|---|---|---|---|
| `index.html` | หน้าแรก **Verdure** · จอแรกเป็น cover About me (แผงมอสเต็มจอ ดู HANDOFF §13) แล้วค่อย hero → capsule → 3 โปรเจกต์ | verdure | verdure |
| `fms-election.html` | case study ระบบเลือกตั้ง | style | app |
| `megubot.html` | case study บอต Discord — **เจ้าของออกแบบ เพื่อนเขียนโค้ด** ต้องบอกให้ชัดเสมอ | style | motion |
| `credit-tracker.html` | case study ระบบติดตามหน่วยกิต | style | motion |
| `psu-chatbot.html` | case study แชตบอตบน Azure | style | motion |

**หน้าแรกแบบ A (ม่วง/เทา) ถูกลบแล้ว 2026-07-30** — เจ้าของเลือก Verdure
`index-verdure.html` ถูก mv มาเป็น `index.html` และลบ `assets/home.css` ทิ้งด้วยเพราะมีแต่แบบ A ที่ใช้
· ตัวไฟล์แบบ A ไม่เคยถูก commit จึง**สำรองไว้ที่ scratchpad ของ session นั้น** (`variant-A-backup/`)
ถ้าเลย session นั้นไปแล้วก็ถือว่าหายไปเลย — อย่าไปตามหาใน git history

**ทั้งเว็บใช้พาเลตต์ Verdure ชุดเดียวกันแล้ว** — `verdure.css` (หน้าแรก) กับ `style.css` (case study)
เป็นไฟล์แยกกันแต่ **token สีต้องตรงกันเป๊ะ** ถ้าแก้สีที่ไฟล์ไหนต้องแก้อีกไฟล์ตามด้วย
ไม่งั้นสองฝั่งของเว็บจะเพี้ยนกัน · `verdure.css` ไม่ได้โหลด `style.css` และกลับกันด้วย

**สีของ Verdure ห้ามแก้เอง** — ลอกมาจาก
`E:/fms-election/fms_election69/src/utils/verdurePalettes.js` → `VERDURE_THEMES.verdure`
(cream `#FDFBF7` · moss `#1B362B` · terra `#722F55` · gold `#B8895A` · rule `#E6DFD2`)
มันคือ identity ของ template ที่เจ้าของชอบ ไม่ใช่ค่าที่ตั้งมาลอย ๆ

**เจ้าของ preferred สาย Analyst / Management มากกว่าสาย dev** — ถ้าเขียนเนื้อหาใหม่
ต้องรักษาลำดับนี้ไว้: System Analyst · Business Analyst มาก่อน แล้ว Management Trainee
แล้วค่อยสาย Front-end / Full-stack / Web dev

## กติกาที่ละเมิดไม่ได้

1. **ห้ามเพิ่ม dependency / build step** — ไม่มี npm install ไม่มี bundler
   ข้อยกเว้นเดียวคือ Google Fonts ที่โหลดจาก CDN
2. **path ต้องเป็น relative เสมอ** (`assets/...` ไม่ใช่ `/assets/...`)
   เพราะ GitHub Pages อาจเสิร์ฟใต้ subpath
3. **ห้ามซ่อนเนื้อหาไว้หลัง JS** — ห้าม `opacity: 0` รอ scroll reveal
   ถ้า JS พัง เนื้อหาหลักต้องยังอ่านได้ครบ
   · วิธีที่ใช้อยู่: start state ของ `.reveal` อยู่ใต้ `.js-anim` เท่านั้น
     และคลาสนั้นถูกใส่ด้วย inline script ใน `<head>` — ถ้าบรรทัดนั้นไม่รัน ทุกอย่างจะแสดงปกติ
   · **เพิ่ม reveal ใหม่ต้องเขียนใต้ `.js-anim` เสมอ** ห้ามใส่ `opacity:0` ลอย ๆ
4. **body ห้าม scroll แนวนอน** — ทดสอบที่ 1440 / 1024 / 768 / 390 / 360 px ทุกครั้งที่แก้ layout
5. **ประโยคภาษาไทยห้ามลงท้ายด้วยจุด** — ใช้กับเอกสารใน repo
   ส่วนเนื้อหาเว็บเป็นภาษาอังกฤษหมดแล้ว ใส่จุดท้ายประโยคตามปกติ
6. **ห้ามแต่งตัวเลข** — ทุกตัวเลขต้องมีที่มาใน `docs/CONTENT-SOURCE.md` §5 ของ HANDOFF
   ถ้าไม่แน่ใจ ไปนับใหม่จาก repo ต้นทาง หรือถามเจ้าของ
   · ระบบเลือกตั้ง → `E:/fms-election/fms_election69`
   · Credit Tracker → `E:/psucredit-project-main`
   · Chatbot → ไม่มี repo ในเครื่อง ตัวเลขมาจากสไลด์นำเสนอเท่านั้น
7. **ห้าม push / deploy แทนเจ้าของ** — การเผยแพร่สู่สาธารณะต้องให้เจ้าของสั่งเอง
   เตรียมคำสั่งให้เขารันได้ แต่อย่ารันเอง

## Design system

ตัวแปรอยู่บนสุดของสองไฟล์: `assets/verdure.css` (หน้าแรก) และ `assets/style.css` (case study)
**ค่าสีของสองไฟล์ต้องตรงกัน** — cream `#F7F4ED` · moss `#1B362B` · moss-3 `#3A5E4D`
· moss-4 `#4F6959` · honey-ink `#7D6228` (สีเดียวในตระกูลทองที่ใส่กับตัวหนังสือได้)
· honey `#C5A059` (ประดับเท่านั้น 3.1:1) · rule `#DED5C3`

เกณฑ์: ≤3 ระดับ type ต่อวิว · จังหวะ 4/8px · ≤3 สีต่อวิว · motion 150-300ms และเคารพ
`prefers-reduced-motion` · ทุกหน้าตอบได้ใน 1 วินาทีว่าเป็นหน้าอะไร

**contrast ต้อง ≥4.5:1 สำหรับตัวเล็ก และ ≥3:1 สำหรับตัวใหญ่ ทุกคู่สี** — วัดจริงก่อนเชื่อคอมเมนต์
ในไฟล์ (เคยมีคอมเมนต์บอก 4.5 แต่วัดได้ 4.3) · สีที่มี alpha ต้อง**ผสมทับพื้นก่อนวัด**
ไม่ใช่วัดจากค่าสีเปล่า ๆ

## รสนิยมเจ้าของ

โมเดิร์น รุ่นใหม่ ไม่ทางการ · ไม่เอาความราชการ เลขไทย serif เก่า 3D particle
· **ห้าม rewrite ส่วนที่เจ้าของบอกว่าชอบแล้ว — ดีไซน์ใหม่ให้ทำไฟล์ใหม่แยก**

## รันดู

```bash
node serve.js
```
