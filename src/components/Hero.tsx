import { motion } from 'framer-motion';
import type { Photo } from '../data/photos';

type Props = {
  photos: Photo[];
};

const rotations = [-8, 7, -1];

export default function Hero({ photos }: Props) {
  const heroPhotos = [
    photos[4],
    photos[7],
    photos[1],
  ].filter(Boolean);

  return (
    <section
      className="section hero-section"
      id="hero"
    >
      <div className="section-inner hero-grid">
        <motion.div
          className="hero-copy"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
        >
          <div className="eyebrow">
            10.10.2025 — 10.10.2026
          </div>

          <h2>One year with you.</h2>

          <p>
            Những khoảnh khắc tuyệt vời nhất của chúng ta, những kỷ niệm ngọt ngào nhất, và những điều anh muốn nói với em.
          </p>

          <div className="signature-chip">
            🐸 ♡ 👑
          </div>
        </motion.div>

        <div className="hero-photo-stack">
          {heroPhotos.map((photo, index) => {
            const rotation =
              rotations[index] ?? 0;

            return (
              <motion.figure
                key={photo.id}
                className={`polaroid hero-photo hero-photo-${
                  index + 1
                }`}
                initial={{
                  opacity: 0,
                  y: 50,
                  rotate: rotation,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: rotation,
                  scale: 1,
                }}
                whileHover={{
                  y: -18,
                  rotate: 0,
                  scale: 1.1,
                  zIndex: 30,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 220,
                  damping: 22,
                }}
              >
                <div className="hero-photo-glow" />

                <img
                  src={photo.src}
                  alt="Kỷ niệm của chúng mình"
                  draggable={false}
                />

                <figcaption>
                  {index === 2
                    ? 'you + me, always ♡'
                    : index === 1
                      ? 'same us, softer days ♡'
                      : 'little moments ♡'}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
