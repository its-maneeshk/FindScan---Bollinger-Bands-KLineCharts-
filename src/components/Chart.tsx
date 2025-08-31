import React, { useEffect, useRef } from "react";

const Chart: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && !(window as any).TradingView) return;

    new (window as any).TradingView.widget({
      autosize: true, 
      symbol: "AAPL",
      interval: "60",
      container_id: container.current.id,
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#000000",
      enable_publishing: false,
      hide_legend: false,
    });
  }, []);

  return (
    <div
      id="tradingview_chart"
      ref={container}
      style={{
        height: "600px",  
        width: "100%",    
      }}
    />
  );
};

export default Chart;

