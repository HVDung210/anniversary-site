/**
 * Giữ file này để lệnh cũ vẫn hoạt động.
 *
 * Không generate photos.ts trực tiếp từ ảnh gốc nữa vì cách đó làm `thumb`
 * và `src` cùng trỏ vào file dung lượng lớn, khiến website lag.
 *
 * Pipeline chuẩn nằm trong process-images.mjs:
 * originals -> thumbs WebP + display WebP -> photos.ts
 *
 * Chỉ cập nhật ảnh xem trước: node scripts/generate-photos.mjs --thumbs-only
 * Thumbnail: 640 x 640px, WebP quality 82.
 */
console.log('Đang chạy pipeline tối ưu ảnh...');
await import('./process-images.mjs');
