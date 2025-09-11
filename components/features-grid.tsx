import { FeatureCard } from '@/components/feature-card';
import {
  Smile,
  Volume2,
  Mic,
  Sun,
  MessageCircle,
} from 'lucide-react';

const features = [
  {
    icon: Smile,
    title: 'Cartoon Guides',
    text: 'Meet Funmiláyọ̀, Ọládélé, and friends—your cheerful guides through greetings, numbers, and proverbs.',
  },
  { icon: Volume2, title: 'Tap-to-Hear', text: 'Hear perfect tones. Practice with a tap.' },
  { icon: Mic, title: 'Voice Challenges', text: 'Record yourself. Get instant feedback.' },
  { icon: Sun, title: 'Culture Spotlight', text: 'Proverbs, songs, and celebrations woven into every module.' },
  { icon: MessageCircle, title: 'WhatsApp Easy-Teach', text: 'Teachers upload lessons by sending a voice note. Ìlọ̀ does the rest.' },
];

export default function FeaturesGrid() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-center font-display text-3xl mb-8">Why Ìlọ̀ works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} icon={f.icon} title={f.title} text={f.text} />
        ))}
      </div>
    </section>
  );
}
