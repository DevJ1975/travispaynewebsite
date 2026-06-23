import Link from 'next/link';
import { requireEditor } from '@/lib/auth/session';
import { getAllPagesAdmin } from '@/lib/queries/pages';
import { deletePage } from '@/lib/actions/pages';
import { NewPageForm } from '@/components/admin/NewPageForm';
import { formatDate } from '@/lib/blog/utils';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const user = await requireEditor();
  const pages = await getAllPagesAdmin();

  return (
    <div>
      <h1 className="mb-2 font-display text-display-sm text-tp-white">Pages</h1>
      <p className="mb-8 text-sm text-tp-muted">
        Build and publish marketing pages with the visual editor.
      </p>

      <div className="mb-10 rounded-tp-lg border border-tp-border bg-tp-surface p-6">
        <h2 className="mb-4 text-overline uppercase text-tp-gold">New page</h2>
        <NewPageForm />
      </div>

      {pages.length === 0 ? (
        <p className="text-tp-gray">No pages yet. Create one above.</p>
      ) : (
        <ul className="divide-y divide-tp-border border-y border-tp-border">
          {pages.map((page) => (
            <li key={page.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-display text-xl text-tp-white">{page.title}</p>
                <p className="text-xs uppercase tracking-wider text-tp-muted">
                  /{page.slug} · {page.status}
                  {page.updatedAt ? ` · ${formatDate(page.updatedAt)}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/pages/${page.id}/edit`} className="text-sm text-tp-gold hover:underline">
                  Edit
                </Link>
                {page.status === 'published' && (
                  <a
                    href={`/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-tp-gray hover:text-tp-gold"
                  >
                    View
                  </a>
                )}
                {user.role === 'admin' && (
                  <form action={deletePage.bind(null, page.id)}>
                    <button type="submit" className="text-sm text-tp-error hover:underline">
                      Delete
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
