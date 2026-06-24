import type { TeamMember } from '@/content/team';

/** Team member card (doc 03 §7.5). Square placeholder until headshots land. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article>
      <div
        aria-hidden
        className="aspect-square w-full rounded-tp-lg bg-gradient-to-br from-tp-elevated to-tp-subtle"
      />
      <h3 className="mt-4 font-display text-2xl text-tp-white">{member.name}</h3>
      <p className="mt-1 text-sm uppercase tracking-wider text-tp-gold">{member.role}</p>
      <p className="mt-2 text-sm leading-relaxed text-tp-gray">{member.bio}</p>
    </article>
  );
}
