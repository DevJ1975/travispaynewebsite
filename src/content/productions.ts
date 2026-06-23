// Portfolio data. Factual public credits (doc 01 §3); descriptions are intentionally
// neutral. Imagery is a content-freeze deliverable — cards render gradient
// placeholders until assets land (doc 01 §7), then swap to next/image.

export type ProductionCategory =
  | 'Concert Tours'
  | 'Film & TV'
  | 'Live Events'
  | 'Branded'
  | 'Theater';

export interface Production {
  slug: string;
  title: string;
  year: string;
  client: string;
  category: ProductionCategory;
  role: string;
  summary: string;
  description: string[];
  credits: { label: string; value: string }[];
  awards?: string[];
}

export const PRODUCTIONS: Production[] = [
  {
    slug: 'this-is-it',
    title: 'This Is It',
    year: '2009',
    client: 'Michael Jackson',
    category: 'Film & TV',
    role: 'Associate Director & Choreographer',
    summary:
      'Associate Director and Choreographer of the concert production, and Associate Producer of the documentary film.',
    description: [
      'Travis served as Associate Director and Choreographer for the staged production and as Associate Producer of the accompanying documentary.',
      'The film became the highest-grossing concert documentary of all time, grossing $261.3M worldwide — a Guinness World Record.',
    ],
    credits: [
      { label: 'Artist', value: 'Michael Jackson' },
      { label: 'Role', value: 'Associate Director, Choreographer, Associate Producer' },
      { label: 'Year', value: '2009' },
    ],
    awards: ['Guinness World Record — highest-grossing concert documentary'],
  },
  {
    slug: 'rhythm-nation-world-tour',
    title: 'Rhythm Nation 1814 World Tour',
    year: '1990',
    client: 'Janet Jackson',
    category: 'Concert Tours',
    role: 'Dancer & Choreographic Collaborator',
    summary: 'A defining early collaboration on one of the era’s landmark world tours.',
    description: [
      'Travis joined Janet Jackson’s Rhythm Nation 1814 World Tour, the beginning of a career spent shaping live performance at the highest level.',
    ],
    credits: [
      { label: 'Artist', value: 'Janet Jackson' },
      { label: 'Role', value: 'Dancer & Choreographic Collaborator' },
      { label: 'Year', value: '1990' },
    ],
  },
  {
    slug: 'scream',
    title: 'Scream',
    year: '1995',
    client: 'Michael & Janet Jackson',
    category: 'Film & TV',
    role: 'Choreographer',
    summary: 'Choreography for the genre-defining music video collaboration.',
    description: [
      'Travis choreographed the celebrated Michael and Janet Jackson collaboration, recognized at the MTV Video Music Awards.',
    ],
    credits: [
      { label: 'Artists', value: 'Michael & Janet Jackson' },
      { label: 'Role', value: 'Choreographer' },
      { label: 'Year', value: '1995' },
    ],
    awards: ['MTV Video Music Award'],
  },
  {
    slug: 'cirque-du-soleil-michael-jackson',
    title: 'Cirque du Soleil — Michael Jackson',
    year: '2011–2013',
    client: 'Cirque du Soleil',
    category: 'Live Events',
    role: 'Choreographer',
    summary: 'Creative contribution to both Cirque du Soleil Michael Jackson productions.',
    description: [
      'Travis contributed choreography to both Cirque du Soleil productions celebrating the music and legacy of Michael Jackson.',
    ],
    credits: [
      { label: 'Producer', value: 'Cirque du Soleil' },
      { label: 'Role', value: 'Choreographer' },
    ],
  },
  {
    slug: 'american-music-awards',
    title: 'American Music Awards',
    year: 'Various',
    client: 'dick clark productions',
    category: 'Live Events',
    role: 'Choreographer & Director',
    summary: 'Award-show performances staged for live broadcast audiences.',
    description: [
      'Travis has staged marquee performances for the American Music Awards, crafting moments built for the scale of live broadcast.',
    ],
    credits: [
      { label: 'Show', value: 'American Music Awards' },
      { label: 'Role', value: 'Choreographer & Director' },
    ],
  },
  {
    slug: 'dancing-with-the-stars',
    title: 'Dancing With the Stars',
    year: 'Various',
    client: 'BBC / ABC',
    category: 'Film & TV',
    role: 'Choreographer',
    summary: 'Television choreography for one of the world’s most-watched dance formats.',
    description: [
      'Travis has created choreography for Dancing With the Stars, translating live performance for the television screen.',
    ],
    credits: [
      { label: 'Show', value: 'Dancing With the Stars' },
      { label: 'Role', value: 'Choreographer' },
    ],
  },
];

export const PRODUCTION_CATEGORIES = [
  'All',
  'Concert Tours',
  'Film & TV',
  'Live Events',
  'Branded',
  'Theater',
] as const;

export function getProduction(slug: string): Production | undefined {
  return PRODUCTIONS.find((production) => production.slug === slug);
}
