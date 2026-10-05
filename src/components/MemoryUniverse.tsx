import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { Photo } from '../data/photos';

type Props = { photos: Photo[]; onOpen: (id: number) => void };

export default function MemoryUniverse({ photos, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yNear = useTransform(scrollYProgress, [0, 1], [80, -140]);
  const yFar = useTransform(scrollYProgress, [0, 1], [20, -60]);
  const picks = photos.slice(22, 46);

  return (
    <section className="section universe-section" ref={ref} id="universe">
      <div className="universe-glow universe-glow-a" />
      <div className="universe-glow universe-glow-b" />
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <motion.div className="universe-layer universe-layer-far" style={{ y: yFar }}>
        {picks.slice(0, 12).map((photo, i) => (
          <button key={photo.id} className="universe-card far-card" style={{ left: `${6 + ((i * 17) % 84)}%`, top: `${8 + ((i * 23) % 74)}%`, transform: `rotate(${((i * 7) % 11) - 5}deg)` }} onClick={() => onOpen(photo.id)}>
            <img src={photo.thumb} alt="Memory" loading="lazy" />
          </button>
        ))}
      </motion.div>
      <motion.div className="universe-layer universe-layer-near" style={{ y: yNear }}>
        {picks.slice(12).map((photo, i) => (
          <button key={photo.id} className="universe-card near-card" style={{ left: `${4 + ((i * 29) % 86)}%`, top: `${7 + ((i * 31) % 78)}%`, transform: `rotate(${((i * 9) % 13) - 6}deg)` }} onClick={() => onOpen(photo.id)}>
            <img src={photo.thumb} alt="Memory" loading="lazy" />
          </button>
        ))}
      </motion.div>
      <div className="universe-copy">
        <div className="eyebrow">A UNIVERSE OF US</div>
        <p>...nhưng đó mới chỉ là một vài tấm thôi.</p>
        <h2>Còn rất nhiều.</h2>
        <span className="tiny-divider">— ♥ —</span>
      </div>
      <span className="floating-easter egg-a">🐸</span>
      <span className="floating-easter egg-b">👑</span>
    </section>
  );
}
