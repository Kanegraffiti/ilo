import { expect, test } from '@playwright/test';

import { contrastIsAA } from '@/lib/contrast';

const lightPairs: ReadonlyArray<{ bg: string; fg: string; large?: boolean }> = [
  { bg: '#F4E7CD', fg: '#2C221B' },
  { bg: '#FFFFFF', fg: '#2C221B' },
  { bg: '#F0E4CC', fg: '#2C221B' },
  { bg: '#E8D8BB', fg: '#2C221B' },
  { bg: '#9C5C2E', fg: '#FFFFFF' },
  { bg: '#4A5B3F', fg: '#FFFFFF' },
  { bg: '#D37E2C', fg: '#1F140D' },
];

const darkPairs: ReadonlyArray<{ bg: string; fg: string; large?: boolean }> = [
  { bg: '#12100E', fg: '#F5EDE0' },
  { bg: '#171411', fg: '#F5EDE0' },
  { bg: '#1E1915', fg: '#EFE4D2' },
  { bg: '#251F19', fg: '#F2E7D6' },
  { bg: '#B87949', fg: '#0E0906' },
  { bg: '#5A6C50', fg: '#0E0D0B', large: true },
  { bg: '#E18B3F', fg: '#0E0906' },
];

test.describe('theme contrast', () => {
  test('light tokens meet AA', () => {
    for (const { bg, fg, large } of lightPairs) {
      expect(contrastIsAA(bg, fg, large)).toBeTruthy();
    }
  });

  test('dark tokens meet AA', () => {
    for (const { bg, fg, large } of darkPairs) {
      expect(contrastIsAA(bg, fg, large)).toBeTruthy();
    }
  });
});
