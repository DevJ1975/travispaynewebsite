const STATS = [
  { value: '30+', label: 'Years' },
  { value: '50+', label: 'Productions' },
  { value: '100M+', label: 'Audience Reached' },
  { value: '$261M', label: 'This Is It Box Office' },
];

/** Headline figures (doc 03 §8.1). Count-up animation is a Phase-1 polish follow-up. */
export function StatsBar() {
  return (
    <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
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
  );
}
