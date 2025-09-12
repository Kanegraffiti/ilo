import { Card } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  text: string;
}

export function FeatureCard({ icon: Icon, title, text }: Props) {
  return (
    <Card className="text-center hover:shadow-md transition">
      <Icon className="mx-auto mb-4 h-8 w-8 text-brand" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-ink">{text}</p>
    </Card>
  );
}
