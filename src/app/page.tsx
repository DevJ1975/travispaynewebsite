import Link from 'next/link';
import { Eyebrow, Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { LogoMarquee } from '@/components/marketing/LogoMarquee';
import { StatsBar } from '@/components/marketing/StatsBar';
import { ProductionCard } from '@/components/cards/ProductionCard';
import { PRODUCTIONS } from '@/content/productions';
import { ALL_PARTNERS } from '@/content/partners';

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

const featured = PRODUCTIONS.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* HERO — placeholder shell; the looping video reel lands as a Phase-1 polish (doc 03 §7.2). */}
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

      <LogoMarquee items={COLLABORATORS} />

      {/* ABOUT TEASER */}
      <Section className="py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div
              aria-hidden
              className="aspect-[3/4] rounded-tp-lg bg-gradient-to-br from-tp-elevated to-tp-black"
            />
          </Reveal>
          <Reveal>
            <Eyebrow>About Travis</Eyebrow>
            <h2 className="mt-3 font-display text-display-md font-light text-tp-white">
              More Than a Choreographer
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tp-gray">
              From a roughly twenty-year collaboration with Michael Jackson to founding Travis Payne
              Productions, Travis has spent his career defining the moments that shape popular
              culture.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex h-11 items-center rounded-tp-md border border-tp-border px-6 text-tp-white transition-colors hover:border-tp-gold hover:text-tp-gold"
            >
              Read the Full Story
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* FEATURED PRODUCTIONS */}
      <Section className="py-24">
        <div className="mb-12 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Selected Works" title="Moments That Define" />
          <Link
            href="/productions"
            className="hidden whitespace-nowrap text-sm text-tp-gold hover:underline sm:block"
          >
            View All →
          </Link>
        </div>
        <Stagger className="grid gap-6 md:grid-cols-3">
          {featured.map((production) => (
            <StaggerItem key={production.slug}>
              <ProductionCard production={production} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* STATS */}
      <Section className="border-y border-tp-border bg-tp-surface py-20">
        <Reveal>
          <StatsBar />
        </Reveal>
      </Section>

      {/* MASTERCLASS CTA */}
      <Section className="py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Online Masterclasses</Eyebrow>
            <h2 className="mt-3 font-display text-display-md font-light text-tp-white">
              Train with the World&rsquo;s Best
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tp-gray">
              World-class online dance education with Travis Payne and Stacy Walker.
            </p>
            <Link
              href="/masterclasses"
              className="mt-8 inline-flex h-11 items-center rounded-tp-md border border-tp-gold px-6 text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black"
            >
              Browse Masterclasses
            </Link>
          </Reveal>
          <Reveal>
            <div
              aria-hidden
              className="aspect-video rounded-tp-lg bg-gradient-to-br from-tp-elevated to-tp-black"
            />
          </Reveal>
        </div>
      </Section>

      <LogoMarquee items={ALL_PARTNERS} label="In Partnership With" />

      {/* CONTACT TEASER */}
      <Section className="py-24 text-center">
        <Reveal>
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="mt-4 font-display text-display-md font-light text-tp-white">
            Let us create something extraordinary
          </h2>
          <p className="mx-auto mt-5 max-w-narrow text-tp-gray">
            Booking choreography, direction, and production for tours, film, television, and brands.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black transition-colors hover:bg-tp-gold-dk"
            >
              Book Travis
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-tp-md border border-tp-border px-6 text-tp-white transition-colors hover:border-tp-gold hover:text-tp-gold"
            >
              Contact
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
