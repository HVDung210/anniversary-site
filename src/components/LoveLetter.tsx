import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function LoveLetter() {
  const [open, setOpen] = useState(false);
  return (
    <section className="section letter-section" id="letter">
      <div className="section-inner letter-inner">
        <div className="section-heading centered">
          <div className="eyebrow">A LETTER FOR YOU</div>
          <h2>For congchuacuaanh 👑</h2>
          <p>from 🐸</p>
        </div>
        <button className={`envelope ${open ? 'open' : ''}`} onClick={() => setOpen(true)} aria-label="Mở lá thư">
          <div className="envelope-back" />
          <div className="envelope-paper-preview">Gửi congchuacuaanh </div>
          <div className="envelope-front" />
          <div className="envelope-seal">♥</div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.article className="letter-paper" initial={{ opacity: 0, y: 120, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 17 }}>
              <div className="letter-label">— A LETTER FOR YOU —</div>
              <h3>Gửi congchuacuaanh,</h3>
              <p>Phần này đang để nội dung mẫu. Sau này bạn chỉ cần mở file <code>LoveLetter.tsx</code> và thay đoạn chữ này bằng lá thư thật của bạn.</p>
              <p>Có thể viết nhiều đoạn, xuống dòng thoải mái. Thiết kế sẽ giữ phần thư thật yên tĩnh để người đọc tập trung vào lời nhắn.</p>
              <p className="letter-sign">Love,<br /><strong>🐸</strong><br /><span>10.10.2026</span></p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
