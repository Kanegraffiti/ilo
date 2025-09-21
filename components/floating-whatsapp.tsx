'use client';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/2348104024943"
      className="fixed bottom-4 right-4 rounded-full bg-accent c-on-accent p-3 shadow-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-accent)]/60"
      aria-label="WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}
