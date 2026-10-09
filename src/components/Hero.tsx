import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '../data/photos';

type Props = {
  photos: Photo[];
};

const rotations = [-8, 7, -1];

export default function Hero({ photos }: Props) {
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [stackWidth, setStackWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const media = window.matchMedia('(max-width: 640px)');
    const refresh = () => {
      setStackWidth(stack.clientWidth);
      setIsMobile(media.matches);
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(stack);
    media.addEventListener('change', refresh);
    refresh();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', refresh);
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const dismiss = (event: PointerEvent) => {
      if (!stackRef.current?.contains(event.target as Node)) setActiveIndex(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [activeIndex]);

  const heroPhotos = [
    photos[27],
    photos[18],
    photos[19],
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

        <div ref={stackRef} className={`hero-photo-stack ${activeIndex !== null ? 'has-focused-photo' : ''}`}>
          {heroPhotos.map((photo, index) => {
            const rotation =
              rotations[index] ?? 0;
            const isActive = activeIndex === index;
            // Mobile side cards start off-centre; bring the selected card into view.
            const focusX = isMobile ? stackWidth * ([0.26, -0.27, 0][index] ?? 0) : 0;

            return (
              <motion.button
                key={photo.id}
                type="button"
                className={`polaroid hero-photo hero-photo-${
                  index + 1
                } ${isActive ? 'is-focused' : ''}`}
                style={{ zIndex: isActive ? 30 : index + 1 }}
                aria-label={`Xem rõ ảnh kỷ niệm ${index + 1}`}
                aria-pressed={isActive}
                onHoverStart={() => setActiveIndex(index)}
                onHoverEnd={() => setActiveIndex(null)}
                onClick={(event) => {
                  if (event.detail === 0 || window.matchMedia('(hover: none), (pointer: coarse)').matches) {
                    setActiveIndex((current) => current === index ? null : index);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setActiveIndex(null);
                }}
                onBlur={() => setActiveIndex((current) => current === index ? null : current)}
                initial={{
                  opacity: 0,
                  y: 50,
                  rotate: rotation,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  x: isActive ? focusX : 0,
                  y: isActive ? (isMobile ? -42 : -18) : 0,
                  rotate: isActive ? 0 : rotation,
                  scale: isActive ? 1.1 : 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 0.35,
                  type: reducedMotion ? 'tween' : 'spring',
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

                <span className="hero-photo-caption">
                  {index === 2
                    ? 'you + me, always ♡'
                    : index === 1
                      ? 'same us, softer days ♡'
                      : 'little moments ♡'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
