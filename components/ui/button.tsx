'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-2xl text-base font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:pointer-events-none min-h-[44px]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-paper hover:bg-primary/90',
        secondary: 'bg-secondary text-paper hover:bg-secondary/90',
        outline: 'border border-primary text-primary hover:bg-primary/10',
      },
      size: {
        default: 'px-6',
        sm: 'px-4 text-sm',
        lg: 'px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends HTMLMotionProps<'button'>,
    VariantProps<typeof buttonVariants> {}

const MotionButton = motion.button;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <MotionButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
