import { useEffect, useMemo, useState } from 'react';
import type { Photo } from '../data/photos';

type Props = { photos: Photo[]; onOpen: (id: number) => void; onRandom: () => void };
const INITIAL_COUNT = 40;
const LOAD_MORE_COUNT = 40;

function getColumnCount() {
  if (typeof window === 'undefined') return 5;
  return window.matchMedia('(max-width: 640px)').matches
    ? 2 : window.matchMedia('(max-width: 900px)').matches ? 3 : 5;
}

export default function MemoryWall({ photos, onOpen, onRandom }: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 640px)');
    const tablet = window.matchMedia('(max-width: 900px)');
    const refresh = () => setColumnCount(getColumnCount());
    mobile.addEventListener('change', refresh);
    tablet.addEventListener('change', refresh);
    return () => {
      mobile.removeEventListener('change', refresh);
      tablet.removeEventListener('change', refresh);
    };
  }, []);

  // Mỗi ảnh được gán vào một cột cố định. Xem thêm chỉ nối ảnh vào cuối cột.
  const columns = useMemo(() => {
    const result: Photo[][] = Array.from({ length: columnCount }, () => []);
    photos.slice(0, visibleCount).forEach((photo, index) => {
      result[index % columnCount].push(photo);
    });
    return result;
  }, [photos, visibleCount, columnCount]);

  return (
    <section className="section wall-section" id="wall">
      <div className="section-inner">
        <div className="section-heading wall-heading">
          <div>
            <div className="eyebrow">EVERY LITTLE MOMENT</div>
            <h2>Memory wall</h2>
            <p>Không cần xem theo thứ tự. Cứ chạm vào một khoảnh khắc mà em muốn.</p>
          </div>
          <button className="secondary-button" type="button" onClick={onRandom}>Random memory ♡</button>
        </div>
        <div className="masonry-wall" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
          {columns.map((column, columnIndex) => (
            <div className="masonry-column" key={columnIndex}>
              {column.map((photo) => (
                <button className="wall-card" type="button" key={photo.id} onClick={() => onOpen(photo.id)} aria-label="Mở một kỷ niệm">
                  <img src={photo.thumb} alt="Kỷ niệm của chúng mình" loading="lazy" decoding="async" width={240} height={240} />
                </button>
              ))}
            </div>
          ))}
        </div>
        {visibleCount < photos.length && (
          <div className="wall-load-more">
            <button className="secondary-button" type="button" onClick={() => setVisibleCount((n) => Math.min(n + LOAD_MORE_COUNT, photos.length))}>Xem thêm kỷ niệm ♡</button>
          </div>
        )}
      </div>
    </section>
  );
}
