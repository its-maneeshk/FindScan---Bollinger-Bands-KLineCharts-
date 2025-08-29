# Bollinger Bands + KLineCharts (Next.js + TS + Tailwind)

A minimal, production-ready starter that renders a **custom Bollinger Bands (BB)** indicator as a price overlay using **KLineCharts**.

## Quick start

```bash
npm i
npm run dev
# open http://localhost:3000
```

- Data lives in `public/data/ohlcv.json` (OHLCV, ms timestamps). Replace with your dataset when ready.
- BB indicator source is in `lib/indicators/bollinger.ts`.
- Settings panel lets you tweak: **length, multiplier, offset, line width/style, colors, per-line visibility, background visibility & opacity**.

## Notes (match the assignment)

- The overlay name is `BB`.
- Figures: **Basis**, **Upper**, **Lower** with configurable styles; background fill is drawn between Upper & Lower.
- Inputs: `Length`, `Multiplier`, `Offset`, plus UI fields for `Basic MA Type` (SMA only) and `Source` (close only).
- Standard deviation: **Population** (÷ N). You can switch to sample (÷ N-1) in the code.
- Built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Where to change things

- **Indicator math / behavior**: `lib/indicators/bollinger.ts` (calc + optional draw)
- **UI Controls**: `components/BollingerSettings.tsx`
- **Chart host**: `components/Chart.tsx`

## Caveats

- The custom `draw()` uses the v9 indicator draw context. If your installed `klinecharts` minor version doesn't expose the same shape, you can comment out the `draw()` block to remove background fill. The lines will still render and update via `overrideIndicator(...)`.
