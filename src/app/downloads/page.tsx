'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component with no SSR to avoid hydration issues
const DownloadsPageComponent = dynamic(() => import('./DownloadsPageComponent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-lg">Loading...</div>
    </div>
  )
});

export default function DownloadsPage() {
  return <DownloadsPageComponent />;
}