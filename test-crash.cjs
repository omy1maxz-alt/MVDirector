const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => {
    errors.push(err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  if (errors.length > 0) {
    console.error('Errors found:', errors);
  } else {
    console.log('No errors found');
  }
  await browser.close();
})();
