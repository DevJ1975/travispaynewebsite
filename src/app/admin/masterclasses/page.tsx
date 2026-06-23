import Link from 'next/link';
import { requireEditor } from '@/lib/auth/session';
import { getPublishedMasterclasses } from '@/lib/queries/masterclasses';
import { formatPrice } from '@/lib/store/format';

export const dynamic = 'force-dynamic';

export default async function AdminMasterclassesPage() {
  await requireEditor();
  const classes = await getPublishedMasterclasses();

  return (
    <div>
      <h1 className="mb-2 font-display text-display-sm text-tp-white">Masterclasses</h1>
      <p className="mb-8 text-sm text-tp-muted">
        Read-only for now — full lesson &amp; Mux asset management is a follow-up.
      </p>
      {classes.length === 0 ? (
        <p className="text-tp-gray">
          {process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? 'No classes yet.'
            : 'Connect Firebase to manage classes.'}
        </p>
      ) : (
        <ul className="divide-y divide-tp-border border-y border-tp-border">
          {classes.map((cls) => (
            <li key={cls.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-tp-white">{cls.title}</p>
                <p className="text-xs capitalize tracking-wider text-tp-muted">
                  {cls.level} · {cls.price === 0 ? 'Free' : formatPrice(cls.price)}
                </p>
              </div>
              <Link href={`/masterclasses/${cls.slug}`} className="text-sm text-tp-gold hover:underline">
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
