/* Shared bits for the node scripts: paths, the Chromium to use, one bundle per run. */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PUBLIC = path.join(ROOT, 'public');
export const OUT = path.join(ROOT, 'out');
/* the Chromium Remotion renders with: CHROME env var, else the pre-installed headless shell if it
   exists, else undefined so Remotion downloads its own (works anywhere with internet) */
const SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
export const CHROME = process.env.CHROME || (fs.existsSync(SHELL) ? SHELL : undefined);
export const FFMPEG = path.join(ROOT, 'node_modules', '@remotion', 'compositor-linux-x64-gnu', 'ffmpeg');

export async function serveUrl() {
  return bundle({ entryPoint: path.join(ROOT, 'src', 'index.jsx'), publicDir: PUBLIC, onProgress: () => {} });
}
export function ensure(dir) { fs.mkdirSync(dir, { recursive: true }); return dir; }
export function mb(file) { return (fs.statSync(file).size / 1048576).toFixed(1) + ' MB'; }
