'use client';

import { usePressable, usePulseHint } from '@/lib/anim';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { forwardRef, useMemo } from 'react';

const baseStyles =
  'relative inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl r-xl font-semibold shadow-md transition-colors transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] active:scale-[0.98]';

export const buttonVariants = cva(baseStyles, {
  variants: {
    variant: {
      primary:
        'bg-primary c-on-primary hover:bg-primary hover:shadow-lg focus-visible:ring-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-60',
      secondary:
        'bg-secondary c-on-secondary hover:bg-secondary hover:shadow-lg focus-visible:ring-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-60',
      ghost:
        'b-border bg-transparent text-[var(--on-paper)] shadow-none hover:bg-[var(--surface-2)] focus-visible:ring-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-60',
      danger:
        'bg-red-600 text-white hover:bg-red-600 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-60',
    },
    size: {
      sm: 'px-4 py-2.5 text-base',
      md: 'px-5 py-3 text-lg',
      lg: 'px-6 py-3 text-lg sm:px-7 sm:py-3.5 sm:text-xl',
      xl: 'px-7 py-3.5 text-xl sm:px-8 sm:py-4 sm:text-2xl',
      icon: 'h-11 w-11 p-0 text-xl',
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
