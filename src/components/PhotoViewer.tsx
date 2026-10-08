import { useEffect, useState, type CSSProperties } from 'react';
import type { Photo } from '../data/photos';
import { preloadImage, prefetchPhoto } from '../utils/imagePreload';

type Props = {
  photos: Photo[];
  activeId: number | null;
  onClose: () => void;
  onChange: (id: number) => void;
};

export default function PhotoViewer({ photos, activeId, onClose, onChange }: Props) {
  const index = activeId === null ? -1 : photos.findIndex((photo) => photo.id === activeId);
  const active = index >= 0 ? photos[index] : null;
  const src = active?.src;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);

  // Chỉ đánh dấu hoàn tất sau khi ảnh lớn đã tải và giải mã.
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    preloadImage(src)
      .then(() => { if (!cancelled) { setLoadedSrc(src); setErrorSrc(null); } })
      .catch(() => { if (!cancelled) setErrorSrc(src); });
    return () => { cancelled = true; };
  }, [src]);

  // Khóa cuộn phía sau viewer và giữ nguyên chiều rộng bố cục.
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${padding + scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [!!active]);

  // Chỉ tải trước ảnh kề bên khi ảnh hiện tại đã sẵn sàng.
  useEffect(() => {
    if (!active || loadedSrc !== active.src || photos.length < 2) return;
    prefetchPhoto(photos[(index - 1 + photos.length) % photos.length].src);
    prefetchPhoto(photos[(index + 1) % photos.length].src);
  }, [active, index, loadedSrc, photos]);

  useEffect(() => {
    if (!active) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onChange(photos[(index - 1 + photos.length) % photos.length].id);
      if (event.key === 'ArrowRight') onChange(photos[(index + 1) % photos.length].id);
    };
    window.addEventListener('keydown', keyDown);
    return () => window.removeEventListener('keydown', keyDown);
  }, [active, index, onClose, onChange, photos]);

  if (!active) return null;
  const isLoaded = loadedSrc === active.src && errorSrc !== active.src;
  const hasError = errorSrc === active.src;
  const ratio = Math.max(active.width, 1) / Math.max(active.height, 1);
  const stageStyle: CSSProperties = {
    width: `min(82vw, 900px, ${(78 * ratio).toFixed(2)}vh)`,
    aspectRatio: `${Math.max(active.width, 1)} / ${Math.max(active.height, 1)}`,
  };
  const move = (direction: -1 | 1) => onChange(photos[(index + direction + photos.length) % photos.length].id);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Xem ảnh kỷ niệm" onClick={onClose}>
      <button type="button" className="viewer-close" onClick={(event) => { event.stopPropagation(); onClose(); }} aria-label="Đóng ảnh">×</button>
      <button type="button" className="viewer-nav viewer-prev" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Ảnh trước">‹</button>
      {isLoaded ? (
        <figure key={active.src} className="full-only-viewer-stage" style={stageStyle} onClick={(event) => event.stopPropagation()}>
          <img src={active.src} alt="Kỷ niệm của chúng mình" decoding="async" draggable={false} />
        </figure>
      ) : (
        <div className="full-only-viewer-loading" role="status" onClick={(event) => event.stopPropagation()}>
          <span className="full-only-viewer-loading-icon" aria-hidden="true">♡</span>
          <span className="full-only-viewer-loading-text">{hasError ? 'Không tải được ảnh. Hãy thử lại.' : 'Đang tải kỷ niệm...'}</span>
          {hasError && (
            <button type="button" className="full-only-viewer-retry" onClick={() => { setErrorSrc(null); setLoadedSrc(null); prefetchPhoto(active.src); preloadImage(active.src).then(() => setLoadedSrc(active.src)).catch(() => setErrorSrc(active.src)); }}>Thử lại</button>
          )}
        </div>
      )}
      <button type="button" className="viewer-nav viewer-next" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Ảnh tiếp theo">›</button>
    </div>
  );
}
