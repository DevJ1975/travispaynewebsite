// Collaborators & clients (doc 01 §3). Names only — logo files are a content-freeze
// deliverable (doc 01 §7).

export interface PartnerGroup {
  category: string;
  names: string[];
}

export const PARTNER_GROUPS: PartnerGroup[] = [
  {
    category: 'Artists & Entertainment',
    names: [
      'Michael Jackson',
      'Janet Jackson',
      'Beyoncé',
      'Usher',
      'Madonna',
      'Mariah Carey',
      'Sting',
      'TLC',
      'Lenny Kravitz',
      'Diana Ross',
      'Ricky Martin',
      'Miley Cyrus',
      'Quincy Jones',
      'Mick Jagger',
      'Paula Abdul',
    ],
  },
  {
    category: 'Productions & Venues',
    names: ['Cirque du Soleil', 'dick clark productions', 'MTV', 'American Music Awards'],
  },
];

export const ALL_PARTNERS: string[] = PARTNER_GROUPS.flatMap((group) => group.names);
