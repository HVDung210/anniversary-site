# Anniversary Website — Project Specification

## 1. Project Overview

Website kỷ niệm 1 năm yêu nhau.

- Ngày bắt đầu: **10/10/2025**
- Ngày kỷ niệm 1 năm: **10/10/2026**
- Nhân vật:
  - Người gửi: **🐸**
  - Người nhận: **congchuacuaanh 👑**
- Số lượng ảnh dự kiến: **100–500+**
- Ảnh gồm cả ảnh ngang và ảnh dọc.
- Có nhạc nền.
- Có màn hình **“Chạm để bắt đầu”**.
- Có một **lá thư ở cuối website**, nội dung sẽ bổ sung sau.
- Ưu tiên trải nghiệm trên điện thoại nhưng phải đẹp trên desktop.
- Website sẽ được deploy online để gửi bằng một đường link.

---

# 2. Creative Direction

## Concept

Kết hợp:

- **Concept A — Photo Heart / Memory Mosaic**
- **Concept C — Modern Scrapbook**
- Một chút **Concept B — Memory Universe**

## Style

**Cute + Modern + Refined**

Không làm:

- quá nhiều màu hồng đậm;
- quá nhiều sticker;
- quá Valentine;
- quá trẻ con;
- animation dày đặc gây rối;
- hiệu ứng flashy/neon.

Ưu tiên:

- nhẹ nhàng;
- pastel;
- hiện đại;
- nhiều khoảng trắng;
- typography tinh tế;
- chuyển động mềm;
- ảnh là nhân vật chính.

---

# 3. Visual Design System

## Main colors

```css
--bg-primary: #FFF8F8;
--bg-soft: #FDECEF;
--pink-primary: #F4A9B8;
--pink-accent: #E77E95;
--text-primary: #493A3D;
--card: #FFFFFF;
```

Có thể tinh chỉnh sau khi đặt ảnh thật vào giao diện.

## Graphic motifs

Chỉ dùng vừa phải:

- `♡`
- `✦`
- `🐸`
- `👑`
- Polaroid
- paper texture
- washi tape
- tiny sparkles
- tiny flower petals

## Typography

Gợi ý:

- Heading: serif thanh lịch
- Body: modern sans-serif
- Handwriting accent: chỉ dùng cho note / signature / một vài caption

Không dùng handwriting cho nội dung dài.

---

# 4. Website Structure

Website là một trải nghiệm scroll liên tục.

Không dùng navigation menu kiểu website truyền thống:

- Home
- About
- Gallery
- Contact

Có thể chỉ giữ:

- Music toggle
- Progress indicator
- Replay ở cuối

---

# 5. Storyboard

## SECTION 01 — ENTRY / TOUCH TO START

### Nội dung

```text
🐸 ♡ congchuacuaanh 👑

10.10.2025

365 days, and still counting...

[ Chạm để bắt đầu ♡ ]

A little place for us
```

### Visual

- nền cream / blush rất nhẹ;
- heart glow lớn ở background;
- frog + crown là visual identity;
- floating hearts / petals cực ít;
- không dùng ảnh thật ngay lập tức.

### Animation

Idle:

- heart breathing nhẹ;
- sparkle chậm;
- CTA scale khoảng 1–2%.

On tap:

1. CTA press
2. ripple / soft pink glow
3. music fade-in
4. scene dissolve
5. chuyển sang Hero

### Technical note

Audio chỉ bắt đầu sau interaction của user để tránh browser autoplay restriction.

---

# 6. SECTION 02 — HERO / ONE YEAR WITH YOU

### Content

```text
One year with you.

10.10.2025 — 10.10.2026

Có rất nhiều thứ anh không nhớ được ngày tháng...
nhưng may là chúng ta đã giữ lại bằng ảnh.
```

### Layout

- 1 ảnh hero lớn
- 2–4 ảnh phía sau
- layout Polaroid / floating cards
- depth nhẹ

### Motion

Khi scroll:

- hero image scale xuống;
- background cards tách dần;
- transition tự nhiên sang scrapbook.

---

# 7. SECTION 03 — MODERN SCRAPBOOK

## Heading

```text
Những điều mình đã giữ lại

little moments, big memories
```

## Content

Các cụm ảnh:

- 3–7 ảnh / composition
- mix ảnh ngang + dọc
- Polaroid + borderless photo
- không cần timeline ngày tháng

## Decoration

Có thể dùng:

```text
our favorite moments ♡
still choosing you ♡
every photo matters ♡
```

Sticker:

- 🐸
- 👑
- tiny heart
- tape
- sparkle

## Animation

Mỗi cụm:

- fade up
- translate 20–40px
- rotation settle khoảng ±2–5°
- stagger nhẹ

Không dùng fly-in mạnh.

---

# 8. SECTION 04 — TRANSITION / THE REVEAL

## Copy

```text
...nhưng đó mới chỉ là một vài tấm thôi.

Còn rất nhiều.
```

## Animation sequence

1. màn hình ban đầu chỉ có một vài ảnh;
2. thumbnail bắt đầu xuất hiện phía sau;
3. 10 → 30 → 50+ ảnh;
4. text fade;
5. camera / scene zoom out;
6. reveal Memory Universe.

