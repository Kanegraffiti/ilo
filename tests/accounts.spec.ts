import { test, expect } from '@playwright/test';

const pages = ['/auth', '/profile', '/kids', '/leaderboards'];

for (const p of pages) {
  test(`page ${p} renders`, async ({ page }) => {
    await page.goto(p);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}

test('button rounded and large', async ({ page }) => {
  await page.goto('/auth');
  const btn = page.getByRole('button', { name: /magic link/i });
  const radius = await btn.evaluate((el) => getComputedStyle(el).borderRadius);
  const height = await btn.evaluate((el) => parseFloat(getComputedStyle(el).height));
  expect(parseFloat(radius)).toBeGreaterThanOrEqual(20);
  expect(height).toBeGreaterThanOrEqual(44);
});
