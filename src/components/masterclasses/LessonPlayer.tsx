'use client';

// Mux hosted-player embed. Signed playback passes the JWT as `token`; without a
// playback id (no asset yet) it shows a placeholder. Swapping in
// @mux/mux-player-react is a drop-in upgrade.
export function LessonPlayer({
  playbackId,
  token,
  title,
}: {
  playbackId?: string;
  token?: string;
  title?: string;
}) {
  if (!playbackId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-tp-lg border border-tp-border bg-tp-surface text-tp-muted">
        Video coming soon
      </div>
    );
  }

  const src = `https://player.mux.com/${playbackId}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  return (
    <iframe
      title={title ?? 'Lesson video'}
      src={src}
      className="aspect-video w-full rounded-tp-lg border border-tp-border"
      allow="encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