Đây là đoạn buildup cho centerpiece.

---

# 9. SECTION 05 — MEMORY UNIVERSE

## Goal

Tạo cảm giác đang đi xuyên qua không gian ký ức.

## Visual

Ảnh chia thành depth layers:

- foreground: ảnh lớn, rõ;
- middle: ảnh trung bình;
- background: nhỏ + opacity thấp.

Background:

- blush pink;
- cream;
- rất ít lavender glow.

Có thể thêm:

- curved light path;
- tiny sparkle;
- small translucent bubble;
- frog easter egg.

## Motion

Desktop:

- parallax mạnh hơn;
- hover depth;
- mouse movement nhẹ.

Mobile:

- scroll-driven depth;
- animation giảm;
- tránh quá nặng GPU.

---

# 10. SECTION 06 — MAIN EVENT / PHOTO HEART

## Main copy

```text
365 days.

Hundreds of memories.
One congchuacuaanh.

chạm vào từng kỷ niệm ♡
```

## Core Experience

**100–500+ ảnh cùng tạo thành một trái tim lớn.**

Đây là centerpiece quan trọng nhất của website.

## States

### State 1 — Far

Người xem thấy hình trái tim rõ ràng.

### State 2 — Medium

Nhận ra trái tim được tạo từ rất nhiều ảnh nhỏ.

### State 3 — Interactive

Hover / tap một ảnh:

- tile lift;
- scale;
- shadow;
- mở full image viewer.

## Fullscreen Viewer

Hỗ trợ:

- swipe left/right;
- previous/next;
- close;
- keyboard arrow trên desktop;
- Esc để đóng.

## Reveal animation

Trước khi tạo heart:

- thumbnail đang floating;
- tất cả cùng di chuyển;
- settle theo tọa độ trái tim;
- overshoot cực nhẹ;
- final heart glow.

Sau khi heart hoàn thành:

```text
365 days.
Hundreds of memories.
One congchuacuaanh. 👑

🐸 ♡ 👑
```

Có khoảng nghỉ 1–2 giây để tạo payoff.

---

# 11. SECTION 07 — MEMORY WALL

Sau heart reveal, ảnh bung ra thành gallery.

## Layout

Masonry / Pinterest-inspired.

Ảnh:

- ảnh dọc giữ ratio;
- ảnh ngang giữ ratio;
- không crop bản full khi xem.

## Interaction

- tap → fullscreen viewer
- lazy-load ảnh

## Optional interaction

Button:

```text
Random memory ♡
```

Mỗi lần nhấn:

- chọn random một ảnh;
- mở ảnh fullscreen.

---

# 12. SECTION 08 — QUIET TRANSITION

Sau gallery:

- ảnh fade dần;
- background trở lại cream;
- music giảm volume nhẹ;
- visual trở nên tối giản.

Giữa màn hình xuất hiện phong thư.

```text
For congchuacuaanh 👑

from 🐸
```

User phải tap envelope.

---

# 13. SECTION 09 — LOVE LETTER

## Interaction

Tap envelope:

1. envelope opens;
2. paper slides upward;
3. letter view activates.

## Header

```text
Gửi congchuacuaanh,
```

## Body

Placeholder trong giai đoạn development.

Nội dung thật sẽ được cập nhật sau.

## Signature

```text
Love,
🐸

10.10.2026
```

## Design

- giấy trắng/cream;
- letter texture nhẹ;
- background blur;
- rất ít decoration;
- ưu tiên đọc.

Không dùng typewriter cho toàn bộ thư.

Có thể dùng:

- fade line-by-line;
- scroll reveal nhẹ.

---

# 14. SECTION 10 — FINALE

## Visual

🐸 từ trái.

👑 từ phải.

Hai icon tiến lại gần.

Heart ở giữa fill pink.

## Copy option

### Option A

```text
1 year down ♡
a lifetime of memories to go.
```

### Option B

```text
Một năm rồi đó.
Còn rất nhiều kỷ niệm đang chờ chúng ta. ♡
```

## Final mark

```text
🐸 ♡ 👑

10.10.2025 → ∞
```

## Final controls

```text
↻ Xem lại từ đầu

♫ Music
```

Optional:

- heart confetti 2–3 giây;
- không loop.

---

# 15. Responsive Strategy

## Mobile First

Target chính:

- iPhone
- Android

Thiết kế ưu tiên:

- portrait;
- touch;
- vertical scroll;
- swipe gallery;
- tap interactions.

## Desktop Enhancement

Desktop có thêm:

- nhiều ảnh cùng lúc;
- hover;
- stronger parallax;
- mouse interaction;
- mosaic lớn hơn.

Không tạo hai website riêng.

---

# 16. Image Processing Strategy

Với 100–500+ ảnh, không load full-resolution ngay.

Mỗi ảnh nên tạo tối thiểu:

```text
thumbnail
display
original (optional)
```

## Suggested sizes

### Thumbnail

- khoảng 250–400 px
- WebP / AVIF
- dùng cho mosaic, universe

### Display

