'use client';

import Script from 'next/script';

export default function AdobeFontsScript() {
  return (
    <Script
      src='https://use.typekit.net/zta5oli.css'
      onLoad={() => {
        try {
          (window as any).Typekit.load({ async: true });
        } catch (error) {
          console.error(`Error loading Typekit font: ${error}`);
        }
      }}
    />
  );
}
