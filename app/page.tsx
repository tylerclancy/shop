import Image from 'next/image';
import CheckoutButton from './components/CheckoutButton';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='flex flex-col items-center'>
        <h1>Fullstack Shop Demo</h1>
        <p>Built using Next.js, TailwindCSS, daisyui, Supabase, and Stripe.</p>
      </div>
      <div>
        <CheckoutButton />
      </div>
    </main>
  );
}
