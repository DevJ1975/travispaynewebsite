import { requireEditor } from '@/lib/auth/session';
import { getOrdersAdmin } from '@/lib/queries/store';
import { formatPrice } from '@/lib/store/format';
import { formatDate } from '@/lib/blog/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await requireEditor();
  const orders = await getOrdersAdmin();

  return (
    <div>
      <h1 className="mb-8 font-display text-display-sm text-tp-white">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-tp-gray">
          {process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            ? 'No orders yet.'
            : 'Connect Firebase and Stripe to receive and store orders.'}
        </p>
      ) : (
        <ul className="divide-y divide-tp-border border-y border-tp-border">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-tp-white">{order.email ?? 'Guest'}</p>
                <p className="text-xs uppercase tracking-wider text-tp-muted">
                  {order.status} · {order.createdAt ? formatDate(order.createdAt) : '—'}
                </p>
              </div>
              <p className="text-tp-gold">{formatPrice(order.total, order.currency)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
