# Anniversary Site — 🐸 ♡ congchuacuaanh 👑

Website kỷ niệm 1 năm, ngày bắt đầu **10/10/2025**.

Bản này là **functional placeholder version**: đã có đầy đủ layout và interaction để chạy thử trước khi thay 100–500+ ảnh thật.

## 1. Yêu cầu máy

Khuyến nghị cài:

- **Node.js 20 LTS** hoặc mới hơn
- **VS Code**
- Git (không bắt buộc để chạy local)

Kiểm tra Node:

```bash
node -v
npm -v
```

Nếu máy chưa có Node.js, tải từ trang chính thức Node.js và cài bản LTS.

---

## 2. Mở project trong VS Code

### Cách 1

Giải nén thư mục `anniversary-site`, sau đó:

1. Mở VS Code.
2. Chọn **File → Open Folder...**
3. Chọn thư mục `anniversary-site`.
4. Trong VS Code chọn **Terminal → New Terminal**.

### Cách 2

Mở terminal tại thư mục project rồi chạy:

```bash
code .
```

---

## 3. Cài dependencies

Trong terminal của VS Code:

```bash
npm install
```

Chỉ cần chạy lại khi `package.json` thay đổi hoặc bạn xóa `node_modules`.

---

## 4. Chạy website local

```bash
npm run dev
```

Vite sẽ in ra địa chỉ tương tự:

```text
Local: http://localhost:5173/
```

Giữ terminal đang chạy và mở địa chỉ đó bằng Chrome/Edge.

Dừng server bằng:

```text
Ctrl + C
```

---

## 5. Build production

```bash
npm run build
```

Nếu thành công sẽ tạo thư mục:

```text
dist/
```

Test bản build:

```bash
npm run preview
```

---

# 6. Các section đã có

```text
Start / Chạm để bắt đầu
↓
Hero — One year with you
↓
Modern Scrapbook
↓
Memory Universe
↓
Photo Heart — ảnh hợp thành trái tim
↓
Memory Wall
↓
Love Letter
↓
Finale
```

Có thêm:

- popup xem ảnh lớn;
- phím trái/phải để đổi ảnh;
- Esc để đóng viewer;
- Random memory;
- music toggle;
- responsive mobile/desktop;
- reduced-motion support.

---

# 7. Ảnh placeholder hiện tại

Ảnh demo nằm tại:

```text
public/images/placeholders/
```

Bản demo có 120 SVG placeholder để mô phỏng nhiều ảnh mà không cần tải ảnh Internet.

Metadata hiện nằm tại:

```text
src/data/photos.ts
```

---

# 8. Sau này thay bằng ảnh thật như thế nào?

Không nên copy 500 ảnh gốc trực tiếp rồi sửa code thủ công.

Luồng đề xuất ở bản thật:

```text
ảnh gốc
→ script resize
→ thumbnail WebP
→ display WebP
→ photos.json / photos.ts
→ website tự load
```

Cấu trúc dự kiến:

```text
public/images/
├── thumbs/
│   ├── 001.webp
│   ├── 002.webp
│   └── ...
└── display/
    ├── 001.webp
    ├── 002.webp
    └── ...
```

Khi bạn gửi toàn bộ ảnh, bước tiếp theo nên làm một script tự động xử lý ảnh và sinh metadata để không phải nhập từng file.

---

# 9. Thay nội dung lá thư

Mở:

```text
src/components/LoveLetter.tsx
```

Tìm phần:

```tsx
<p>Phần này đang để nội dung mẫu...</p>
```

và thay bằng nội dung thật của bạn.

Ví dụ:

```tsx
<p>Đoạn 1...</p>
<p>Đoạn 2...</p>
<p>Đoạn 3...</p>
```

---

# 10. Thêm nhạc

Project đang tìm file:

```text
public/music/our-song.mp3
```

Chỉ cần đặt file nhạc của bạn vào đúng đường dẫn này.

Tên chính xác:

```text
our-song.mp3
```

Nhạc chỉ được play sau khi user bấm **Chạm để bắt đầu**.

Nếu chưa có file nhạc, website vẫn chạy; browser chỉ không phát audio.

---

# 11. Đổi text

Các phần chính nằm trong:

```text
src/components/StartScreen.tsx
src/components/Hero.tsx
src/components/Scrapbook.tsx
src/components/MemoryUniverse.tsx
src/components/PhotoHeart.tsx
src/components/LoveLetter.tsx
src/components/Finale.tsx
```

---

# 12. Đổi màu / style

Mở:

```text
src/styles.css
```

Các màu chính ở đầu file:

```css
--bg-primary: #fff8f8;
--bg-soft: #fdecef;
--pink-primary: #f4a9b8;
--pink-accent: #e77e95;
--text-primary: #493a3d;
```

---

# 13. Cấu trúc source

```text
anniversary-site/
│
├── public/
│   ├── images/
│   │   └── placeholders/
│   └── music/
│
├── src/
│   ├── components/
│   │   ├── StartScreen.tsx
│   │   ├── Hero.tsx
│   │   ├── Scrapbook.tsx
│   │   ├── MemoryUniverse.tsx
│   │   ├── PhotoHeart.tsx
│   │   ├── MemoryWall.tsx
│   │   ├── LoveLetter.tsx
│   │   ├── Finale.tsx
│   │   ├── MusicControl.tsx
│   │   └── PhotoViewer.tsx
│   │
│   ├── data/
│   │   └── photos.ts
│   ├── utils/
│   │   └── heart.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 14. Deploy sau này

Sau khi hoàn thiện ảnh thật:

```bash
npm run build
```

Thư mục cần deploy là:

```text
dist/
```

Có thể deploy miễn phí lên Cloudflare Pages.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

---

# 15. Bước tiếp theo nên làm

Sau khi bạn chạy bản placeholder này và thấy flow ổn:

1. Upload toàn bộ ảnh thật.
2. Tạo pipeline xử lý 100–500+ ảnh.
3. Tự động sinh thumbnail + display image.
4. Thay placeholder bằng ảnh thật.
5. Chọn 5–15 ảnh nổi bật cho Hero/Scrapbook.
6. Tinh chỉnh Photo Heart theo số lượng ảnh thực tế.
7. Thêm nhạc.
8. Thêm lá thư.
9. Test mobile.
10. Deploy Cloudflare Pages và gửi link.
