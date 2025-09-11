import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Pricing - Ìlọ̀' };

const tiers = [
  {
    name: 'Starter',
    price: '₦0',
    description: '1 free module, basic quizzes',
    cta: 'Start free',
  },
  {
    name: 'Teacher Pro',
    price: '₦10,000/mo',
    description: 'WhatsApp uploader, dashboard, certificates',
    popular: true,
    cta: 'Enroll',
  },
  {
    name: 'Schools',
    price: 'Contact us',
    description: 'Roster sync, reports, onboarding',
    cta: 'Contact',
  },
];

export default function PricingPage() {
  return (
    <section className="container mx-auto py-12">
      <h1 className="font-display text-4xl text-center mb-8">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <Card key={t.name} className="text-center">
            {t.popular && <Badge className="mb-2">Most Popular</Badge>}
            <h3 className="font-semibold text-xl mb-2">{t.name}</h3>
            <p className="text-2xl mb-2">{t.price}</p>
            <p className="mb-4 text-sm">{t.description}</p>
            <Button>{t.cta}</Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
