import Link from 'next/link';

// Notable collaborators (doc 01 §3). Duplicated in the marquee for a seamless loop.
const COLLABORATORS = [
  'Michael Jackson',
  'Janet Jackson',
  'Beyoncé',
  'Madonna',
  'Usher',
  'Mariah Carey',
  'Diana Ross',
  'Ricky Martin',
  'Lenny Kravitz',
  'Cirque du Soleil',
];

export default function HomePage() {
  return (
    <>
      {/* HERO — placeholder shell; the looping video reel lands in Phase 1 (doc 03 §7.2). */}
      <section className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden px-6 pb-24 pt-32 md:px-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-tp-elevated/30 via-tp-black to-tp-black"
        />
        <div className="mx-auto w-full max-w-site">
          <p className="text-overline uppercase text-tp-gold">
            Choreographer &middot; Director &middot; Producer
          </p>
          <h1
            className="mt-5 max-w-content font-display font-light leading-[1.02] text-tp-white"
            style={{ fontSize: 'clamp(2.625rem, 6vw + 1rem, 5.625rem)' }}
          >
            Architect of
            <br />
            Cultural Moments
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-tp-gray">
            Three decades shaping the most-watched stages in entertainment &mdash; from world tours
            to film, awards shows, and brand spectacles.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/productions"
              className="inline-flex h-[52px] items-center justify-center rounded-tp-md bg-tp-gold px-7 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk hover:shadow-glow-gold"
            >
              View Productions
            </Link>
            <Link
              href="/book"
              className="inline-flex h-[52px] items-center justify-center rounded-tp-md border border-tp-border px-7 font-medium text-tp-white transition-colors hover:border-tp-gold hover:text-tp-gold"
            >
              Book Travis
            </Link>
          </div>
        </div>
      </section>

      {/* LEGACY MARQUEE (doc 03 §7.6). */}
      <section
        aria-label="Notable collaborators"
        className="overflow-hidden border-y border-tp-border bg-tp-black py-6"
      >
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-tp-gold/80">
          {[...COLLABORATORS, ...COLLABORATORS].map((name, index) => (
            <span key={`${name}-${index}`} aria-hidden={index >= COLLABORATORS.length}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* CONTACT TEASER (doc 03 §8.1). */}
      <section className="mx-auto max-w-content px-6 py-24 text-center md:px-16">
        <p className="text-overline uppercase text-tp-gold">Get in touch</p>
        <h2 className="mt-4 font-display text-display-md font-light text-tp-white">
          Let us create something extraordinary
        </h2>
        <p className="mx-auto mt-5 max-w-narrow text-tp-gray">
          Booking choreography, direction, and production for tours, film, television, and brands.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-tp-md border border-tp-gold px-6 text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black"
          >
            Contact
          </Link>
        </div>
      </section>
    </>
  );
}
