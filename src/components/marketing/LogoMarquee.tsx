/** Infinite horizontal name/logo marquee (doc 03 §7.6). Pauses for reduced motion. */
export function LogoMarquee({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <section
      aria-label={label ?? 'Collaborators'}
      className="overflow-hidden border-y border-tp-border bg-tp-black py-8"
    >
      {label && (
        <p className="mb-5 text-center text-overline uppercase text-tp-gray">{label}</p>
      )}
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-tp-gold/80">
        {[...items, ...items].map((name, index) => (
          <span key={`${name}-${index}`} aria-hidden={index >= items.length}>
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
