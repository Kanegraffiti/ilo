import Image from 'next/image';
import testimonials from '@/content/testimonials.json';

export default function Testimonials() {
  return (
    <section className="container mx-auto bg-paper c-on-paper py-12">
      <h2 className="text-center font-display text-3xl mb-8">Loved by learners</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg bg-surface-1 c-on-surface-1 p-6 shadow">
            <div className="flex items-center mb-4">
              <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full" />
              <div className="ml-2">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm opacity-70">{t.location}</p>
              </div>
            </div>
            <p className="text-sm opacity-80">{t.quote}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
