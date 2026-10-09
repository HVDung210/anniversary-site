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
              <p>Có lẽ cũng đã lâu rồi anh chưa ngồi lại để viết từng dòng, từng chữ để gửi đến em. 
                Không biết em còn nhớ anh nói thích viết thư tay không, vì anh có những lúc khô khan chằng được ngọt ngào nên anh thích cảm giác được ngồi nắn nót để viết từng câu từng câu từ cho em.
                Ngoài ra cũng bởi vì sự ngại ngùng, cảm giác sến súa nên những dòng chữ anh viết ra không được trọn vẹn, nhưng anh vẫn muốn gửi đến em những gì chân thành nhất.
                Anh biết khoảng thời gian 1 năm vừa qua cũng đã có những lúc anh làm em buồn, đã có những lúc xích mích, bất đồng, nhưng hơn hết sau cùng anh vẫn luôn muốn bên em, muốn được chăm sóc em, muốn được yêu thương em. 
                Với thời gian 1 năm vừa qua, cũng không phải thời gian dài cũng chẳng phải ngắn, nhưng với anh đây là khoảng thời gian tuyệt vời nhất, bởi vì anh đã có em bên cạnh, có em để yêu thương, có em để quan tâm, có em để chăm sóc. 
                Cuối cùng anh luôn mong muốn được đi cùng em, bên cạnh em mãi về sau. Anh chỉ muốn nói anh iu embe nhất trên đờiiiiiiii!
                </p>
              <p className="letter-sign">Love,<br /><strong>🐸</strong><br /><span>10.10.2026</span></p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
