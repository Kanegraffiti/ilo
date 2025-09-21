import { FeatureCard } from '@/components/feature-card';
import type { IconName } from '@/components/icons/icons';

const features: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'kids',
    title: 'Cartoon Guides',
    body: 'Meet Funmiláyọ̀, Ọládélé, and friends—your cheerful guides through greetings, numbers, and proverbs.',
  },
  { icon: 'practice', title: 'Tap-to-Hear', body: 'Hear perfect tones. Practice with a tap.' },
  { icon: 'mic', title: 'Voice Challenges', body: 'Record yourself. Get instant feedback.' },
  { icon: 'globe', title: 'Culture Spotlight', body: 'Proverbs, songs, and celebrations woven into every module.' },
  {
    icon: 'mail',
    title: 'WhatsApp Easy-Teach',
    body: 'Teachers upload lessons by sending a voice note. Ìlọ̀ does the rest.',
  },
];

export default function FeaturesGrid() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-center font-display text-3xl mb-8">Why Ìlọ̀ works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
        ))}
      </div>
    </section>
  );
}
