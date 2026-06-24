import Link from 'next/link';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { NAV_LINKS, SITE, SOCIAL_LINKS } from '@/lib/site';

/** Site footer (doc 03 §7.12). Newsletter wiring lands in Phase 1 (Server Action). */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-tp-gold/30 bg-[#070707]">
      <div className="mx-auto grid max-w-site gap-10 px-6 py-16 md:grid-cols-4 md:px-16">
        <div>
          <p className="font-display text-xl tracking-[0.12em] text-tp-white">TRAVIS PAYNE</p>
          <p className="mt-3 max-w-xs text-sm text-tp-gray">
            Choreographer, director, and producer. Architect of cultural moments.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-overline uppercase text-tp-gold">Explore</h2>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-tp-gray hover:text-tp-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-overline uppercase text-tp-gold">Follow</h2>
          <ul className="mt-4 space-y-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-tp-gray hover:text-tp-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-overline uppercase text-tp-gold">Newsletter</h2>
          <p className="mt-4 text-sm text-tp-gray">News from the studio. No spam.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-tp-border">
        <div className="mx-auto flex max-w-site flex-col gap-2 px-6 py-6 text-xs text-tp-muted md:flex-row md:items-center md:justify-between md:px-16">
          <p>&copy; {year} Travis Payne Productions. All rights reserved.</p>
          <p>
            {SITE.email} &middot; {SITE.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
