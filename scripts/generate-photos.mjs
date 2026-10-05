/**
 * Giữ file này để lệnh cũ vẫn hoạt động.
 *
 * Không generate photos.ts trực tiếp từ ảnh gốc nữa vì cách đó làm `thumb`
 * và `src` cùng trỏ vào file dung lượng lớn, khiến website lag.
 *
 * Pipeline chuẩn nằm trong process-images.mjs:
 * originals -> thumbs WebP + display WebP -> photos.ts
 */
console.log('Đang chạy pipeline tối ưu ảnh...');
await import('./process-images.mjs');
