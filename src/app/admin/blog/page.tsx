import Link from 'next/link';
import { requireEditor } from '@/lib/auth/session';
import { getAllPostsAdmin } from '@/lib/queries/blog';
import { formatDate } from '@/lib/blog/utils';
import { deletePost } from '@/lib/actions/posts';

export const dynamic = 'force-dynamic';

export default async function AdminBlogListPage() {
  const user = await requireEditor();
  const posts = await getAllPostsAdmin();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-display-sm text-tp-white">Posts</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-11 items-center rounded-tp-md bg-tp-gold px-6 font-medium text-tp-black"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-tp-gray">
          {process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? 'No posts yet. Create your first post.'
            : 'Connect a Firebase project to create and store posts.'}
        </p>
      ) : (
        <ul className="divide-y divide-tp-border border-y border-tp-border">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-display text-xl text-tp-white">{post.title}</p>
                <p className="text-xs uppercase tracking-wider text-tp-muted">
                  {post.status} · {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/blog/${post.id}`} className="text-sm text-tp-gold hover:underline">
                  Edit
                </Link>
                {user.role === 'admin' && (
                  <form action={deletePost.bind(null, post.id)}>
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
