import { Config } from '@remotion/cli/config';

/* The Chromium that Playwright installs in the remote environment. Remotion would otherwise
   try to download its own, which the network policy blocks. Override with CHROME=/path. */
Config.setBrowserExecutable(process.env.CHROME || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(90);
Config.setConcurrency(3);
Config.setOverwriteOutput(true);
Config.setPublicDir('./public');
