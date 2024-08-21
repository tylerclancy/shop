'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import LoginForm from './LoginForm';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Get the current user from Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        // If a user is found, fetch their Stripe customer data from the stripe_customers table
        const { data: stripeCustomerData, error } = await supabase
          .from('stripe_customers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.log('No Stripe customer data found.');
        } else {
          setStripeCustomer(stripeCustomerData);
        }
      }
    };

    fetchUser();

    // Set up a listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          if (session) {
            setUser(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setStripeCustomer(null);
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <h1>User Data</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Supabase User ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>

          <h1>Stripe Customer Data</h1>
          {stripeCustomer ? (
            <div>
              <p>Data from stripe_customers table in Supabase</p>
              {/* Display the Stripe customer data in a formatted JSON structure */}
              <pre>
                <code>{JSON.stringify(stripeCustomer, null, 2)}</code>
              </pre>
            </div>
          ) : (
            <p>No Stripe customer data found.</p>
          )}
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
