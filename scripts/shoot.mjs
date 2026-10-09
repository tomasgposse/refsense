#!/usr/bin/env node
// Screenshots + design measurements of one or more pages, with headless Chrome or Edge.
// No npm dependencies: talks to the browser over the DevTools protocol through a pipe.
//
// Usage:
//   node shoot.mjs <out-dir> <url-or-file> [more...] [--wait 4000] [--max-height 9000] [--no-probe]
//
// For every page and for desktop (1440x900) and mobile (390x844) it writes:
//   <slug>-desktop-fold.png   what a visitor sees before scrolling
//   <slug>-desktop-full.png   the whole page (capped at --max-height px)
//   <slug>-mobile-fold.png / <slug>-mobile-full.png
//   results.json              per page: files, measurements (references/probe.js), and
//                             whether the page looked blocked (bot check, login wall, error)
// Set CHROME_PATH if your browser lives somewhere unusual.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (k) => (args.includes(k) ? (args.splice(args.indexOf(k), 1), true) : false);
const opt = (k, d) => {
  const i = args.indexOf(k);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const WAIT = +opt('--wait', '4000');
const MAX_H = +opt('--max-height', '9000');
const NO_PROBE = flag('--no-probe');
const [outDir, ...inputs] = args;
if (!outDir || !inputs.length) {
  console.error('Usage: node shoot.mjs <out-dir> <url-or-file> [more...] [--wait ms] [--max-height px] [--no-probe]');
  process.exit(1);
}

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/microsoft-edge',
].filter(Boolean);
const browserPath = CANDIDATES.find((b) => fs.existsSync(b));
if (!browserPath) {
  console.error('Chrome or Edge not found. Install one, or set CHROME_PATH to the browser executable.');
  process.exit(1);
}

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  {
    name: 'mobile', width: 390, height: 844, mobile: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
];
const probeSrc = fs.readFileSync(path.join(here, '..', 'references', 'probe.js'), 'utf8');
const BLOCKED = /just a moment|verif(y|ying|icación)|checking your browser|captcha|access denied|attention required|are you a robot|log ?in to continue|inicia sesión para|403 forbidden|404 not found|page not found/i;

