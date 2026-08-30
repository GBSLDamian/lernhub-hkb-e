#!/usr/bin/env node
// Generates all PWA icons from scratch (no image libraries, no CDN assets):
// a hand-rolled PNG encoder rasterizes a simple "L" mark on the brand color.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(ROOT, '..', 'assets', 'icons');
const BRAND = [27, 73, 214]; // #1b49d6
const WHITE = [255, 255, 255];

// ---------- minimal PNG encoder ----------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePng(width, height, getPixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      raw[offset++] = r; raw[offset++] = g; raw[offset++] = b; raw[offset++] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = zlib.deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---------- "L" mark ----------
function inRoundedRect(px, py, x, y, w, h, r) {
  if (px < x || py < y || px >= x + w || py >= y + h) return false;
  const cx = Math.min(Math.max(px, x + r), x + w - r);
  const cy = Math.min(Math.max(py, y + r), y + h - r);
  const dx = px - cx, dy = py - cy;
  return dx * dx + dy * dy <= r * r;
}
function makeIconPixel({ size, padding = 0, background = true, cornerRadius }) {
  const inner = size - padding * 2;
  const radius = cornerRadius ?? inner * 0.22;
  return (x, y) => {
    const bgHit = background ? inRoundedRect(x, y, 0, 0, size, size, size * 0.22) : true;
    if (!bgHit) return [0, 0, 0, 0];
    // vertical bar of the "L"
    const barW = inner * 0.16, barH = inner * 0.5;
    const barX = padding + inner * 0.34, barY = padding + inner * 0.24;
    const footW = inner * 0.38, footH = inner * 0.16;
    const footX = barX, footY = barY + barH - footH;
    const onMark =
      inRoundedRect(x, y, barX, barY, barW, barH, barW * 0.3) ||
      inRoundedRect(x, y, footX, footY, footW, footH, footH * 0.3);
    return onMark ? [...WHITE, 255] : [...BRAND, 255];
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#1b49d6"/>
  <rect x="34" y="24" width="16" height="50" rx="5" fill="#ffffff"/>
  <rect x="34" y="58" width="38" height="16" rx="5" fill="#ffffff"/>
</svg>`;
  await writeFile(path.join(OUT_DIR, 'icon.svg'), svg, 'utf8');

  const targets = [
    { file: 'icon-192.png', size: 192, padding: 0 },
    { file: 'icon-512.png', size: 512, padding: 0 },
    { file: 'apple-touch-icon.png', size: 180, padding: 0 },
    { file: 'icon-maskable-512.png', size: 512, padding: 512 * 0.16, background: true },
  ];
  for (const t of targets) {
    const png = encodePng(t.size, t.size, makeIconPixel(t));
    await writeFile(path.join(OUT_DIR, t.file), png);
    console.log(`✓ ${t.file}`);
  }
}

await main();
