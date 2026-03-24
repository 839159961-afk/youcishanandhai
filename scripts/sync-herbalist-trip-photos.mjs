#!/usr/bin/env node
/**
 * 从「图鉴照片」文件夹按文件名前的序号排序，复制到 public/herbalist-trip/，
 * 并生成 src/herbalistTripPhotos.manifest.json 供应用引用。
 *
 * 用法：
 *   node scripts/sync-herbalist-trip-photos.mjs
 *   SOURCE_DIR="/path/to/图鉴照片" node scripts/sync-herbalist-trip-photos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const destDir = path.join(root, 'public', 'herbalist-trip');
const manifestPath = path.join(root, 'src', 'herbalistTripPhotos.manifest.json');

const defaultSource = '/Users/guocong/Desktop/图鉴照片';
const sourceDir = process.env.SOURCE_DIR || defaultSource;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function leadingInt(basename) {
  const m = basename.match(/^\s*(\d+)/);
  return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
}

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`源目录不存在: ${sourceDir}`);
    console.error('可设置环境变量 SOURCE_DIR 指向你的「图鉴照片」文件夹。');
    process.exit(1);
  }

  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(destDir)) {
    if (name === '.DS_Store' || name === 'manifest.json') continue;
    fs.unlinkSync(path.join(destDir, name));
  }

  const entries = fs
    .readdirSync(sourceDir)
    .filter((name) => !name.startsWith('.') && name !== '.DS_Store')
    .map((name) => {
      const full = path.join(sourceDir, name);
      const st = fs.statSync(full);
      if (!st.isFile()) return null;
      const ext = path.extname(name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) return null;
      const key = leadingInt(name);
      return { name, full, ext, key };
    })
    .filter(Boolean);

  entries.sort((a, b) => {
    if (a.key !== b.key) return a.key - b.key;
    return a.name.localeCompare(b.name, 'zh-Hans-CN');
  });

  const relPaths = [];
  entries.forEach((e, i) => {
    const destName = `${String(i + 1).padStart(3, '0')}${e.ext}`;
    fs.copyFileSync(e.full, path.join(destDir, destName));
    relPaths.push(`herbalist-trip/${destName}`);
  });

  fs.writeFileSync(manifestPath, `${JSON.stringify(relPaths, null, 2)}\n`, 'utf8');
  console.log(`已复制 ${relPaths.length} 张图 -> public/herbalist-trip/`);
  console.log(`已写入 ${path.relative(root, manifestPath)}`);
}

main();
