export interface Milestone {
  year: string;
  title: string;
  detail: string;
}

export const BIO: string[] = [
  'Travis Payne began dancing at age seven in Atlanta, and by nineteen had joined Janet Jackson’s Rhythm Nation 1814 World Tour — the start of a career spent at the center of popular culture.',
  'In 1992 he began a roughly twenty-year collaboration and friendship with Michael Jackson, culminating as Associate Director and Choreographer of the This Is It production and Associate Producer of its documentary, the highest-grossing concert documentary of all time.',
  'In 2011 he founded Travis Payne Productions, a company spanning filmed, live, and branded entertainment, and continues to create alongside frequent collaborator Stacy Walker.',
];

export const MILESTONES: Milestone[] = [
  { year: 'Age 7', title: 'Began Dancing', detail: 'Started his training in Atlanta.' },
  {
    year: '1990',
    title: 'Rhythm Nation 1814 World Tour',
    detail: 'Joined Janet Jackson’s landmark world tour.',
  },
  {
    year: '1992',
    title: 'Michael Jackson',
    detail: 'Began a ~20-year collaboration, starting with Remember The Time.',
  },
  {
    year: '2009',
    title: 'This Is It',
    detail: 'Associate Director & Choreographer; Associate Producer of the documentary.',
  },
  {
    year: '2011',
    title: 'Travis Payne Productions',
    detail: 'Founded his company for filmed, live, and branded entertainment.',
  },
  {
    year: 'Today',
    title: 'A Career in Moments',
    detail: 'Choreography, direction, and production across the globe.',
  },
];

export const AWARDS: string[] = [
  '3 × American Choreography Awards',
  '3 × MTV Video Music Awards',
  'Guinness World Record — This Is It documentary',
];

export const PRESS_QUOTE = {
  quote: 'Movement is the message.',
  cite: 'Travis Payne',
};
