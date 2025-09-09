export type CardState = {
  interval: number; // in days
  repetition: number;
  efactor: number;
  due: number; // timestamp
};

export function initCard(): CardState {
  return { interval: 1, repetition: 0, efactor: 2.5, due: Date.now() };
}

export function review(card: CardState, quality: 0 | 1 | 2 | 3 | 4 | 5): CardState {
  let { interval, repetition, efactor } = card;
  if (quality < 3) {
    return { interval: 1, repetition: 0, efactor, due: Date.now() + 24 * 3600 * 1000 };
  }
  if (repetition === 0) interval = 1;
  else if (repetition === 1) interval = 6;
  else interval = Math.round(interval * efactor);
  repetition += 1;
  efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < 1.3) efactor = 1.3;
  const due = Date.now() + interval * 24 * 3600 * 1000;
  return { interval, repetition, efactor, due };
}
