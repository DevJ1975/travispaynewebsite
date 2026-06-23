import type StripeNs from 'stripe';

// Stripe webhook (doc 04 §Payments, doc 05 §3.3). Verifies the signature against the
// raw body, then fulfills paid orders into Firestore + queues a confirmation email.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  if (!secret || !webhookSecret || !signature) {
    return new Response('Webhook not configured', { status: 400 });
  }

  const body = await request.text();
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(secret);

  let event: StripeNs.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('[stripeWebhook] signature verification failed', error);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as StripeNs.Checkout.Session;
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const { adminDb } = await import('@/lib/firebase/admin');
        const { FieldValue } = await import('firebase-admin/firestore');
        await adminDb.collection('orders').add({
          email: session.customer_details?.email ?? null,
          status: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
          subtotal: session.amount_subtotal ?? 0,
          total: session.amount_total ?? 0,
          currency: session.currency ?? 'usd',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        const email = session.customer_details?.email;
        if (email) {
          await adminDb.collection('mail').add({
            to: email,
            message: {
              subject: 'Your Travis Payne order',
              text: 'Thank you for your order. We are preparing it now.',
            },
          });
        }
      } else {
        console.info('[stripeWebhook] checkout.session.completed', session.id);
      }
    } catch (error) {
      console.error('[stripeWebhook] fulfillment failed', error);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
