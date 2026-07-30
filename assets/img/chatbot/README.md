# ภาพของ PSU Chatbot

วางไฟล์ตามชื่อด้านล่างในโฟลเดอร์นี้ แล้วบอก Claude ว่า "ใส่รูป chatbot แล้ว"
เพื่อให้เปลี่ยน `<figure class="slot">` เป็น `<figure class="figure">` ให้อัตโนมัติ

ต้นทางของภาพทั้งหมดคือไฟล์ `PSU Chatbot presentation.pdf` (สไลด์นำเสนอ)

| ชื่อไฟล์ | ภาพอะไร | ใช้ที่ไหน |
|---|---|---|
| `01-hero.webp` | หน้าเว็บ PSU Chatbot พร้อมกล่องแชต (ธีมสว่าง) | `index.html` + หัวเรื่อง `psu-chatbot.html` |
| `02-dark.webp` | หน้าเว็บธีมมืด | `index.html` + §03 |
| `03-workflow.webp` | แผนภาพ System Workflow | §02 |
| `04-language-studio.webp` | หน้าจอ Language Studio ตอนสร้างคลังคำตอบ | §03 |
| `05-webchat-test.webp` | ทดสอบบอตใน Web Chat ของ Azure | `index.html` + §03 |
| `06-direct-line-key.webp` | หน้า Direct Line secret key ใน Azure Bot Service | §04 |

## ข้อกำหนดของไฟล์

- **นามสกุล `.webp`** — ถ้ามีแต่ PNG/JPG ให้ส่งมาได้เลย แล้วค่อยแปลง
- **กว้างไม่เกิน 1600px**
- **`06-direct-line-key.webp` ต้องปิดบัง key ก่อนเสมอ** — ภาพในสไลด์แสดง Direct Line secret key
  ซึ่งเป็นกุญแจที่ใช้คุยกับบอตแทนเราได้ · เบลอหรือทับให้มิดก่อนอัปโหลด
  ถ้า key ตัวจริงเคยหลุดออกไปแล้ว ควรกด regenerate ใหม่ใน Azure Bot Service ด้วย
