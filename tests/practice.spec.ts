import { test, expect } from '@playwright/test';

test('practice placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
