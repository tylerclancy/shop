'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import LoginForm from './LoginForm';
import PortalButton from '../components/PortalButton';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stripeCustomer, setStripeCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
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

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>User Profile</h1>
      {user ? (
        <div className='space-y-6'>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>User Data</h2>
              <div className='space-y-2'>
                <p>
                  <span className='font-semibold'>Email:</span> {user.email}
                </p>
                <p>
                  <span className='font-semibold'>Supabase User ID:</span>{' '}
                  {user.id}
                </p>
              </div>
              <div className='card-actions justify-end mt-4'>
                <button onClick={handleLogout} className='btn btn-accent'>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Stripe Customer Data</h2>
              {stripeCustomer ? (
                <div>
                  <p className='mb-2'>
                    Data from stripe_customers table in Supabase:
                  </p>
                  <div className='mockup-code bg-primary text-primary-content p-4 overflow-x-auto'>
                    <pre>
                      <code>{JSON.stringify(stripeCustomer, null, 2)}</code>
                    </pre>
                  </div>
                  <div className='py-3'>
                    <PortalButton />
                  </div>
                </div>
              ) : (
                <div className='alert alert-info'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='stroke-current shrink-0 w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                  <span>No Stripe customer data found.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-4'>Login</h2>
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
}
