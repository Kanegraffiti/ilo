import { test, expect } from '@playwright/test';

const PATHS = ['/', '/facts', '/(authed)/home', '/(authed)/leaderboards'];

const SELECTOR =
  '.c-on-paper, .c-on-surface-1, .c-on-surface-2, .c-on-surface-3, .c-on-primary, .c-on-secondary, .c-on-accent';

test.describe('contrast sweep', () => {
  for (const path of PATHS) {
    test(`page ${path} has on-color elements`, async ({ page }) => {
      await page.goto(path);
      const count = await page.locator(SELECTOR).count();
      expect(count).toBeGreaterThan(0);
    });
  }
});
