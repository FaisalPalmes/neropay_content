import fs from 'node:fs';
import { Config } from '@remotion/cli/config';

/* The Chromium to render with. In the remote environment Playwright's headless shell is
   pre-installed and downloads are blocked, so use it when it exists. Anywhere else, leave it
   null and Remotion fetches its own. Override with CHROME=/path. */
const SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
Config.setBrowserExecutable(process.env.CHROME || (fs.existsSync(SHELL) ? SHELL : null));
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setConcurrency(3);
Config.setOverwriteOutput(true);
Config.setPublicDir('./public');
