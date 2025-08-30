'use client';
import dynamic from 'next/dynamic';
import React from 'react';

// Chart is a client component; use dynamic import with ssr: false
const Chart = dynamic(() => import('../components/Chart'), { ssr: false });

export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">FindScan — Bollinger Bands Demo</h1>
      <Chart />
    </main>
  );
}
