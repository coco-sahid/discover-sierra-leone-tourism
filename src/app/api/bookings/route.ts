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

const TOUR_PRICES: Record<string, { name: string; price: number }> = {
  guided_tour: { name: 'Guided Tour', price: 5000 },
  transport: { name: 'Transport', price: 3000 },
  accommodation: { name: 'Full Package', price: 10000 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destinationId, destinationName, tourType, tourDate, numberOfGuests, userId } = body;

    if (!destinationId || !tourType || !tourDate || !numberOfGuests || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!TOUR_PRICES[tourType]) {
      return NextResponse.json(
        { error: 'Invalid tour type' },
        { status: 400 }
      );
    }

    const pricePerPerson = TOUR_PRICES[tourType].price;
    const totalAmount = pricePerPerson * numberOfGuests;

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        destination_id: destinationId,
        user_id: userId,
        tour_type: tourType,
        tour_date: tourDate,
        number_of_guests: numberOfGuests,
        status: 'pending',
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${TOUR_PRICES[tourType].name} - ${destinationName}`,
              description: `Tour on ${tourDate} for ${numberOfGuests} guest${numberOfGuests > 1 ? 's' : ''}`,
            },
            unit_amount: pricePerPerson,
          },
          quantity: numberOfGuests,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin') || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3000'}/destinations?cancelled=true`,
      metadata: {
        booking_id: booking.id,
        destination_id: destinationId,
        user_id: userId,
      },
    });

    await supabaseAdmin
      .from('bookings')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', booking.id);

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
