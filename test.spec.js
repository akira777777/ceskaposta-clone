const { test, expect } = require('@playwright/test');

test.describe('Educational UI demo - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3002');
  });

  test('Page title contains pošta demo', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('pošta');
  });

  test('Login modal exists hidden in DOM', async ({ page }) => {
    const modal = await page.$('#loginModal.hidden');
    expect(modal).toBeTruthy();
  });

  test('Opening login button shows modal', async ({ page }) => {
    await page.click('.header-actions .btn-icon:last-child');
    await page.waitForFunction(() => {
      const modal = document.getElementById('loginModal');
      return modal && !modal.classList.contains('hidden') && modal.isConnected;
    }, { timeout: 3000 });
    const isVisible = await page.evaluate(() => {
      const el = document.getElementById('loginModal');
      return el && !el.classList.contains('hidden') && window.getComputedStyle(el).display !== 'none';
    });
    expect(isVisible).toBe(true);
  });

  test('Form contains username and password inputs', async ({ page }) => {
    await page.click('.header-actions .btn-icon:last-child');
    expect(await page.$('#username')).toBeTruthy();
    expect(await page.$('#password')).toBeTruthy();
  });

  test('Submit button exists in demo form', async ({ page }) => {
    await page.click('.header-actions .btn-icon:last-child');
    expect(await page.$('#credentialForm .btn-primary')).toBeTruthy();
  });

  test('Demo submit clears password and shows toast without redirect', async ({ page }) => {
    const startUrl = page.url();
    await page.click('.header-actions .btn-icon:last-child');
    await page.fill('#username', 'demo-user');
    await page.fill('#password', 'demo-password');
    await page.click('#credentialForm .btn-primary');
    await page.waitForSelector('#demoToast', { timeout: 5000 });
    const toast = await page.textContent('#demoToast');
    expect(toast).toContain('Demo');
    expect(await page.inputValue('#password')).toBe('');
    expect(page.url()).toBe(startUrl);
    expect(await page.evaluate(() => localStorage.getItem('phished_credentials'))).toBeNull();
  });

  test('Service cards are visible on page', async ({ page }) => {
    expect((await page.$$('.services-grid .service-card')).length).toBeGreaterThan(0);
  });

  test('Modal stays usable at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.click('.header-actions .btn-icon:last-child');
    const isVisible = await page.evaluate(() => {
      const el = document.getElementById('loginModal');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    expect(isVisible).toBe(true);
  });

  test('Close button hides modal', async ({ page }) => {
    await page.click('.header-actions .btn-icon:last-child');
    await page.click('#loginModal .close-btn');
    await page.waitForFunction(() => {
      const el = document.getElementById('loginModal');
      return el && el.classList.contains('hidden');
    }, { timeout: 3000 });
    const hidden = await page.evaluate(() => document.getElementById('loginModal').classList.contains('hidden'));
    expect(hidden).toBe(true);
  });

  test('Navigation links exist', async ({ page }) => {
    expect((await page.$$('.nav-bar .nav-item')).length).toBeGreaterThan(0);
  });

  test('News and health demo APIs work', async ({ request }) => {
    const news = await request.get('http://localhost:3002/api/news');
    expect(news.ok()).toBe(true);
    const health = await request.get('http://localhost:3002/health');
    expect(health.ok()).toBe(true);
  });

  // =========================================================================
  // PRODUCTION SUITE TESTS (New verified features)
  // =========================================================================

  test('Parcel tracking displays live milestones and details', async ({ page }) => {
    await page.fill('#trackingCodeInput', 'DR123456789CZ');
    await page.click('.btn-track');
    await page.waitForSelector('#trackingResult:not(.hidden)', { timeout: 5000 });
    const resultText = await page.textContent('#trackingResult');
    expect(resultText).toContain('DR123456789CZ');
    expect(resultText).toContain('Balík Do ruky');
    expect(resultText).toContain('Historie pohybu zásilky');
  });

  test('Postage calculator updates rates upon changing options', async ({ page }) => {
    await page.click('.service-radio-card[data-service="do_ruky"]');
    await page.waitForTimeout(400);
    let total = await page.textContent('#calcTotalAmount');
    expect(total).toContain('129 Kč');

    await page.check('#calcCod');
    await page.waitForTimeout(400);
    total = await page.textContent('#calcTotalAmount');
    expect(total).toContain('159 Kč');
  });

  test('Branch finder filters results by city query', async ({ page }) => {
    await page.fill('#branchSearchInput', 'Brno');
    await page.waitForTimeout(400);
    const cards = await page.$$('.branches-list-grid .branch-card');
    expect(cards.length).toBeGreaterThan(0);
    const text = await page.textContent('.branches-list-grid');
    expect(text).toContain('Brno');
  });

  test('Accessibility settings can switch to Dark Mode', async ({ page }) => {
    await page.click('.header-actions .btn-icon:nth-child(2)');
    await page.waitForSelector('#settingsModal:not(.hidden)', { timeout: 3000 });
    await page.click('button[data-theme="dark"]');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('Cookie configuration modal allows granular preferences saving', async ({ page }) => {
    await page.click('.cookie-buttons .btn-cookie.btn-secondary:first-of-type');
    await page.waitForSelector('#cookieModal:not(.hidden)', { timeout: 3000 });
    await page.click('#cookieModal .btn-primary');
    await page.waitForSelector('#cookieModal.hidden', { timeout: 3000 });
    await page.waitForSelector('#cookieBanner.hidden', { timeout: 3000 });
  });

  test('Internal and sensitive files are blocked from HTTP access', async ({ request }) => {
    const pkg = await request.get('http://localhost:3002/package.json');
    expect(pkg.status()).toBe(404);
    const srv = await request.get('http://localhost:3002/server.js');
    expect(srv.status()).toBe(404);
    const git = await request.get('http://localhost:3002/.git/config');
    expect(git.status()).toBe(404);
  });
});
