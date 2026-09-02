import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries
} from "lightweight-charts";


const symbolData={
  "EUR/USD":{
    base:1.17
  },
  "GBP/USD":{
    base:1.35},
    "USD/JPY":{
    base:148.50},
  "XAU/USD":{
    base:3450
  },
  "BTC/USD":{
    base:110000
  },
  }



const chartData = {

  "1m": [
    {
      time: 1756807200,
      open: 1.1720,
      high: 1.1730,
      low: 1.1715,
      close: 1.1726
    },
    {
      time: 1756807260,
      open: 1.1726,
      high: 1.1735,
      low: 1.1722,
      close: 1.1731
    },
    {
      time: 1756807320,
      open: 1.1731,
      high: 1.1738,
      low: 1.1725,
      close: 1.1728
    },
    {
      time: 1756807380,
      open: 1.1728,
      high: 1.1732,
      low: 1.1719,
      close: 1.1722
    },
    {
      time: 1756807440,
      open: 1.1722,
      high: 1.1736,
      low: 1.1720,
      close: 1.1734
    }
  ],


  "5m": [
    {
      time: 1756805400,
      open: 1.1690,
      high: 1.1710,
      low: 1.1680,
      close: 1.1702
    },
    {
      time: 1756805700,
      open: 1.1702,
      high: 1.1720,
      low: 1.1695,
      close: 1.1714
    },
    {
      time: 1756806000,
      open: 1.1714,
      high: 1.1730,
      low: 1.1705,
      close: 1.1725
    },
    {
      time: 1756806300,
      open: 1.1725,
      high: 1.1740,
      low: 1.1715,
      close: 1.1735
    }
  ],


  "15m": [
    {
      time: 1756800000,
      open: 1.1650,
      high: 1.1680,
      low: 1.1630,
      close: 1.1670
    },
    {
      time: 1756800900,
      open: 1.1670,
      high: 1.1700,
      low: 1.1660,
      close: 1.1690
    },
    {
      time: 1756801800,
      open: 1.1690,
      high: 1.1720,
      low: 1.1680,
      close: 1.1710
    }
  ],


  "1H": [
    {
      time: 1756789200,
      open: 1.1580,
      high: 1.1630,
      low: 1.1560,
      close: 1.1610
    },
    {
      time: 1756792800,
      open: 1.1610,
      high: 1.1660,
      low: 1.1590,
      close: 1.1640
    },
    {
      time: 1756796400,
      open: 1.1640,
      high: 1.1690,
      low: 1.1620,
      close: 1.1670
    }
  ],


  "4H": [
    {
      time: 1756742400,
      open: 1.1500,
      high: 1.1580,
      low: 1.1480,
      close: 1.1560
    },
    {
      time: 1756756800,
      open: 1.1560,
      high: 1.1650,
      low: 1.1530,
      close: 1.1620
    },
    {
      time: 1756771200,
      open: 1.1620,
      high: 1.1700,
      low: 1.1600,
      close: 1.1680
    }
  ],


  "1D": [
    {
      time: "2026-08-28",
      open: 1.1450,
      high: 1.1550,
      low: 1.1420,
      close: 1.1520
    },
    {
      time: "2026-08-29",
      open: 1.1520,
      high: 1.1620,
      low: 1.1490,
      close: 1.1600
    },
    {
      time: "2026-08-30",
      open: 1.1600,
      high: 1.1690,
      low: 1.1570,
      close: 1.1660
    },
    {
      time: "2026-08-31",
      open: 1.1660,
      high: 1.1740,
      low: 1.1630,
      close: 1.1710
    },
    {
      time: "2026-09-01",
      open: 1.1710,
      high: 1.1760,
      low: 1.1680,
      close: 1.1730
    },
    {
      time: "2026-09-02",
      open: 1.1730,
      high: 1.1760,
      low: 1.1710,
      close: 1.1740
    }
  ]

};


function TradingChart({ timeframe, symbol }) {

  const chartContainerRef = useRef(null);

  useEffect(() => {

    if (!chartContainerRef.current) {
      return;
    }

    const chart = createChart(
      chartContainerRef.current,
      {
        width: chartContainerRef.current.clientWidth,
        height: 500,

        layout: {
          background: {
            color: "#111827"
          },

          textColor: "#9ca3af"
        },

        grid: {
          vertLines: {
            color: "#1f2937"
          },

          horzLines: {
            color: "#1f2937"
          }
        },

        rightPriceScale: {
          borderColor: "#374151"
        },

        timeScale: {
          borderColor: "#374151",
          timeVisible: true,
          secondsVisible: false
        }
      }
    );

    const series = chart.addSeries(
      CandlestickSeries,
      {
        upColor: "#22c55e",
        downColor: "#ef4444",

        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",

        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444"
      }
    );

    const basePrice = symbolData[symbol]?.base || 1.17;

    const data = chartData[timeframe].map((candle, index) => {

      const difference = candle.close - 1.17;

      return {
        time: candle.time,

        open: basePrice + difference + index * 0.0002,

        high: basePrice + difference + 0.0010,

        low: basePrice + difference - 0.0010,

        close: basePrice + difference + 0.0005
      };

    });

    series.setData(data);

    chart.timeScale().fitContent();

    const handleResize = () => {

      if (!chartContainerRef.current) {
        return;
      }

      chart.applyOptions({
        width: chartContainerRef.current.clientWidth
      });

    };

    window.addEventListener("resize", handleResize);

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();

    };

  }, [timeframe, symbol]);

  return (
    <div
      ref={chartContainerRef}
      className="trading-chart"
    />
  );
}

export default TradingChart;