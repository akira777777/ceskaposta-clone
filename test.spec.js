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
});
