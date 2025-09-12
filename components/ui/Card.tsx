'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCardPop } from '@/lib/anim';

interface CardProps {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function Card({ className, header, footer, children }: CardProps) {
  const motionProps = useCardPop();
  return (
    <motion.div
      className={cn('rounded-2xl bg-paper text-ink shadow-md p-4', className)}
      {...motionProps}
    >
      {header && <div className="mb-2">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-2">{footer}</div>}
    </motion.div>
  );
}
