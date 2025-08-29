'use client';

import { useState } from 'react';
import { Chart } from '@/components/Chart';
import { BollingerSettings } from '@/components/BollingerSettings';
import type { BBSettings } from '@/lib/types';

export default function Page() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<BBSettings>({
    length: 20,
    multiplier: 2,
    offset: 0,
    maType: 'SMA',
    source: 'close',
    showUpper: true,
    showBasis: true,
    showLower: true,
    upperColor: '#22d3ee',
    basisColor: '#f59e0b',
    lowerColor: '#f43f5e',
    lineWidth: 1,
    lineStyle: 'solid',
    showBackground: true,
    backgroundOpacity: 0.12,
  });

  return (
    <main className="p-4 md:p-8 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Bollinger Bands (BB)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 transition"
          >
            Settings
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr,300px] gap-4">
        <div className="rounded-2xl bg-[var(--card)] p-2">
          <Chart settings={settings} />
        </div>

        <div className="rounded-2xl bg-[var(--card)] p-4 space-y-2">
          <h2 className="font-medium text-lg">Indicator</h2>
          <div className="text-sm text-[var(--muted)]">
            Add/remove lines, tweak colors, width, opacity and parameters.
          </div>
          <BollingerSettings
            open={open}
            onOpenChange={setOpen}
            settings={settings}
            onChange={setSettings}
          />
        </div>
      </div>
    </main>
  );
}
