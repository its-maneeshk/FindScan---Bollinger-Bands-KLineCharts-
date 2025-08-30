"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  init,
  dispose,
  registerIndicator,
  Chart as KChart,
} from "klinecharts";
import { Candle } from "../lib/types";
import { computeBollingerBands } from "../lib/indicators/bollinger";
import BollingerSettings from "./BollingerSettings";
import { Settings as SettingsIcon, Loader2 } from "lucide-react";

// ---- Types ----
interface Inputs {
  length: number;
  multiplier: number;
  offset: number;
}

interface Styles {
  showBasis: boolean;
  showUpper: boolean;
  showLower: boolean;
  colorBasis: string;
  colorUpper: string;
  colorLower: string;
  lineWidth: number;
  dashed: boolean;
  fillBackground: boolean;
  fillOpacity: number;
}

// ---- Register Custom Indicator ----
registerIndicator({
  name: "CustomBOLL",
  shortName: "BOLL",
  calcParams: [20, 2, 0],
  figures: [
    { key: "basis", title: "Basis", type: "line" },
    { key: "upper", title: "Upper", type: "line" },
    { key: "lower", title: "Lower", type: "line" },
  ],
  calc: (kDataList: Candle[], { calcParams }) => {
    const [length, multiplier, offset] = calcParams;
    const results = computeBollingerBands(kDataList, {
      length,
      multiplier,
      offset,
      source: "close",
    });
    return results.map((r) => ({
      basis: r.basis,
      upper: r.upper,
      lower: r.lower,
    }));
  },
});

// ---- Component ----
export default function Chart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<KChart | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<Inputs>({
    length: 20,
    multiplier: 2,
    offset: 0,
  });

  const [styles, setStyles] = useState<Styles>({
    showBasis: true,
    showUpper: true,
    showLower: true,
    colorBasis: "#facc15", // yellow-400
    colorUpper: "#22c55e", // green-500
    colorLower: "#ef4444", // red-500
    lineWidth: 1,
    dashed: false,
    fillBackground: true,
    fillOpacity: 0.2,
  });

  // ---- Initialize chart + load data ----
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = init(containerRef.current);
    chartRef.current = chart;

    setLoading(true);
    fetch("/data/ohlcv.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((raw) => {
        const kdata: Candle[] = raw.map((d: any) => ({
          timestamp: d.timestamp,
          open: +d.open,
          high: +d.high,
          low: +d.low,
          close: +d.close,
          volume: +d.volume,
        }));

        chart.applyNewData(kdata);
        chart.createIndicator(
          {
            name: "CustomBOLL",
            calcParams: [
              inputs.length,
              inputs.multiplier,
              inputs.offset,
            ],
          },
          true,
          { id: "candle_pane" }
        );

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("⚠ Failed to load chart data");
        setLoading(false);
      });

    // Auto resize
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      if (containerRef.current) dispose(containerRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ---- Apply style updates ----
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.overrideIndicator({
      name: "CustomBOLL",
      styles: {
        basis: {
          color: styles.colorBasis,
          size: styles.lineWidth,
          style: styles.dashed ? "dash" : "solid",
          show: styles.showBasis,
        },
        upper: {
          color: styles.colorUpper,
          size: styles.lineWidth,
          style: styles.dashed ? "dash" : "solid",
          show: styles.showUpper,
        },
        lower: {
          color: styles.colorLower,
          size: styles.lineWidth,
          style: styles.dashed ? "dash" : "solid",
          show: styles.showLower,
        },
        band: styles.fillBackground
          ? {
              style: "area",
              color: styles.colorUpper,
              backgroundColor: styles.colorLower,
              opacity: styles.fillOpacity,
            }
          : undefined,
      },
    });
  }, [styles]);

  // ---- Handle settings save ----
  const handleSettingsChange = (newInputs: Inputs, newStyles: Styles) => {
    setInputs(newInputs);
    setStyles(newStyles);

    const chart = chartRef.current;
    if (chart) {
      chart.overrideIndicator({
        name: "CustomBOLL",
        calcParams: [
          newInputs.length,
          newInputs.multiplier,
          newInputs.offset,
        ],
      });
    }
  };

  return (
    <div className="p-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-semibold">📈 Trading Chart</h2>
        <button
          className="p-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Chart Container */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading chart...
        </div>
      )}
      {error && <div className="text-red-400 mb-2">{error}</div>}

      <div
        ref={containerRef}
        className="rounded-lg shadow-md"
        style={{ width: "100%", height: "600px", background: "#0b1220" }}
      />

      {/* Settings Modal */}
      <BollingerSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        inputs={inputs}
        styles={styles}
        onChange={handleSettingsChange}
      />
    </div>
  );
}
