export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

// Leadership (doc 01). Full roster is a content-freeze deliverable.
export const LEADERSHIP: TeamMember[] = [
  {
    name: 'Travis Payne',
    role: 'Founder · Director · Choreographer',
    bio: 'Architect of cultural moments across three decades — from world tours to film, television, and brand spectacles.',
  },
  {
    name: 'Stacy Walker',
    role: 'Co-Director · Choreographer · Producer',
    bio: 'Frequent creative partner, collaborating with Travis on choreography, direction, and production.',
  },
];
