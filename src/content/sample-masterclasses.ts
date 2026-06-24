import type { Masterclass } from '@/lib/types/masterclass';

// Seed catalog shown until a live Firebase `masterclasses` collection is connected.
// muxPlaybackId / previewPlaybackId are blank until real Mux assets are uploaded.
export const SAMPLE_MASTERCLASSES: Masterclass[] = [
  {
    id: 'foundation-of-groove',
    slug: 'foundation-of-groove',
    title: 'Foundation of Groove',
    instructors: ['Travis Payne'],
    description:
      'Start here. Build the timing, weight, and musicality that everything else is built on.',
    previewPlaybackId: '',
    durationMinutes: 45,
    level: 'beginner',
    tags: ['groove', 'foundations'],
    price: 0,
    status: 'published',
    lessons: [
      { id: 'l1', title: 'Finding the Pocket', order: 1, durationSeconds: 600, muxPlaybackId: '' },
      { id: 'l2', title: 'Weight & Release', order: 2, durationSeconds: 720, muxPlaybackId: '' },
    ],
  },
  {
    id: 'stagecraft-for-camera',
    slug: 'stagecraft-for-camera',
    title: 'Stagecraft for the Camera',
    instructors: ['Travis Payne', 'Stacy Walker'],
    description:
      'Translate live performance for the lens — eye-lines, timing, and detail that read on screen.',
    previewPlaybackId: '',
    durationMinutes: 70,
    level: 'intermediate',
    tags: ['film', 'performance'],
    price: 4900,
    status: 'published',
    lessons: [
      { id: 'l1', title: 'Reading the Frame', order: 1, durationSeconds: 840, muxPlaybackId: '' },
      { id: 'l2', title: 'Timing for Edits', order: 2, durationSeconds: 900, muxPlaybackId: '' },
      { id: 'l3', title: 'The Eye-Line', order: 3, durationSeconds: 780, muxPlaybackId: '' },
    ],
  },
];
