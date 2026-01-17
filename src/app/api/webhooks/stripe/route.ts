import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not configured - skipping signature verification');
  }

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } else {
      event = JSON.parse(body) as Stripe.Event;
      console.warn('Processing webhook without signature verification');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata || typeof session.metadata !== 'object') {
      console.error('Invalid or missing metadata in checkout session');
      return NextResponse.json(
        { error: 'Missing metadata in checkout session' },
        { status: 400 }
      );
    }

    const bookingId = session.metadata.booking_id;

    if (!bookingId || typeof bookingId !== 'string') {
      console.error('No booking_id in session metadata:', session.metadata);
      return NextResponse.json(
        { error: 'Missing booking_id in metadata' },
        { status: 400 }
      );
    }

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || null;

    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'confirmed',
        ...(paymentIntentId && { stripe_payment_intent_id: paymentIntentId }),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    console.log(`Booking ${bookingId} confirmed with payment intent ${paymentIntentId}`);
  }

  return NextResponse.json({ received: true });
}
