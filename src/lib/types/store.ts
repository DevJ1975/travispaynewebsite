// Canonical store shapes (doc 04 §3.2–3.5). Prices are always integer cents.

export type ProductType = 'physical' | 'digital' | 'masterclass';
export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  type: ProductType;
  status: ProductStatus;
  images: string[];
  inventory: number;
  sku?: string;
  tags: string[];
  category: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  type: ProductType;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  email?: string;
  status: string;
  total: number;
  currency: string;
  lineItems: OrderLine[];
  createdAt?: string;
}

export const STORE_CATEGORIES = ['All', 'apparel', 'accessories', 'digital', 'signed'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  apparel: 'Apparel',
  accessories: 'Accessories',
  digital: 'Digital',
  signed: 'Signed Items',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category.toLowerCase()] ?? category;
}
