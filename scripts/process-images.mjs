import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('public/images/originals');
const thumbDir = path.resolve('public/images/thumbs');
const displayDir = path.resolve('public/images/display');
const outputFile = path.resolve('src/data/photos.ts');

const supportedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
]);

if (!fs.existsSync(inputDir)) {
  throw new Error(
    `Không tìm thấy thư mục ảnh gốc: ${inputDir}\n` +
    'Hãy đặt ảnh gốc vào public/images/originals rồi chạy lại script.'
  );
}

/**
 * Dọn ảnh đã generate cũ để tránh còn file thừa khi bộ ảnh mới ít hơn bộ cũ.
 * Chỉ dọn file .webp trong thư mục output, không đụng tới originals.
 */
function clearGeneratedWebp(directory) {
  fs.mkdirSync(directory, { recursive: true });

  for (const file of fs.readdirSync(directory)) {
    if (path.extname(file).toLowerCase() === '.webp') {
      fs.unlinkSync(path.join(directory, file));
    }
  }
}

clearGeneratedWebp(thumbDir);
clearGeneratedWebp(displayDir);

const files = fs
  .readdirSync(inputDir)
  .filter((file) =>
    supportedExtensions.has(path.extname(file).toLowerCase())
  )
  .sort((a, b) =>
    a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  );

if (files.length === 0) {
  throw new Error(`Không có ảnh hợp lệ trong ${inputDir}`);
}

const photos = [];

for (let index = 0; index < files.length; index += 1) {
  const file = files[index];
  const fullPath = path.join(inputDir, file);

  /**
   * rotate() áp dụng EXIF orientation trước khi resize.
   * metadata gốc vẫn được dùng để xác định orientation logic.
   */
  const metadata = await sharp(fullPath).metadata();

  const originalWidth = metadata.width ?? 1;
  const originalHeight = metadata.height ?? 1;

  // EXIF orientation 5-8 nghĩa là ảnh sẽ đổi chiều sau auto-rotate.
  const swapsDimensions =
    metadata.orientation != null &&
    metadata.orientation >= 5 &&
    metadata.orientation <= 8;

  const width = swapsDimensions ? originalHeight : originalWidth;
  const height = swapsDimensions ? originalWidth : originalHeight;

  const orientation =
    Math.abs(width - height) < 5
      ? 'square'
      : height > width
        ? 'portrait'
        : 'landscape';

  const baseName = String(index + 1).padStart(4, '0');
  const thumbName = `${baseName}.webp`;
  const displayName = `${baseName}.webp`;

  /**
   * Thumbnail dùng cho Heart / Universe / Scrapbook / Memory Wall.
   * 220px đủ cho tile nhỏ nhưng giảm đáng kể decode memory và network.
   */
  await sharp(fullPath)
    .rotate()
    .resize({
      width: 220,
      height: 220,
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: true,
    })
    .webp({
      quality: 64,
      effort: 4,
      smartSubsample: true,
    })
    .toFile(path.join(thumbDir, thumbName));

  /**
   * Display chỉ tải khi mở viewer hoặc dùng ở hero.
   * 1440px đủ nét cho laptop/điện thoại nhưng nhẹ hơn ảnh gốc rất nhiều.
   */
  await sharp(fullPath)
    .rotate()
    .resize({
      width: 1440,
      height: 1440,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      effort: 4,
      smartSubsample: true,
    })
    .toFile(path.join(displayDir, displayName));

  photos.push({
    id: index + 1,
    thumb: `/images/thumbs/${thumbName}`,
    src: `/images/display/${displayName}`,
    width,
    height,
    orientation,
  });

  console.log(`[${index + 1}/${files.length}] ${file}`);
}

const output = `export type Photo = {
  id: number;
  thumb: string;
  src: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
};

export const photos: Photo[] = ${JSON.stringify(photos, null, 2)};
`;

fs.writeFileSync(outputFile, output, 'utf8');

console.log('');
console.log(`Generated ${photos.length} photos`);
console.log(`Thumbs: ${thumbDir}`);
console.log(`Display: ${displayDir}`);
console.log(`Data: ${outputFile}`);
