import { Card } from '@/components/ui/Card';

const steps = [
  { title: 'Teacher', text: 'Record a lesson.' },
  { title: 'Upload via WhatsApp', text: 'Send a voice note to Ìlọ̀.' },
  { title: 'Students learn', text: 'Kids receive playful lessons.' },
];

export default function HowItWorks() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-center font-display text-3xl mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <Card key={s.title} className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
              {i + 1}
            </div>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-ink">{s.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
