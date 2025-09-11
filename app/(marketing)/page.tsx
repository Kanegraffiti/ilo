import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Hero from '@/components/hero';
import FeaturesGrid from '@/components/features-grid';
import HowItWorks from '@/components/how-it-works';
import ProverbRotator from '@/components/proverb-rotator';
import Testimonials from '@/components/testimonials';
import CTABanner from '@/components/cta-banner';

export default function HomePage() {
  const homePath = path.join(process.cwd(), 'content/home.md');
  const { data, content } = matter(fs.readFileSync(homePath, 'utf8'));
  const bullets = content.trim().split('•').map((s) => s.trim());
  return (
    <main className="relative">
      <Hero title={data.title} tagline={data.tagline} bullets={bullets} />
      <FeaturesGrid />
      <HowItWorks />
      <ProverbRotator />
      <Testimonials />
      <CTABanner />
    </main>
  );
}
