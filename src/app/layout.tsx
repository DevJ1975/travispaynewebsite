import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Mono, DM_Sans } from 'next/font/google';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SITE } from '@/lib/site';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Travis Payne — Choreographer · Director · Producer',
    template: '%s · Travis Payne',
  },
  description:
    'Travis Payne — world-renowned choreographer, director, and producer. Architect of cultural moments.',
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: 'Travis Payne — Choreographer · Director · Producer',
    description:
      'World-renowned choreographer, director, and producer. Architect of cultural moments.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-tp-black font-body text-tp-white">
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
