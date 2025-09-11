'use client';
import NavBar from '@/components/navbar';
import Footer from '@/components/footer';
import CookieBanner from '@/components/cookie-banner';
import FloatingWhatsApp from '@/components/floating-whatsapp';
import { useAnalytics } from '@/lib/analytics';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return (
    <>
      <NavBar />
      {children}
      <Footer />
      <CookieBanner />
      <FloatingWhatsApp />
    </>
  );
}
