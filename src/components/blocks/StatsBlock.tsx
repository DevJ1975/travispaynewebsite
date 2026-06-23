import { bgClass, type BackgroundVariant } from '@/lib/puck/tokens';

export interface StatsBlockProps {
  stats?: { value: string; label: string }[];
  backgroundVariant?: BackgroundVariant;
}

export function StatsBlock({ stats = [], backgroundVariant = 'surface' }: StatsBlockProps) {
  const list = stats.length
    ? stats
    : [
        { value: '30+', label: 'Years' },
        { value: '50+', label: 'Productions' },
      ];

  return (
    <section className={`${bgClass[backgroundVariant]} px-6 py-20 md:px-16`}>
      <dl className="mx-auto grid max-w-site grid-cols-2 gap-8 md:grid-cols-4">
        {list.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-display-sm text-tp-gold">{stat.value}</span>
              <span className="mt-1 block text-sm uppercase tracking-wider text-tp-gray">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
