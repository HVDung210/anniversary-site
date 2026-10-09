import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const projectDir = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.resolve(projectDir, 'public');
const outputDir = path.resolve(projectDir, 'dist');

// Only remove this project's generated dist directory; never follow a junction.
if (path.dirname(outputDir) !== path.resolve(projectDir) || path.basename(outputDir) !== 'dist') {
  throw new Error(`Unexpected build output: ${outputDir}`);
}
try {
  const stat = await fs.lstat(outputDir);
  if (stat.isSymbolicLink()) throw new Error('dist must not be a symlink or junction.');
  const resolvedOutput = await fs.realpath(outputDir);
  const resolvedProject = await fs.realpath(projectDir);
  if (path.relative(resolvedProject, resolvedOutput) !== 'dist') {
    throw new Error(`Build output is outside the project: ${resolvedOutput}`);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// Async removal retries transient EBUSY/EPERM locks from Windows file scanners.
try {
  await fs.rm(outputDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
} catch (error) {
  if (error.code === 'EBUSY' || error.code === 'EPERM') {
    throw new Error('Windows vẫn đang khóa file trong dist. Đóng ảnh hoặc cửa sổ đang xem dist, rồi chạy lại npm run build.', { cause: error });
  }
  throw error;
}

await build({
  root: projectDir,
  build: { outDir: outputDir, emptyOutDir: false, copyPublicDir: false },
});

// Copy deployable public assets, excluding the large photo source directories.
await fs.cp(publicDir, outputDir, {
  recursive: true,
  filter(source) {
    const relative = path.relative(publicDir, source).split(path.sep).join('/');
    return !['images/originals', 'images/placeholders'].some(
      (directory) => relative === directory || relative.startsWith(`${directory}/`)
    );
  },
});
console.log('Build hoàn tất: dist chứa ảnh tối ưu, nhạc và các file website.');
