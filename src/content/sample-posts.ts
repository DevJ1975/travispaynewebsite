import type { BlogPost } from '@/lib/types/blog';

// Seed content shown until a live Firebase project is connected (see queries/blog.ts).
// Once Firestore `blogPosts` exists, these are no longer used.
export const SAMPLE_POSTS: BlogPost[] = [
  {
    id: 'sample-rehearsal-room',
    slug: 'the-art-of-the-rehearsal-room',
    title: 'The Art of the Rehearsal Room',
    excerpt:
      'Before the lights and the cameras, there is the room — where a show is found one count at a time.',
    bodyMdx: [
      'Every production begins in the same place: an empty room, a mirror, and a count.',
      '',
      '## Building from the count',
      '',
      'The rehearsal room is where intention becomes movement. We start slow, layering texture until the choreography carries the weight of the story.',
      '',
      '> Movement is the message.',
      '',
      'It is patient work, and it is the most important work we do.',
    ].join('\n'),
    status: 'published',
    publishedAt: '2026-05-12T10:00:00.000Z',
    authorName: 'Travis Payne',
    categories: ['Behind the Scenes'],
    tags: ['process', 'choreography'],
    featured: true,
    updatedAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'sample-staging-for-camera',
    slug: 'staging-for-the-camera',
    title: 'Staging for the Camera vs. the Arena',
    excerpt:
      'A move that lands in a stadium can disappear on screen. Designing for both is its own discipline.',
    bodyMdx: [
      'Live performance and filmed performance ask for different instincts.',
      '',
      '## Two audiences, two grammars',
      '',
      '- **Arena:** silhouette, scale, and repetition read from the back row.',
      '- **Camera:** detail, timing, and the eye-line carry the moment.',
      '',
      'The craft is knowing which language you are speaking — and when to switch.',
    ].join('\n'),
    status: 'published',
    publishedAt: '2026-04-02T10:00:00.000Z',
    authorName: 'Stacy Walker',
    categories: ['Industry'],
    tags: ['film', 'live'],
    updatedAt: '2026-04-02T10:00:00.000Z',
  },
  {
    id: 'sample-masterclass-preview',
    slug: 'inside-the-masterclass',
    title: 'Inside the Masterclass',
    excerpt: 'A look at what we are building for dancers training online with us.',
    bodyMdx: [
      'Our masterclasses distill three decades of stage and screen into something you can practice at home.',
      '',
      'Expect foundations, repertoire, and the why behind every choice.',
    ].join('\n'),
    status: 'published',
    publishedAt: '2026-03-01T10:00:00.000Z',
    authorName: 'Travis Payne',
    categories: ['Masterclasses'],
    tags: ['education'],
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
];
