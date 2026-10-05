import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Photo } from '../data/photos';
import { makeHeartPoints } from '../utils/heart';
import FloatingMascots from './FloatingMascots';

type Props = {
  photos: Photo[];
  onOpen: (id: number) => void;
};

type HeartTileStyle = CSSProperties & {
  '--heart-rotate': string;
  '--heart-scale': number;
  '--heart-delay': string;
};

const DESKTOP_HEART_COUNT = 120;
const MOBILE_HEART_COUNT = 72;
const MOBILE_MEDIA_QUERY = '(max-width: 640px)';

/**
 * Lấy ảnh trải đều trên toàn bộ danh sách thay vì chỉ lấy N ảnh đầu tiên.
 * Nhờ vậy trái tim vẫn đại diện cho nhiều giai đoạn trong bộ ảnh.
 */
function pickEvenly<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;

  const result: T[] = [];
  const step = (items.length - 1) / (count - 1);

  for (let index = 0; index < count; index += 1) {
    result.push(items[Math.round(index * step)]);
  }

  return result;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MOBILE_MEDIA_QUERY).matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(media.matches);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

export default function PhotoHeart({ photos, onOpen }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isMobile = useIsMobile();

  const maxPhotos = isMobile ? MOBILE_HEART_COUNT : DESKTOP_HEART_COUNT;

  const heartPhotos = useMemo(
    () => pickEvenly(photos, maxPhotos),
    [photos, maxPhotos]
  );

  const points = useMemo(
    () => makeHeartPoints(heartPhotos.length),
    [heartPhotos.length]
  );

  /**
   * Chỉ bật animation khi section tiến gần viewport.
   * Không tạo hàng trăm Framer Motion instances như bản cũ.
   */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setRevealed(true);
        observer.disconnect();
      },
      {
        rootMargin: '160px 0px',
        threshold: 0.08,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [revealed]);

  return (
    <section
      ref={sectionRef}
      className={`section heart-section ${revealed ? 'is-revealed' : ''}`}
    >
      <FloatingMascots variant="heart" />

      <div className="section-inner heart-inner">
        <div className="section-heading centered heart-copy">
          <div className="eyebrow">THE MAIN MEMORY</div>
          <h2>365 days</h2>

          <p className="heart-subtitle">
            Hundreds of memories. One congchuacuaanh.
          </p>

          <span className="interaction-hint">
            ☝ chạm vào từng kỷ niệm ♡
          </span>
        </div>

        <div className="photo-heart" aria-label="Trái tim tạo từ ảnh">
          <div className="heart-halo" />

          {heartPhotos.map((photo, index) => {
            const point = points[index];

            const style: HeartTileStyle = {
              left: `${point.x}%`,
              top: `${point.y}%`,
              '--heart-rotate': `${point.rotate}deg`,
              '--heart-scale': point.scale,
              // Chỉ có 12 nhóm delay thay vì mỗi ảnh một animation timeline riêng.
              '--heart-delay': `${(index % 12) * 28}ms`,
            };

            return (
              <button
                className="heart-tile"
                key={photo.id}
                style={style}
                onClick={() => onOpen(photo.id)}
                aria-label={`Mở kỷ niệm ${photo.id}`}
              >
                <img
                  src={photo.thumb}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  width={240}
                  height={240}
                />
              </button>
            );
          })}

          <div className="heart-center-mark">
            365 <span>♡</span>
          </div>
        </div>
      </div>
    </section>
  );
}
