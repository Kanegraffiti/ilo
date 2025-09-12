'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { usePressable } from '@/lib/anim';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:pointer-events-none min-h-[44px]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-paper hover:bg-primary/90',
        secondary: 'bg-secondary text-paper hover:bg-secondary/90',
        ghost: 'text-primary hover:bg-primary/10',
      },
      size: {
        md: 'px-4 py-2 text-lg',
        lg: 'px-6 py-3 text-xl',
        xl: 'px-8 py-4 text-2xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconLeft, iconRight, children, ...props }, ref) => {
    const press = usePressable();
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...press}
        {...(props as any)}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
