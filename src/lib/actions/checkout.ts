'use server';

import type StripeNs from 'stripe';
import { getProductById } from '@/lib/queries/store';
import { SITE } from '@/lib/site';

// Stripe Checkout session creation (doc 05 §3.3, doc 04 §Payments). Prices are
// re-derived server-side from the catalog — never trusted from the client. Google
// Pay / Link surface automatically in Stripe-hosted Checkout.

export interface CheckoutLine {
  productId: string;
  quantity: number;
}

export async function createCheckoutSession(
  lines: CheckoutLine[],
): Promise<{ url?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Checkout is not configured yet. Add STRIPE_SECRET_KEY to enable payments.' };
  }
  if (!lines.length) {
    return { error: 'Your cart is empty.' };
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const lineItems: StripeNs.Checkout.SessionCreateParams.LineItem[] = [];
    for (const line of lines) {
      const product = await getProductById(line.productId);
      if (!product || product.status !== 'active') continue;
      const quantity = Math.max(1, Math.min(99, Math.floor(line.quantity)));
      lineItems.push({
        quantity,
        price_data: {
          currency: product.currency || 'usd',
          unit_amount: product.price,
          product_data: {
            name: product.name,
            ...(product.images[0] ? { images: [product.images[0]] } : {}),
          },
        },
      });
    }

    if (!lineItems.length) {
      return { error: 'No valid items to check out.' };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${SITE.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/cart`,
      automatic_tax: { enabled: false },
    });

    return { url: session.url ?? undefined };
  } catch (error) {
    console.error('[createCheckoutSession] failed', error);
    return { error: 'Could not start checkout. Please try again.' };
  }
}
