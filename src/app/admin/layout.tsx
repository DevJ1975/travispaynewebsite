import Link from 'next/link';
import { getSessionUser } from '@/lib/auth/session';
import { signOutAction } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen pt-20">
      <div className="border-b border-tp-border bg-tp-surface">
        <div className="mx-auto flex max-w-site items-center justify-between px-6 py-4 md:px-16">
          <div className="flex items-center gap-6">
            <Link href="/admin/blog" className="font-display text-lg text-tp-white">
              Admin
            </Link>
            <Link href="/admin/blog" className="text-sm text-tp-gray hover:text-tp-gold">
              Blog
            </Link>
            <Link href="/admin/orders" className="text-sm text-tp-gray hover:text-tp-gold">
              Orders
            </Link>
            <Link href="/admin/masterclasses" className="text-sm text-tp-gray hover:text-tp-gold">
              Masterclasses
            </Link>
          </div>
          {user ? (
            <form action={signOutAction} className="flex items-center gap-4">
              <span className="text-xs text-tp-muted">{user.email}</span>
              <button type="submit" className="text-sm text-tp-gray hover:text-tp-gold">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/admin/login" className="text-sm text-tp-gold">
              Sign in
            </Link>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-site px-6 py-12 md:px-16">{children}</div>
    </div>
  );
}
