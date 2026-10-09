import { useEffect, useRef, useState } from 'react';
import FloatingMascots from './FloatingMascots';
import Icon from './Icon';

type Props = { onReplay?: () => void };
const petals = Array.from({ length: 12 }, (_, i) => ({
  left: `${6 + ((i * 29) % 88)}%`,
  delay: `${(i % 6) * 0.24}s`,
  duration: `${3 + (i % 4) * 0.38}s`,
}));

export default function Finale({ onReplay }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || showPetals) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShowPetals(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [showPetals]);

  return (
    <section ref={sectionRef} className="section finale-section">
      <FloatingMascots variant="finale" />
      {showPetals && (
        <div className="finale-petals" aria-hidden="true">
          {petals.map((petal, i) => (
            <span key={i} className="finale-petal" style={{ left: petal.left, animationDelay: petal.delay, animationDuration: petal.duration }}>❀</span>
          ))}
        </div>
      )}
      <div className="section-inner finale-inner">
        <div className="eyebrow">TO BE CONTINUED</div>
        <h2>Một năm rồi đó.</h2>
        <p>Còn rất nhiều kỷ niệm đang chờ chúng ta.</p>
        <div className="forever-mark">♡<br /><span>10.10.2025 → ∞</span></div>
        {onReplay && <button className="secondary-button button-with-icon" type="button" onClick={onReplay}><Icon name="replay" />Xem lại từ đầu</button>}
      </div>
    </section>
  );
}
