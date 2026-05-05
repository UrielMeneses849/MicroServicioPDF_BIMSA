const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF({ html, outputPath }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 🔥 Cargar el HTML en la página (esto faltaba)
  await page.setContent(html, {
    waitUntil: 'networkidle0',
  });

  await page.setViewport({
  width: 1600,
  height: 2000,
  deviceScaleFactor: 2, // 🔥 mejora calidad + layout
});

await page.emulateMediaType('screen');

await page.pdf({
  path: outputPath,
  width: '1200px', // 🔥 IMPORTANTE: render tipo "pantalla"
  height: '1800px', // evita cortes raros
  printBackground: true,
  scale: 1,
  margin: {
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  },
});

  await browser.close();

  return outputPath;
}

module.exports = generatePDF;