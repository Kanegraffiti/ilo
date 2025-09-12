'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCardPop } from '@/lib/anim';

interface ToastContextValue {
  add: (msg: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ add: () => undefined });

export const useToast = () => React.useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<string[]>([]);
  const add = (msg: string) => {
    setMessages((m) => [...m, msg]);
    setTimeout(() => setMessages((m) => m.slice(1)), 3000);
  };
  const card = useCardPop();
  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              {...card}
              className="rounded-2xl bg-ink text-paper px-4 py-2 shadow-md"
            >
              {m}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
