/* Shared bits for the node scripts: paths, the Chromium to use, one bundle per run. */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PUBLIC = path.join(ROOT, 'public');
export const OUT = path.join(ROOT, 'out');
export const CHROME = process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
export const FFMPEG = path.join(ROOT, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg');

export async function serveUrl() {
  return bundle({ entryPoint: path.join(ROOT, 'src', 'index.jsx'), publicDir: PUBLIC, onProgress: () => {} });
}
export function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); return dir; }
export function mb(file) { return (fs.statSync(file).size / 1048576).toFixed(1) + ' MB'; }
