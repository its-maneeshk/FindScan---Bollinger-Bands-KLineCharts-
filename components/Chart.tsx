'use client';

import { useEffect, useRef } from 'react';
import { init, dispose, registerIndicator, overrideIndicator } from 'klinecharts';
import type { KLineData, Chart as KChart } from 'klinecharts';
import { BBIndicator } from '@/lib/indicators/bollinger';
import type { BBSettings } from '@/lib/types';

type Props = { settings: BBSettings };

export function Chart({ settings }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<KChart | null>(null);

  // register indicator once
  useEffect(() => {
    registerIndicator(BBIndicator);
  }, []);

  // init / dispose chart
  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = init(containerRef.current);
    fetch('/data/ohlcv.json')
      .then(r => r.json())
      .then((data: KLineData[]) => {
        chartRef.current?.setData(data);
        // create indicator on price pane
        chartRef.current?.createIndicator('BB', false, { id: 'candle_pane' });
      });

    return () => {
      if (chartRef.current) {
        dispose(chartRef.current);
        chartRef.current = null;
      }
    };
  }, []);

  // react to settings changes: update calc params + figure styles
  useEffect(() => {
    if (!chartRef.current) return;
    // Use overrideIndicator to push updates
    overrideIndicator({
      name: 'BB',
      calcParams: [settings.length, settings.multiplier, settings.offset],
      figures: [
        {
          key: 'upper',
          styles: {
            color: settings.upperColor,
            size: settings.lineWidth,
            style: settings.lineStyle,
            visible: settings.showUpper,
          },
        },
        {
          key: 'basis',
          styles: {
            color: settings.basisColor,
            size: settings.lineWidth,
            style: settings.lineStyle,
            visible: settings.showBasis,
          },
        },
        {
          key: 'lower',
          styles: {
            color: settings.lowerColor,
            size: settings.lineWidth,
            style: settings.lineStyle,
            visible: settings.showLower,
          },
        },
        // Background fill is drawn in the indicator's draw() using these custom style slots:
        {
          key: 'background',
          styles: {
            // Use hex with alpha; we compute rgba in draw using opacity
            color: settings.upperColor,
            opacity: settings.showBackground ? settings.backgroundOpacity : 0,
            visible: settings.showBackground,
          },
        },
      ],
    });
  }, [settings]);

  return <div ref={containerRef} className="w-full h-[70vh] rounded-xl" />;
}
