'use client';

import type { BBSettings } from '@/lib/types';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  settings: BBSettings;
  onChange: (s: BBSettings) => void;
};

export function BollingerSettings({ open, onOpenChange, settings, onChange }: Props) {
  const S = settings;
  const set = (patch: Partial<BBSettings>) => onChange({ ...S, ...patch });

  return (
    <div className={"fixed inset-0 " + (open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={"absolute inset-0 transition " + (open ? "bg-black/40" : "bg-transparent")}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={
          "absolute right-0 top-0 h-full w-[360px] bg-[var(--card)] p-4 shadow-xl transition " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">BB Settings</h3>
          <button onClick={() => onOpenChange(false)} className="px-2 py-1 rounded-lg bg-white/10">
            Close
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto max-h-[calc(100%-3rem)] pr-1">
          <section>
            <div className="font-medium mb-2">Inputs</div>
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-2 text-sm opacity-80">Length</label>
              <input type="number" min={1} value={S.length} onChange={e=>set({length:+e.target.value||1})}
                className="bg-white/10 rounded px-2 py-1" />
              <label className="col-span-2 text-sm opacity-80">Multiplier</label>
              <input type="number" step="0.1" value={S.multiplier} onChange={e=>set({multiplier:+e.target.value||0})}
                className="bg-white/10 rounded px-2 py-1" />
              <label className="col-span-2 text-sm opacity-80">Offset</label>
              <input type="number" value={S.offset} onChange={e=>set({offset:+e.target.value||0})}
                className="bg-white/10 rounded px-2 py-1" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <label className="col-span-2 text-sm opacity-80">Basic MA Type</label>
              <select disabled value={S.maType} onChange={e=>set({maType:e.target.value as any})}
                className="bg-white/10 rounded px-2 py-1">
                <option value="SMA">SMA (only)</option>
              </select>
              <label className="col-span-2 text-sm opacity-80">Source</label>
              <select disabled value={S.source} onChange={e=>set({source:e.target.value as any})}
                className="bg-white/10 rounded px-2 py-1">
                <option value="close">close (only)</option>
              </select>
            </div>
          </section>

          <section>
            <div className="font-medium mb-2">Styles</div>
            <div className="space-y-3">
              <div className="grid grid-cols-[auto,1fr,4rem] gap-2 items-center">
                <label className="text-sm opacity-80">Upper</label>
                <input type="color" value={S.upperColor} onChange={e=>set({upperColor:e.target.value})}
                  className="w-full h-9 bg-transparent" />
                <input type="checkbox" checked={S.showUpper} onChange={e=>set({showUpper:e.target.checked})}
                  title="Visible" />
              </div>
              <div className="grid grid-cols-[auto,1fr,4rem] gap-2 items-center">
                <label className="text-sm opacity-80">Basis</label>
                <input type="color" value={S.basisColor} onChange={e=>set({basisColor:e.target.value})}
                  className="w-full h-9 bg-transparent" />
                <input type="checkbox" checked={S.showBasis} onChange={e=>set({showBasis:e.target.checked})}
                  title="Visible" />
              </div>
              <div className="grid grid-cols-[auto,1fr,4rem] gap-2 items-center">
                <label className="text-sm opacity-80">Lower</label>
                <input type="color" value={S.lowerColor} onChange={e=>set({lowerColor:e.target.value})}
                  className="w-full h-9 bg-transparent" />
                <input type="checkbox" checked={S.showLower} onChange={e=>set({showLower:e.target.checked})}
                  title="Visible" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              <label className="col-span-2 text-sm opacity-80">Line width</label>
              <input type="number" min={1} max={4} value={S.lineWidth}
                onChange={e=>set({lineWidth: Math.max(1, Math.min(4, +e.target.value||1))})}
                className="bg-white/10 rounded px-2 py-1" />
              <label className="col-span-2 text-sm opacity-80">Line style</label>
              <select value={S.lineStyle} onChange={e=>set({lineStyle: e.target.value as any})}
                className="bg-white/10 rounded px-2 py-1">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </section>

          <section>
            <div className="font-medium mb-2">Background</div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <label className="col-span-2 text-sm opacity-80">Visible</label>
              <input type="checkbox" checked={S.showBackground} onChange={e=>set({showBackground:e.target.checked})} />
              <label className="col-span-2 text-sm opacity-80">Opacity</label>
              <input type="range" min={0} max={1} step={0.01} value={S.backgroundOpacity}
                onChange={e=>set({backgroundOpacity: +e.target.value})} />
            </div>
          </section>

          <section className="text-xs text-[var(--muted)] leading-relaxed">
            <div><strong>Std Dev choice:</strong> This demo uses <em>population</em> standard deviation (divide by N).</div>
            <div>You can switch to sample (divide by N - 1) inside <code>lib/indicators/bollinger.ts</code>.</div>
          </section>
        </div>
      </div>
    </div>
  );
}
