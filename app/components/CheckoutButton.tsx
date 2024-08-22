'use client';

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) {
      toast.error('You must be logged in to checkout.');
      return;
    }

    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_1PqPa0D4FvYVlZiqPaLFb9W1',
        userId: data.user?.id,
        email: data.user?.email,
      }),
    });

    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className='flex flex-col items-center'>
      <p>Clicking this button will create a new Stripe Checkout Session.</p>
      <button onClick={handleCheckout} className='btn btn-accent'>
        Subscribe
      </button>
    </div>
  );
}
