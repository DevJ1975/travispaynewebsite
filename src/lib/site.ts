// Central site configuration: identity, navigation, and social links.
// Sourced from the current-site audit (doc 01).

export const SITE = {
  name: 'Travis Payne',
  tagline: 'Choreographer · Director · Producer',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://travispayne.com',
  email: 'travis@travispayne.com',
  phone: '(323) 665-6680',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Productions', href: '/productions' },
  { label: 'Team', href: '/team' },
  { label: 'Partners', href: '/partners' },
  { label: 'Masterclasses', href: '/masterclasses' },
  { label: 'Blog', href: '/blog' },
  { label: 'Store', href: '/store' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/travispayne1' },
  { label: 'Facebook', href: 'https://facebook.com/TRAVISPAYNEOFFICIAL' },
  { label: 'X', href: 'https://x.com/ItsTravisPayne' },
  { label: 'TikTok', href: 'https://tiktok.com/@travispayneproductions' },
  { label: 'YouTube', href: 'https://youtube.com/@TravisPayne1' },
] as const;
