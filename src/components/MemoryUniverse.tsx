import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { Photo } from '../data/photos';

type Props = { photos: Photo[]; onOpen: (id: number) => void };

// ID trong data/photos.ts: 23 tương ứng 0023.webp. Dùng các ID khác nhau.
// Nửa đầu hiển thị ở lớp xa, nửa sau ở lớp gần; có thể thêm/bớt hoặc đổi thứ tự.
const UNIVERSE_PHOTO_IDS = [
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
];

export default function MemoryUniverse({ photos, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yNear = useTransform(scrollYProgress, [0, 1], [80, -140]);
  const yFar = useTransform(scrollYProgress, [0, 1], [20, -60]);
  const picks = UNIVERSE_PHOTO_IDS
    .map((id) => photos.find((photo) => photo.id === id))
    .filter((photo): photo is Photo => photo !== undefined);
  const layerSplit = Math.ceil(picks.length / 2);

  return (
    <section className="section universe-section" ref={ref} id="universe">
      <div className="universe-glow universe-glow-a" />
      <div className="universe-glow universe-glow-b" />
      <div className="orbit orbit-a" />
      <div className="orbit orbit-b" />
      <motion.div className="universe-layer universe-layer-far" style={{ y: yFar }}>
        {picks.slice(0, layerSplit).map((photo, i) => (
          <button key={photo.id} className="universe-card far-card" style={{ left: `${6 + ((i * 17) % 84)}%`, top: `${8 + ((i * 23) % 74)}%`, transform: `rotate(${((i * 7) % 11) - 5}deg)` }} onClick={() => onOpen(photo.id)}>
            <img src={photo.thumb} alt="Memory" loading="lazy" />
          </button>
        ))}
      </motion.div>
      <motion.div className="universe-layer universe-layer-near" style={{ y: yNear }}>
        {picks.slice(layerSplit).map((photo, i) => (
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
