import Icon from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/icons';

interface FeatureCardProps {
  icon: IconName;
  title: string;
  body: string;
}

export function FeatureCard({ icon, title, body }: FeatureCardProps) {
  return (
    <div className="bg-surface-1 c-on-surface-1 r-xl b-border shadow-md p-4 md:p-5 transition hover:bg-[var(--surface-3)]">
      <div className="flex items-start gap-3">
        <Icon name={icon} size={28} color="var(--on-surface-1)" className="text-2xl md:text-3xl" aria-hidden />
        <div className="space-y-1">
          <h3 className="font-title text-xl md:text-2xl text-[var(--on-surface-1)]">{title}</h3>
          <p className="text-[var(--on-surface-1)]/85">{body}</p>
        </div>
      </div>
    </div>
  );
}
