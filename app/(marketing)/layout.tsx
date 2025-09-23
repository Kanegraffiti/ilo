'use client';
import NavBar from '@/components/navbar';
import Footer from '@/components/footer';
import CookieBanner from '@/components/cookie-banner';
import { useAnalytics } from '@/lib/analytics';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return (
    <>
      <NavBar />
      <main className="pt-24">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
