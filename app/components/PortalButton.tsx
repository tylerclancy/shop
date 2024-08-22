'use client';

import { createPortalSession } from '../portal/portalAction';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

export default function PortalButton() {
  const handleClick = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw 'You must be logged in to access the portal.';
      }

      const { data: customer, error: fetchError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single();

      const { url } = await createPortalSession(customer?.stripe_customer_id);

      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast.error('Error creating portal session.');
    }
  };

  return (
    <div>
      <button onClick={handleClick} className='btn btn-accent'>
        Manage Billing
      </button>
    </div>
  );
}
