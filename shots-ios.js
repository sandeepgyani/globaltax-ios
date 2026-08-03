// Generates App Store JPEG screenshots: iPhone 6.5" (1284x2778) + iPad 12.9" (2048x2732).
// Usage: node shots-ios.js
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGE = 'file:///' + path.resolve(__dirname, 'www/index.html').replace(/\\/g, '/');
const OUT = path.resolve(__dirname, 'store-assets');

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();

  const shoot = (name) => page.screenshot({ path: path.join(OUT, name), type: 'jpeg', quality: 90 });
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ---- iPhone 6.5": 428x926 CSS @3x = 1284x2778
  await page.setViewport({ width: 428, height: 926, deviceScaleFactor: 3 });
  await page.goto(PAGE, { waitUntil: 'networkidle0' });
  await sleep(1200);

  await shoot('ip65-1-calculator.jpg');

  await page.evaluate(() => {
    document.getElementById('salary').value = '2500000';
    document.getElementById('retire').value = '150000';
    document.getElementById('calcBtn').click();
    document.getElementById('resultCard').scrollIntoView();
  });
  await sleep(600);
  await shoot('ip65-2-results.jpg');

  await page.evaluate(() => { document.querySelector('[data-page="compare"]').click(); window.scrollTo(0, 0); });
  await sleep(500);
  await shoot('ip65-3-compare.jpg');

  await page.evaluate(() => {
    document.querySelector('[data-page="retire"]').click();
    document.getElementById('retBtn').click();
    document.getElementById('retResult').scrollIntoView();
  });
  await sleep(500);
  await shoot('ip65-4-retirement.jpg');

  await page.evaluate(() => {
    document.querySelector('[data-page="migrate"]').click();
    document.getElementById('migBtn').click();
    document.getElementById('migResult').scrollIntoView();
  });
  await sleep(700);
  await shoot('ip65-5-migration.jpg');

  await page.evaluate(() => { document.querySelector('[data-page="col"]').click(); window.scrollTo(0, 0); });
  await sleep(1500);
  await shoot('ip65-6-costliving.jpg');

  // ---- iPad 12.9": 1024x1366 CSS @2x = 2048x2732
  await page.setViewport({ width: 1024, height: 1366, deviceScaleFactor: 2 });
  await page.goto(PAGE, { waitUntil: 'networkidle0' });
  await sleep(1200);
  await page.evaluate(() => {
    document.getElementById('salary').value = '2500000';
    document.getElementById('calcBtn').click();
  });
  await sleep(600);
  await shoot('ipad129-1-calculator.jpg');

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
