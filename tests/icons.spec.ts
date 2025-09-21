import { test, expect } from '@playwright/test';

const EMOJI_RE =
  /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F]/u;

test('icons render instead of emojis on landing', async ({ page }) => {
  await page.goto('/');
  const svgCount = await page.locator('svg').count();
  expect(svgCount).toBeGreaterThan(0);
  const content = await page.content();
  expect(EMOJI_RE.test(content)).toBe(false);
});
