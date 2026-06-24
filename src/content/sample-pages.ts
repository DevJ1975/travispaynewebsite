import type { Data } from '@measured/puck';
import type { PageDoc } from '@/lib/types/page';

// Seed page shown until a live Firebase `pages` collection is connected, so the
// catch-all route and admin builder are demonstrable. Served at /welcome.
const welcomeData: Data = {
  root: {},
  zones: {},
  content: [
    {
      type: 'Hero',
      props: {
        id: 'hero-welcome',
        eyebrow: 'Built with the page builder',
        headline: 'A Page You Can Edit',
        subheadline: 'This page is rendered from a Puck content tree stored in Firestore.',
        ctaLabel: 'View Productions',
        ctaHref: '/productions',
        backgroundVariant: 'black',
      },
    },
    {
      type: 'RichText',
      props: {
        id: 'rt-welcome',
        body: '## Fully editable\n\nEditors arrange on-brand blocks, edit content in a side panel, and publish — no code.',
        alignment: 'left',
        spacingTop: 'lg',
        spacingBottom: 'lg',
        backgroundVariant: 'surface',
      },
    },
    {
      type: 'CTASection',
      props: {
        id: 'cta-welcome',
        heading: 'Create something extraordinary',
        subheading: 'Booking choreography, direction, and production worldwide.',
        ctaLabel: 'Get in touch',
        ctaHref: '/contact',
        backgroundVariant: 'black',
      },
    },
  ],
};

export const SAMPLE_PAGES: PageDoc[] = [
  {
    id: 'welcome',
    slug: 'welcome',
    title: 'Welcome',
    status: 'published',
    draftData: welcomeData,
    publishedData: welcomeData,
    seoTitle: 'Welcome — Travis Payne',
    seoDescription: 'A page built with the Travis Payne visual page builder.',
    showInNav: false,
    navOrder: 0,
  },
];
