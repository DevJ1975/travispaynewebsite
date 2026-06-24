import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Markdown } from '@/components/blog/Markdown';
import { MasterclassLessons } from '@/components/masterclasses/MasterclassLessons';
import { getSessionUser } from '@/lib/auth/session';
import { getEnrollment, getMasterclassBySlug } from '@/lib/queries/masterclasses';
import { formatPrice } from '@/lib/store/format';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cls = await getMasterclassBySlug(slug);
  if (!cls) return {};
  return { title: cls.title, description: cls.description };
}

export default async function MasterclassDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cls = await getMasterclassBySlug(slug);
  if (!cls) notFound();

  const user = await getSessionUser();
  let hasAccess = false;
  if (user) {
    if (cls.price === 0) {
      hasAccess = true;
    } else {
      const enrollment = await getEnrollment(user.uid, cls.id);
      hasAccess = enrollment?.status === 'active';
    }
  }

  const clientLessons = cls.lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    durationSeconds: lesson.durationSeconds,
    order: lesson.order,
  }));

  return (
    <Section className="pb-32 pt-40">
      <p className="font-mono text-xs uppercase tracking-widest text-tp-gold">
        {cls.instructors.join(' · ')}
      </p>
      <h1 className="mt-3 font-display text-display-lg font-light leading-tight text-tp-white">
        {cls.title}
      </h1>
      <p className="mt-3 capitalize text-tp-gray">
        {cls.level} · {cls.durationMinutes} min · {cls.price === 0 ? 'Free' : formatPrice(cls.price)}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <MasterclassLessons
          classId={cls.id}
          lessons={clientLessons}
          hasAccess={hasAccess}
          priceCents={cls.price}
          signedIn={Boolean(user)}
          previewPlaybackId={cls.previewPlaybackId}
        />
        <aside>
          <h2 className="mb-3 text-overline uppercase text-tp-gold">About this class</h2>
          <Markdown>{cls.description}</Markdown>
        </aside>
      </div>
    </Section>
  );
}
