import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries
} from "lightweight-charts";

import { getMarketData } from "../services/marketAPI";

const CHART_HEIGHT = 500;

function TradingChart({ symbol, timeframe }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create chart
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(
      containerRef.current,
      {
        width: containerRef.current.clientWidth,
        height: CHART_HEIGHT,

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

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#22c55e",
          downColor: "#ef4444",
          borderVisible: false,
          wickUpColor: "#22c55e",
          wickDownColor: "#ef4444"
        }
      );

    chartRef.current = chart;
    candleSeriesRef.current =
      candleSeries;

    // Resize chart with window
    const handleResize = () => {
      if (!containerRef.current) {
        return;
      }

      chart.applyOptions({
        width:
          containerRef.current.clientWidth
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();

      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  // Load market data
  useEffect(() => {
    if (!symbol || !timeframe) {
      return;
    }

    const loadMarketData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getMarketData(
              symbol,
              timeframe
            );

          if (!result.success) {
            throw new Error(
              result.message ||
                "Failed to load market data."
            );
          }

          if (
            !result.candles ||
            result.candles.length === 0
          ) {
            throw new Error(
              "No candle data available."
            );
          }

          if (
            !candleSeriesRef.current
          ) {
            return;
          }

          candleSeriesRef.current.setData(
            result.candles
          );

          chartRef.current
            ?.timeScale()
            .fitContent();

        } catch (err) {
          console.error(
            "Market data error:",
            err
          );

          setError(
            err.message ||
              "Failed to load market data."
          );
        } finally {
          setLoading(false);
        }
      };

    // Load immediately
    loadMarketData();

    // Refresh every 1 second
    const intervalId =
      setInterval(() => {
        loadMarketData();
      }, 1000);

    // Cleanup interval
    return () => {
      clearInterval(intervalId);
    };

  }, [symbol, timeframe]);

  return (
    <div className="trading-chart-container">

      {loading && (
        <div className="chart-message">
          {/* Loading {symbol} {timeframe}... */}
        </div>
      )}

      {error && (
        <div className="chart-message chart-error">
          {error}
        </div>
      )}

      <div
        ref={containerRef}
        className="trading-chart"
      />

    </div>
  );
}

export default TradingChart;