import type { Milestone } from '@/content/about';

/** Vertical career timeline (doc 03 §8.2). */
export function Timeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="relative border-l border-tp-border">
      {milestones.map((milestone) => (
        <li key={milestone.year} className="mb-10 ml-6">
          <span
            aria-hidden
            className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-tp-gold"
          />
          <p className="font-mono text-sm text-tp-gold">{milestone.year}</p>
          <h3 className="mt-1 font-display text-xl text-tp-white">{milestone.title}</h3>
          <p className="mt-1 text-sm text-tp-gray">{milestone.detail}</p>
        </li>
      ))}
    </ol>
  );
}
