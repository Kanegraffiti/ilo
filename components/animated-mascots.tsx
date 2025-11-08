'use client';

import { FloatingCutout } from '@/components/floating-cutout';
import { cn } from '@/lib/utils';

interface AnimatedMascotsProps {
  className?: string;
}

const MASCOTS = [
  {
    src: '/images/Ade.png',
    alt: 'Ade cheering with a talking drum',
    className:
      'absolute -left-12 top-6 hidden sm:block lg:-left-16 lg:top-4 xl:-left-20 xl:top-2',
    size: 'lg' as const,
    floatDirection: 'up' as const,
    floatIntensity: 18,
    rotate: 4,
  },
  {
    src: '/images/Bidemi.png',
    alt: 'Bidemi smiling and waving with headphones',
    className: 'absolute -right-6 bottom-0 hidden md:block lg:-right-10 lg:bottom-2',
    size: 'md' as const,
    floatDirection: 'down' as const,
    floatIntensity: 16,
    rotate: 6,
    delay: 0.5,
  },
  {
    src: '/images/1760206019097.png',
    alt: 'Playful mascot holding a mic',
    className:
      'absolute left-1/2 top-[-3rem] hidden lg:block xl:top-[-4rem] xl:left-[55%] -translate-x-1/2',
    size: 'sm' as const,
    floatDirection: 'up' as const,
    floatIntensity: 20,
    rotate: 8,
    delay: 0.9,
  },
];

export function AnimatedMascots({ className }: AnimatedMascotsProps) {
  return (
    <div className={cn('pointer-events-none select-none', className)}>
      {MASCOTS.map((mascot) => (
        <FloatingCutout
          key={mascot.src}
          src={mascot.src}
          alt={mascot.alt}
          className={mascot.className}
          size={mascot.size}
          floatDirection={mascot.floatDirection}
          floatIntensity={mascot.floatIntensity}
          rotate={mascot.rotate}
          delay={mascot.delay}
          ariaHidden
        />
      ))}
    </div>
  );
}