- khoảng 1200–1800 px cạnh dài
- dùng fullscreen viewer

### Original

Không nhất thiết deploy nếu display version đã đủ đẹp.

## Loading

- lazy loading;
- preload ảnh cần ngay;
- dynamic import metadata;
- fullscreen ảnh mới tải bản display.

---

# 17. Suggested Project Structure

```text
anniversary-site/
│
├── public/
│   ├── images/
│   │   ├── thumbs/
│   │   └── display/
│   │
│   ├── music/
│   │   └── our-song.mp3
│   │
│   └── icons/
│
├── src/
│   ├── components/
│   │   ├── StartScreen
│   │   ├── Hero
│   │   ├── Scrapbook
│   │   ├── MemoryUniverse
│   │   ├── PhotoHeart
│   │   ├── MemoryWall
│   │   ├── LoveLetter
│   │   ├── Finale
│   │   ├── MusicControl
│   │   └── PhotoViewer
│   │
│   ├── data/
│   │   └── photos.json
│   │
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   └── App
│
├── scripts/
│   └── process-images
│
└── README.md
```

---

# 18. Recommended Frontend Stack

Recommended:

```text
React
Vite
TypeScript
CSS / Tailwind CSS
Framer Motion
GSAP (only for advanced scroll choreography)
```

Potential additional technology:

- CSS Masonry / grid
- Canvas or DOM-based photo heart
- Web Worker nếu cần tính layout ảnh nặng

Không cần backend ở phiên bản đầu tiên.

---

# 19. Animation Strategy

## Framer Motion

Dùng cho:

- section reveal;
- card hover;
- envelope;
- modal;
- buttons;
- UI transitions.

## GSAP / ScrollTrigger

Chỉ dùng cho:

- Memory Universe;
- hundreds-of-images heart formation;
- complex scroll choreography.

Không dùng GSAP cho mọi animation.

---

# 20. Performance Requirements

Target:

- mobile usable với 500 ảnh;
- initial page không load toàn bộ ảnh lớn;
- animation không drop frame nghiêm trọng;
- giảm hiệu ứng với thiết bị yếu;
- hỗ trợ `prefers-reduced-motion`.

Các ảnh mosaic nên ưu tiên thumbnail.

---

# 21. Music

Requirements:

- không autoplay trước interaction;
- start sau “Chạm để bắt đầu”;
- fade-in;
- music toggle luôn accessible;
- volume mặc định vừa phải;
- giữ playback xuyên suốt page.

Track sẽ chọn sau.

---

# 22. Privacy / Hosting

Recommended first version:

**Public via secret/unlisted URL.**

Không index SEO.

Có thể thêm:

```html
<meta name="robots" content="noindex,nofollow">
```

Deploy gợi ý:

- Cloudflare Pages

URL ví dụ:

```text
our-365-days.pages.dev
```

Có thể dùng custom domain sau.

Frontend PIN chỉ mang tính trải nghiệm, không phải security thực sự.

---

# 23. Photo Metadata

Sau khi upload ảnh, generate:

```json
[
  {
    "id": 1,
    "thumb": "/images/thumbs/001.webp",
    "src": "/images/display/001.webp",
    "width": 1080,
    "height": 1440,
    "orientation": "portrait"
  }
]
```

Không cần caption cho từng ảnh.

---

# 24. User-provided Assets Still Needed

## Required

- toàn bộ ảnh;
- bài hát / file nhạc hoặc lựa chọn bài hát;
- nội dung love letter.

## Optional

- favicon;
- custom domain;
- một vài ảnh user muốn ưu tiên làm hero.

---

# 25. Development Phases

## Phase 1 — Approved

- concept
- visual direction
- storyboard
- main interaction

## Phase 2 — Scaffold

Tạo project chạy được với ảnh placeholder:

- Start
- Hero
- Scrapbook
- Universe
- Heart
- Gallery
- Letter
- Finale

## Phase 3 — Photo Pipeline

Sau khi nhận ảnh:

- sort;
- detect dimensions;
- generate thumbnails;
- optimize;
- create metadata JSON.

## Phase 4 — Real Content

Thay placeholder bằng ảnh thật.

Chọn:

- hero photo;
- scrapbook highlights;
- random memories.

## Phase 5 — Polish

- animation timing;
- responsiveness;
- performance;
- music;
- letter.

## Phase 6 — Deploy

- production build;
- Cloudflare Pages;
- noindex;
- test desktop/mobile;
- share URL.

---

# 26. Definition of Done

Website hoàn thành khi:

- có màn Chạm để bắt đầu;
- nhạc chạy sau interaction;
- responsive mobile + desktop;
- toàn bộ ảnh xuất hiện trong hệ thống;
- heart mosaic chứa toàn bộ / gần toàn bộ ảnh;
- tap ảnh mở fullscreen;
- có memory gallery;
- có letter interaction;
- có finale;
- performant với hàng trăm ảnh;
- deploy được qua link;
- design vẫn giữ đúng style:
  **Cute + Modern + Refined**.

---

# 27. Current Decision

**Design status: APPROVED**

Next step:

> Build a functional placeholder version of the website based on this specification before inserting the real image collection.
