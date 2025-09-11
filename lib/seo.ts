import type { Metadata } from 'next';

export const defaultMeta: Metadata = {
  title: 'Ìlọ̀',
  description: 'Learn Yoruba the fun way.',
  openGraph: {
    title: 'Ìlọ̀',
    description: 'Learn Yoruba the fun way.',
    images: [{ url: '/images/mockups/screen1.svg' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
