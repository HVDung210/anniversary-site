import { useEffect, useRef, useState } from 'react';
import type { Photo } from '../data/photos';

type Props = {
  photos: Photo[];
  activeId: number | null;
  onClose: () => void;
  onChange: (id: number) => void;
};

export default function PhotoViewer({
  photos,
  activeId,
  onClose,
  onChange,
}: Props) {
  const index =
    activeId === null
      ? -1
      : photos.findIndex(
          (photo) => photo.id === activeId
        );

  const active =
    index < 0 ? null : photos[index];

  const imageRef =
    useRef<HTMLImageElement | null>(null);

  const [readySrc, setReadySrc] =
    useState<string | null>(null);

  /**
   * Mỗi lần đổi ảnh thì reset trạng thái.
   */
  useEffect(() => {
    if (!active) return;

    setReadySrc(null);
  }, [active?.src]);

  /**
   * Nếu ảnh đã có sẵn trong cache thì React đôi lúc có thể
   * render xong trước khi trạng thái load được cập nhật.
   * Kiểm tra lại complete/naturalWidth để tránh viewer bị kẹt.
   */
  useEffect(() => {
    if (!active) return;

    const image = imageRef.current;

    if (
      image?.complete &&
      image.naturalWidth > 0
    ) {
      setReadySrc(active.src);
    }
  }, [active?.src]);

  const move = (direction: 1 | -1) => {
    if (
      index < 0 ||
      photos.length === 0
    ) {
      return;
    }

    const next =
      (index + direction + photos.length) %
      photos.length;

    onChange(photos[next].id);
  };

  /**
   * Khóa scroll trang nền nhưng giữ nguyên chiều rộng.
   */
  useEffect(() => {
    if (!active) return;

    const oldOverflow =
      document.body.style.overflow;

    const oldPaddingRight =
      document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight =
        `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow =
        oldOverflow;

      document.body.style.paddingRight =
        oldPaddingRight;
    };
  }, [Boolean(active)]);

  /**
   * Điều khiển bằng bàn phím.
   */
  useEffect(() => {
    if (!active) return;

    const handleKey = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (
        event.key === 'ArrowRight' &&
        photos.length > 0
      ) {
        onChange(
          photos[
            (index + 1) % photos.length
          ].id
        );
      }

      if (
        event.key === 'ArrowLeft' &&
        photos.length > 0
      ) {
        onChange(
          photos[
            (index - 1 + photos.length) %
              photos.length
          ].id
        );
      }
    };

    window.addEventListener(
      'keydown',
      handleKey
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey
      );
  }, [
    active,
    index,
    onChange,
    onClose,
    photos,
  ]);

  /**
   * Preload ảnh trước/sau sau khi ảnh hiện tại đã hiện.
   */
  useEffect(() => {
    if (
      !active ||
      readySrc !== active.src ||
      photos.length < 2
    ) {
      return;
    }

    const nearby = [
      photos[
        (index - 1 + photos.length) %
          photos.length
      ],
      photos[
        (index + 1) % photos.length
      ],
    ];

    nearby.forEach((photo) => {
      const preload = new Image();
      preload.src = photo.src;
    });
  }, [
    active,
    index,
    photos,
    readySrc,
  ]);

  if (!active) return null;

  const isReady =
    readySrc === active.src;

  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh kỷ niệm"
      onClick={onClose}
    >
      <button
        type="button"
        className="viewer-close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Đóng ảnh"
      >
        ×
      </button>

      <button
        type="button"
        className="viewer-nav viewer-prev"
        onClick={(event) => {
          event.stopPropagation();
          move(-1);
        }}
        aria-label="Ảnh trước"
      >
        ‹
      </button>

      {!isReady && (
        <div
          className="viewer-loading"
          onClick={(event) =>
            event.stopPropagation()
          }
          aria-label="Đang tải ảnh"
        >
          <span className="viewer-loading-heart">
            ♡
          </span>
        </div>
      )}

      <figure
        className={`viewer-frame ${
          isReady ? 'is-ready' : ''
        }`}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <img
          ref={imageRef}
          className="viewer-display"
          src={active.src}
          alt="Kỷ niệm của chúng mình"
          draggable={false}
          onLoad={(event) => {
            if (
              event.currentTarget.naturalWidth >
              0
            ) {
              setReadySrc(active.src);
            }
          }}
        />
      </figure>

      <button
        type="button"
        className="viewer-nav viewer-next"
        onClick={(event) => {
          event.stopPropagation();
          move(1);
        }}
        aria-label="Ảnh tiếp theo"
      >
        ›
      </button>
    </div>
  );
}
