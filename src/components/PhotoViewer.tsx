import { useEffect, useState } from 'react';
import type { Photo } from '../data/photos';

type Props = {
  photos: Photo[];
  activeId: number | null;
  onClose: () => void;
  onChange: (id: number) => void;
};

export default function PhotoViewer({ photos, activeId, onClose, onChange }: Props) {
  const index = activeId === null ? -1 : photos.findIndex((p) => p.id === activeId);
  const active = index < 0 ? null : photos[index];
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const move = (direction: 1 | -1) => {
    if (index < 0 || photos.length === 0) return;
    onChange(photos[(index + direction + photos.length) % photos.length].id);
  };

  // Giữ vị trí cuộn cũ và không làm nội dung nền nhảy ngang khi khóa cuộn.
  useEffect(() => {
    if (!active) return;
    const oldOverflow = document.body.style.overflow;
    const oldPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const currentPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${currentPadding + scrollbar}px`;
    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPaddingRight;
    };
  }, [Boolean(active)]);

  useEffect(() => {
    if (!active) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight' && photos.length > 0)
        onChange(photos[(index + 1) % photos.length].id);
      else if (event.key === 'ArrowLeft' && photos.length > 0)
        onChange(photos[(index - 1 + photos.length) % photos.length].id);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeId, index, onChange, onClose, photos]);

  // Chỉ preload hai ảnh lân cận; không preload đồng loạt cả album.
  useEffect(() => {
    if (!active || readySrc !== active.src || photos.length < 2) return;
    const nearby = [photos[(index - 1 + photos.length) % photos.length], photos[(index + 1) % photos.length]];
    nearby.forEach((p) => { const img = new Image(); img.src = p.src; });
  }, [activeId, index, photos, readySrc]);

  if (!active) return null;
  const displayReady = readySrc === active.src && failedSrc !== active.src;

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Xem ảnh kỷ niệm" onClick={onClose}>
      <button type="button" className="viewer-close" onClick={(event) => { event.stopPropagation(); onClose(); }} aria-label="Đóng ảnh">×</button>
      <button type="button" className="viewer-nav viewer-prev" onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Ảnh trước">‹</button>
      <figure
        className="viewer-frame"
        style={{ width: `min(80vw, 900px, ${(76 * active.width / active.height).toFixed(2)}vh)`, aspectRatio: `${active.width} / ${active.height}` }}
        onClick={(event) => event.stopPropagation()}
      >
        <img className="viewer-thumb" src={active.thumb} alt="Kỷ niệm của chúng mình" draggable={false} />
        {failedSrc !== active.src && (
          <img
            className={`viewer-display ${displayReady ? 'is-ready' : ''}`}
            src={active.src}
            alt=""
            decoding="async"
            draggable={false}
            onLoad={(event) => {
              // Khi trình duyệt decode xong mới hiện ảnh lớn, không nháy khung trống.
              const image = event.currentTarget;
              const markReady = () => setReadySrc(active.src);
              if (typeof image.decode === 'function') {
                image.decode().then(markReady).catch(markReady);
              } else markReady();
            }}
            onError={() => setFailedSrc(active.src)}
          />
        )}
      </figure>
      <button type="button" className="viewer-nav viewer-next" onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Ảnh tiếp theo">›</button>
    </div>
  );
}
