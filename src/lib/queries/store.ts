import type { Order, OrderLine, Product, ProductStatus, ProductType } from '@/lib/types/store';
import { SAMPLE_PRODUCTS } from '@/content/sample-products';

// Server-only store reads via firebase-admin. Falls back to the seed catalog when
// Firebase is not configured so the storefront renders before projects exist.

type DocData = Record<string, unknown>;

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
}

async function getDb() {
  const { adminDb } = await import('@/lib/firebase/admin');
  return adminDb;
}

function toIso(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return typeof value === 'string' ? value : undefined;
}

function mapProduct(id: string, data: DocData): Product {
  return {
    id,
    name: String(data.name ?? 'Untitled'),
    slug: String(data.slug ?? id),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : undefined,
    currency: String(data.currency ?? 'usd'),
    type: (data.type as ProductType) ?? 'physical',
    status: (data.status as ProductStatus) ?? 'draft',
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    inventory: Number(data.inventory ?? 0),
    sku: data.sku ? String(data.sku) : undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    category: String(data.category ?? 'apparel'),
    featured: Boolean(data.featured),
  };
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!firebaseConfigured()) {
    return SAMPLE_PRODUCTS.filter((product) => product.status === 'active');
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('products').where('status', '==', 'active').get();
    return snapshot.docs.map((doc) => mapProduct(doc.id, doc.data()));
  } catch (error) {
    console.error('[getActiveProducts] failed', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
  try {
    const db = await getDb();
    const snapshot = await db.collection('products').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) return null;
    return mapProduct(snapshot.docs[0].id, snapshot.docs[0].data());
  } catch (error) {
    console.error('[getProductBySlug] failed', error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!firebaseConfigured()) {
    return SAMPLE_PRODUCTS.find((product) => product.id === id) ?? null;
  }
  try {
    const db = await getDb();
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return mapProduct(doc.id, (doc.data() ?? {}) as DocData);
  } catch (error) {
    console.error('[getProductById] failed', error);
    return null;
  }
}

export async function getOrdersAdmin(): Promise<Order[]> {
  if (!firebaseConfigured()) return [];
  try {
    const db = await getDb();
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').limit(100).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocData;
      return {
        id: doc.id,
        email: data.email ? String(data.email) : undefined,
        status: String(data.status ?? 'pending'),
        total: Number(data.total ?? 0),
        currency: String(data.currency ?? 'usd'),
        lineItems: Array.isArray(data.lineItems) ? (data.lineItems as OrderLine[]) : [],
        createdAt: toIso(data.createdAt),
      };
    });
  } catch (error) {
    console.error('[getOrdersAdmin] failed', error);
    return [];
  }
}
