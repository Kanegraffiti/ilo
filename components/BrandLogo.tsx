import React from 'react';
import { Baloo_2 } from 'next/font/google';

const baloo = Baloo_2({ subsets: ['latin'] });

export default function BrandLogo({ size = 48 }: { size?: number }) {
  return (
    <span
      className={`${baloo.className} font-bold`}
      style={{ fontSize: size }}
    >
      Ìlọ̀
    </span>
  );
}
