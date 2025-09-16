'use client';

import { usePressable, usePulseHint } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { forwardRef, useMemo } from 'react';

const baseStyles =
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper min-h-[44px] select-none shadow-md';

export const buttonVariants = cva(baseStyles, {
  variants: {
    variant: {
      primary:
        'bg-primary text-paper hover:bg-primary/90 active:bg-primary/95 disabled:bg-primary/60 disabled:text-paper/80',
      secondary:
        'bg-secondary text-paper hover:bg-secondary/90 active:bg-secondary/95 disabled:bg-secondary/50 disabled:text-paper/75',
      ghost:
        'bg-transparent text-primary shadow-none hover:bg-primary/10 active:bg-primary/20 disabled:text-primary/50',
      danger:
        'bg-red-600 text-white hover:bg-red-500 active:bg-red-600/80 disabled:bg-red-600/40',
    },
    size: {
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
      xl: 'px-6 py-4 text-xl',
    },
    pulse: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
    pulse: false,
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  pulse?: boolean;
  href?: string;
}

const MotionButton = motion(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      className,
      variant,
      size,
      leadingIcon,
      trailingIcon,
      children,
      pulse,
      type = 'button',
      href,
      disabled,
      onClick,
      ...rest
    },
    ref,
  ) {
    const pressable = usePressable();
    const pulseHint = usePulseHint();
    const motionProps = useMemo(() => (pulse ? { ...pressable, ...pulseHint } : pressable), [pressable, pulse, pulseHint]);

    if (href) {
      const isDisabled = Boolean(disabled);
      const linkClass = cn(
        buttonVariants({ variant, size, pulse }),
        isDisabled && 'pointer-events-none opacity-60',
        className,
      );

      return (
        <NextLink href={href} passHref legacyBehavior>
          <motion.a
            {...motionProps}
            className={linkClass}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : undefined}
            onClick={(event) => {
              if (isDisabled) {
                event.preventDefault();
                return;
              }
              (onClick as MouseEventHandler<HTMLAnchorElement> | undefined)?.(event);
            }}
          >
            {leadingIcon ? (
              <span aria-hidden="true" className="flex items-center justify-center text-current">
                {leadingIcon}
              </span>
            ) : null}
            <span className="font-semibold tracking-wide">{children}</span>
            {trailingIcon ? (
              <span aria-hidden="true" className="flex items-center justify-center text-current">
                {trailingIcon}
              </span>
            ) : null}
          </motion.a>
        </NextLink>
      );
    }

    const { onAnimationStart: _onAnimationStart, onAnimationEnd: _onAnimationEnd, onAnimationIteration: _onAnimationIteration, ...restProps } = rest;

    return (
      <motion.button
        ref={ref}
        {...(motionProps as Record<string, unknown>)}
        type={type}
        className={cn(buttonVariants({ variant, size, pulse }), className)}
        disabled={disabled}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        {...(restProps as Record<string, unknown>)}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="flex items-center justify-center text-current">
            {leadingIcon}
          </span>
        ) : null}
        <span className="font-semibold tracking-wide">{children}</span>
        {trailingIcon ? (
          <span aria-hidden="true" className="flex items-center justify-center text-current">
            {trailingIcon}
          </span>
        ) : null}
      </motion.button>
    );
  }),
);

export { MotionButton as Button };
