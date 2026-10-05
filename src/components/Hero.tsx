import { motion } from 'framer-motion';
import type { Photo } from '../data/photos';

type Props = { photos: Photo[] };

export default function Hero({ photos }: Props) {
  return (
    <section className="section hero-section" id="hero">
      <div className="section-inner hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>
          <div className="eyebrow">10.10.2025 — 10.10.2026</div>
          <h2>One year with you.</h2>
          <p>Có rất nhiều thứ anh không nhớ được ngày tháng…<br />nhưng may là chúng ta đã giữ lại bằng ảnh.</p>
          <div className="signature-chip">🐸 ♡ 👑</div>
        </motion.div>
        <div className="hero-photo-stack">
          {[photos[4], photos[7], photos[1]].map((photo, index) => (
            <motion.figure
              key={photo.id}
              className={`polaroid hero-photo hero-photo-${index + 1}`}
              initial={{ opacity: 0, y: 50, rotate: index === 0 ? -6 : index === 1 ? 4 : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.7 }}
            >
              <img src={photo.src} alt="Kỷ niệm placeholder" />
              <figcaption>{index === 2 ? 'you + me, always ♡' : index === 1 ? 'same us, softer days ♡' : 'little moments ♡'}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
