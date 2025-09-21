import { Card } from '@/components/ui/Card';

const steps = [
  { title: 'Teacher', text: 'Record a lesson.' },
  { title: 'Upload via WhatsApp', text: 'Send a voice note to Ìlọ̀.' },
  { title: 'Students learn', text: 'Kids receive playful lessons.' },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-screen-lg bg-paper c-on-paper py-12">
      <h2 className="mb-8 text-center font-display text-3xl">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <Card key={s.title} className="text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary c-on-primary font-bold">
              {i + 1}
            </div>
            <h3 className="mb-2 font-semibold">{s.title}</h3>
            <p className="text-sm opacity-80">{s.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
