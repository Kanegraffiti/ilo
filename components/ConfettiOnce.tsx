'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ConfettiOnce() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 flex items-center justify-center text-6xl"
    >
      🎉
    </motion.div>
  );
}
