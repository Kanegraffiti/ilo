import Image from 'next/image';
import React from 'react';

export default function BrandLogo({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center space-x-2">
      <Image src="/brand/ilo-logo.svg" alt="Ìlọ̀ logo" width={size} height={size} />
      <span className="text-2xl font-bold" style={{ fontFamily: 'Noto Serif' }}>
        Ìlọ̀
      </span>
    </div>
  );
}
