'use client';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/2348104024943"
      className="fixed bottom-4 right-4 bg-accent text-ink p-3 rounded-full shadow-lg"
      aria-label="WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}
