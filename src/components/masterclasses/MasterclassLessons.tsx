'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LessonPlayer } from './LessonPlayer';
import {
  createMasterclassCheckout,
  enrollInMasterclass,
  getMuxPlaybackToken,
} from '@/lib/actions/masterclasses';
import { formatPrice } from '@/lib/store/format';

interface ClientLesson {
  id: string;
  title: string;
  durationSeconds: number;
  order: number;
}

interface PlayerState {
  playbackId?: string;
  token?: string;
  title?: string;
}

export function MasterclassLessons({
  classId,
  lessons,
  hasAccess,
  priceCents,
  signedIn,
  previewPlaybackId,
}: {
  classId: string;
  lessons: ClientLesson[];
  hasAccess: boolean;
  priceCents: number;
  signedIn: boolean;
  previewPlaybackId?: string;
}) {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  function play(lesson: ClientLesson) {
    setError('');
    startTransition(async () => {
      const result = await getMuxPlaybackToken(classId, lesson.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setPlayer({ playbackId: result.playbackId, token: result.token, title: lesson.title });
    });
  }

  function enroll() {
    setError('');
    startTransition(async () => {
      const result = await enrollInMasterclass(classId);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  }

  function buy() {
    setError('');
    startTransition(async () => {
      const result = await createMasterclassCheckout(classId);
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setError(result.error ?? 'Could not start checkout.');
    });
  }

  return (
    <div>
      <LessonPlayer
        playbackId={player?.playbackId ?? previewPlaybackId}
        token={player?.token}
        title={player?.title ?? 'Preview'}
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-tp-error">
          {error}
        </p>
      )}

      <div className="mt-8">
        <h2 className="font-display text-display-sm text-tp-white">Lessons</h2>
        <ol className="mt-4 divide-y divide-tp-border border-y border-tp-border">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-tp-white">
                  {lesson.order}. {lesson.title}
                </p>
                <p className="text-xs text-tp-muted">{Math.round(lesson.durationSeconds / 60)} min</p>
              </div>
              {hasAccess ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => play(lesson)}
                  className="text-sm text-tp-gold hover:underline disabled:opacity-50"
                >
                  Play
                </button>
              ) : (
                <span aria-label="Locked" className="text-tp-muted">
                  🔒
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {!hasAccess && (
        <div className="mt-8 rounded-tp-lg border border-tp-border bg-tp-surface p-6">
          {priceCents > 0 ? (
            <>
              <p className="text-tp-white">Get full access to this masterclass.</p>
              <button
                type="button"
                onClick={buy}
                disabled={pending}
                className="mt-4 inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
              >
                {pending ? '…' : `Get access — ${formatPrice(priceCents)}`}
              </button>
            </>
          ) : signedIn ? (
            <>
              <p className="text-tp-white">This class is free.</p>
              <button
                type="button"
                onClick={enroll}
                disabled={pending}
                className="mt-4 inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black disabled:opacity-50"
              >
                {pending ? '…' : 'Enroll free'}
              </button>
            </>
          ) : (
            <>
              <p className="text-tp-white">Sign in to start this free class.</p>
              <Link
                href="/admin/login"
                className="mt-4 inline-flex h-11 items-center rounded-tp-md border border-tp-gold px-6 text-tp-gold transition-colors hover:bg-tp-gold hover:text-tp-black"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