// --- minimal DevTools-protocol client over --remote-debugging-pipe (fd 3 = to browser, fd 4 = from browser)
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'refsense-'));
const chrome = spawn(browserPath, [
  '--headless=new', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--mute-audio', '--disable-gpu', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
const toChrome = chrome.stdio[3];
const fromChrome = chrome.stdio[4];
let nextId = 1;
const pending = new Map();
const listeners = new Set();
let buf = '';
fromChrome.on('data', (chunk) => {
  buf += chunk.toString('utf8');
  let i;
  while ((i = buf.indexOf('\0')) >= 0) {
    const msg = JSON.parse(buf.slice(0, i));
    buf = buf.slice(i + 1);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else for (const l of listeners) l(msg);
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    toChrome.write(JSON.stringify({ id, method, params, ...(sessionId && { sessionId }) }) + '\0');
  });
const once = (method, sessionId, ms) =>
  new Promise((resolve) => {
    const t = setTimeout(() => (listeners.delete(l), resolve(false)), ms);
    const l = (m) => m.method === method && m.sessionId === sessionId && (clearTimeout(t), listeners.delete(l), resolve(true));
    listeners.add(l);
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (sessionId, expression) =>
  (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId)).result?.value;

// Scroll down and back so lazy-loaded images and scroll-triggered reveals render before the full shot.
// Instant scrolling on purpose: pages with scroll-behavior: smooth would still be moving at capture time.
const SCROLL = `(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  const go = (y) => scrollTo({ top: y, behavior: 'instant' });
  const step = innerHeight * 0.7;
  const end = Math.min(document.documentElement.scrollHeight, ${MAX_H});
  for (let y = 0; y < end; y += step) { go(y); await new Promise((r) => setTimeout(r, 180)); }
  go(end); await new Promise((r) => setTimeout(r, 600));
  go(0); await new Promise((r) => setTimeout(r, 1200));
})()`;
// Hide fixed cookie/consent banners so they don't cover the design.
const HIDE_CONSENT = `(() => {
  let n = 0;
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (!/fixed|sticky/.test(s.position)) continue;
    const t = (el.id + ' ' + el.className + ' ' + el.textContent.slice(0, 300)).toLowerCase();
    if (/cookie|consent|gdpr|privacy|privacidad|onetrust|didomi|cookiebot/.test(t) && el.getBoundingClientRect().height < innerHeight * 0.9) {
      el.style.setProperty('display', 'none', 'important'); n++;
    }
  }
  document.documentElement.style.overflow = ''; document.body.style.overflow = '';
  return n;
})()`;

const slug = (u) =>
  u.replace(/^(https?|file):\/\/\/?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'page';

async function capture(url, view, base) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const out = { view: view.name, fold: null, full: null };
  try {
    await send('Page.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride',
      { width: view.width, height: view.height, deviceScaleFactor: 1, mobile: view.mobile }, sessionId);
    if (view.ua) await send('Emulation.setUserAgentOverride', { userAgent: view.ua }, sessionId);
    if (view.mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessionId);
    const loaded = once('Page.loadEventFired', sessionId, 30_000);
    await send('Page.navigate', { url }, sessionId);
    await loaded;
    await sleep(WAIT);
    await evaluate(sessionId, SCROLL).catch(() => {});
    out.hiddenBanners = await evaluate(sessionId, HIDE_CONSENT).catch(() => 0);
    await sleep(300);

    const text = (await evaluate(sessionId, `document.title + ' ' + (document.body?.innerText || '').slice(0, 1500)`)) || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    if (BLOCKED.test(text) && words < 120) out.blocked = 'bot check, login wall or error page';
    else if (words < 8) out.blocked = 'almost no content rendered';

    const fold = path.join(outDir, `${base}-${view.name}-fold.png`);
    fs.writeFileSync(fold, Buffer.from((await send('Page.captureScreenshot', { format: 'png' }, sessionId)).data, 'base64'));
    out.fold = fold;

    const { cssContentSize } = await send('Page.getLayoutMetrics', {}, sessionId);
    const h = Math.min(Math.ceil(cssContentSize.height), MAX_H);
    const full = path.join(outDir, `${base}-${view.name}-full.png`);
    const shot = await send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: view.width, height: h, scale: 1 },
    }, sessionId);
    fs.writeFileSync(full, Buffer.from(shot.data, 'base64'));
    out.full = full;
    out.pageHeight = Math.ceil(cssContentSize.height);

    if (!NO_PROBE) out.probe = await evaluate(sessionId, probeSrc).catch((e) => ({ error: e.message }));
  } catch (e) {
    out.error = String(e.message || e).slice(0, 200);
  } finally {
    await send('Target.closeTarget', { targetId }).catch(() => {});
  }
  return out;
}

fs.mkdirSync(outDir, { recursive: true });
const results = [];
try {
  for (const input of inputs) {
    const url = /^(https?|file):/.test(input) ? input : pathToFileURL(path.resolve(input)).href;
    const base = slug(input);
    const page = { url, views: [] };
    for (const view of VIEWS) {
      const r = await capture(url, view, base);
      page.views.push(r);
      const status = r.error ? `✗ ${r.error}` : r.blocked ? `⚠ blocked? ${r.blocked}` : `✓ ${r.pageHeight}px`;
      console.log(`${view.name.padEnd(7)} ${status.padEnd(48)} ${url}`);
    }
    results.push(page);
  }
} finally {
  fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
  chrome.kill();
  setTimeout(() => fs.rmSync(profile, { recursive: true, force: true }), 500);
}
console.log(`-> ${path.join(outDir, 'results.json')}`);
