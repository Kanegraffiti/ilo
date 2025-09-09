import { test, expect } from '@playwright/test';

test('landing renders logo and CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Learn Yoruba with Ìlọ̀')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
});

test('install prompt hidden after install', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.dispatchEvent(new Event('beforeinstallprompt'));
  });
  await expect(page.getByRole('button', { name: 'Install App' })).toBeVisible();
  await page.evaluate(() => {
    window.dispatchEvent(new Event('appinstalled'));
  });
  await expect(page.getByRole('button', { name: 'Install App' })).toBeHidden();
});

test('lesson page offline', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);
  await context.setOffline(true);
  await page.goto('/lessons/1');
  await expect(page.locator('body')).toContainText('Offline');
  await context.setOffline(false);
});
