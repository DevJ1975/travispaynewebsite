'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CartCount } from '@/components/store/CartCount';
import { NAV_LINKS } from '@/lib/site';
import { cn } from '@/lib/utils/cn';

/** Fixed top navigation: transparent over the hero, surface on scroll (doc 03 §7.1). */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-sticky transition-colors duration-300',
        scrolled ? 'border-b border-tp-border bg-tp-surface/90 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-site items-center justify-between px-6 py-4 md:px-16"
      >
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-[0.12em] text-tp-white"
        >
          TRAVIS PAYNE
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] uppercase tracking-[0.06em] text-tp-gray transition-colors hover:text-tp-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="hidden items-center text-[13px] uppercase tracking-[0.06em] text-tp-gray transition-colors hover:text-tp-gold sm:inline-flex"
          >
            Cart
            <CartCount />
          </Link>
          <Link
            href="/book"
            className="hidden rounded-tp-md border border-tp-gold px-4 py-2 text-[13px] uppercase tracking-[0.06em] text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black sm:inline-block"
          >
            Book Now
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-tp-white lg:hidden"
          >
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-tp-border bg-tp-surface px-6 py-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-2xl text-tp-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
