/** Cache các ảnh đã tải/giải mã. Giới hạn để tránh giữ quá nhiều ảnh lớn trong RAM. */
const cache = new Map<string, Promise<void>>();
const MAX_CACHED_IMAGES = 12;

export function preloadImage(src: string): Promise<void> {
  if (!src) return Promise.resolve();
  const existing = cache.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.decode) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    img.onerror = () => reject(new Error(`Không tải được ảnh: ${src}`));
    img.src = src;
  });

  cache.set(src, promise);
  while (cache.size > MAX_CACHED_IMAGES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
  promise.catch(() => {
    if (cache.get(src) === promise) cache.delete(src);
  });
  return promise;
}

export function prefetchPhoto(src: string): void {
  void preloadImage(src).catch(() => undefined);
}
