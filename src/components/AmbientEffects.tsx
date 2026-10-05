import type { CSSProperties } from 'react';

type ParticleStyle = CSSProperties & {
  '--particle-x': string;
  '--particle-size': string;
  '--particle-duration': string;
  '--particle-delay': string;
  '--particle-drift': string;
  '--particle-opacity': number;
  '--particle-rotate': string;
};

const SYMBOLS = ['♡', '✦', '✧', '·'];
const PARTICLE_COUNT = 24;

// Các thông số cố định giúp hạt không đổi vị trí đột ngột khi React render lại.
const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
  symbol: SYMBOLS[index % SYMBOLS.length],
  x: ((index * 37 + 11) % 96) + 2,
  size: 9 + ((index * 7) % 9),
  duration: 12 + ((index * 5) % 10),
  delay: -((index * 3.7) % 21),
  drift: ((index * 19) % 65) - 32,
  opacity: 0.18 + ((index % 4) * 0.035),
  rotate: ((index * 29) % 65) - 32,
}));

export default function AmbientEffects() {
  return (
    <div className="ambient-effects" aria-hidden="true">
      {particles.map((particle, index) => {
        const style: ParticleStyle = {
          '--particle-x': `${particle.x}vw`,
          '--particle-size': `${particle.size}px`,
          '--particle-duration': `${particle.duration}s`,
          '--particle-delay': `${particle.delay}s`,
          '--particle-drift': `${particle.drift}px`,
          '--particle-opacity': particle.opacity,
          '--particle-rotate': `${particle.rotate}deg`,
        };

        return (
          <span
            key={`${particle.symbol}-${index}`}
            className={`ambient-particle ambient-particle-${index + 1}`}
            style={style}
          >
            {particle.symbol}
          </span>
        );
      })}
    </div>
  );
}
