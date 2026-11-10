// Tira prints do painel web com dados do seed (usado pelo workflow "Capturas").
// Espera a API em :3000 e o painel em :4173 já rodando.
import puppeteer from 'puppeteer';

const OUT = process.argv[2] ?? 'capturas';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });
page.on('pageerror', (e) => console.log('erro na página:', e.message));
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
await wait(1500);
await page.screenshot({ path: `${OUT}/painel-sessoes.png`, fullPage: true });

// Login como admin.
await page.click('#btn-login-nav');
await wait(500);
await page.type('#login-email', ADMIN_EMAIL);
await page.type('#login-senha', ADMIN_PASSWORD);
await page.click('#form-login button[type="submit"]');
await wait(2000);

const abrir = async (alvo, nome) => {
  await page.evaluate((t) => document.querySelector(`[data-target="${t}"]`)?.click(), alvo);
  await wait(1200);
  await page.screenshot({ path: `${OUT}/${nome}.png` });
  console.log('print', nome);
};
await abrir('view-pdv', 'painel-pedido');
await abrir('view-admin-sessao', 'painel-admin-sessao');
await abrir('view-admin-filme', 'painel-admin-filme');
await browser.close();
