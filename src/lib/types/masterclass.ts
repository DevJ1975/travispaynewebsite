// Canonical masterclass shapes (doc 04 §3.9–3.10). Gated lesson video is served via
// signed Mux playback; enrollment docs are keyed `{uid}_{classId}` (doc 05 C6).

export type ClassLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  title: string;
  order: number;
  durationSeconds: number;
  description?: string;
  muxPlaybackId?: string;
}

export interface Masterclass {
  id: string;
  slug: string;
  title: string;
  instructors: string[];
  description: string;
  coverImageUrl?: string;
  previewPlaybackId?: string;
  durationMinutes: number;
  level: ClassLevel;
  tags: string[];
  price: number;
  status: 'published' | 'draft';
  lessons: Lesson[];
}

export interface Enrollment {
  id: string;
  uid: string;
  masterclassId: string;
  status: 'active' | 'revoked';
}

export const MASTERCLASS_LEVELS = ['All', 'beginner', 'intermediate', 'advanced'] as const;
