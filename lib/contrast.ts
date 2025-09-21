// Simple WCAG AA checker for known pairs using relative luminance
export function contrastIsAA(bg: string, fg: string, large = false): boolean {
  const luminance = (hex: string) => {
    const components = hex
      .replace('#', '')
      .match(/.{2}/g)!
      .map((value) => parseInt(value, 16) / 255)
      .map((channel) =>
        channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4),
      );
    const [r, g, b] = components;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = luminance(bg);
  const l2 = luminance(fg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio >= (large ? 3.0 : 4.5);
}
