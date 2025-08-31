'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ChartProps {
  symbol?: string;
  interval?: string;
  height?: string; 
}

export default function Chart({ symbol = "AAPL", interval = "60", height = "70vh" }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    function initWidget() {
      if (!(window as any).TradingView) return;

      new (window as any).TradingView.widget({
        container_id: containerRef.current?.id,
        autosize: true,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        style: "1",
        locale: "en",
        hide_top_toolbar: false,
        hide_legend: false,
        withdateranges: true,
      });

      setLoading(false);
    }

    if (!(window as any).TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval]);

  return (
    <div
      className="relative w-full rounded-2xl shadow-xl bg-[#0b1220]/70 backdrop-blur-md overflow-hidden"
      style={{ height }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0b1220]">
          <span className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></span>
        </div>
      )}
      <div id="tradingview_chart" ref={containerRef} className="w-full h-full" />
    </div>
  );
}
