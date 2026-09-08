import { useEffect, useRef, useState } from "react";

import {
  createChart,
  CandlestickSeries,
  LineSeries,
  createSeriesMarkers
} from "lightweight-charts";

import { getMarketData } from "../services/marketAPI";

import {
  calculateSMA,
  calculateEMA,
  calculateRSI
} from "../utils/indicators";

import { generateSignal } from "../utils/strategyEngine";

import { useChart } from "../context/ChartContext";

const CHART_HEIGHT = 650;

function TradingChart({
  symbol,
  timeframe
}) {
  const {
    isIndicatorVisible,
    showStrategySignals,
    getI

  } = useChart();

  const containerRef =
    useRef(null);

  const chartRef =
    useRef(null);

  const candleSeriesRef =
    useRef(null);

  const sma20SeriesRef =
    useRef(null);

  const sma50SeriesRef =
    useRef(null);

  const ema9SeriesRef =
    useRef(null);

  const ema21SeriesRef =
    useRef(null);

  const rsiSeriesRef =
    useRef(null);

  const rsi70LineRef =
    useRef(null);

  const rsi50LineRef =
    useRef(null);

  const rsi30LineRef =
    useRef(null);

  const markersRef =
    useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  ========================================
  CREATE CHART
  ========================================
  */

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = createChart(
      containerRef.current,
      {
        width:
          containerRef.current.clientWidth,

        height: CHART_HEIGHT,

        layout: {
          background: {
            color: "#111827"
          },

          textColor: "#9ca3af",

          panes: {
            separatorColor:
              "#374151",

            separatorHoverColor:
              "#4b5563",

            enableResize: true
          }
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
          borderColor:
            "#374151"
        },

        timeScale: {
          borderColor:
            "#374151",

          timeVisible: true,

          secondsVisible: false
        }
      }
    );

    /*
    ========================================
    CANDLESTICKS
    ========================================
    */

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

    /*
    ========================================
    INDICATOR SERIES
    ========================================
    */

    const sma20Series =
      chart.addSeries(
        LineSeries,
        {
          lineWidth: 2,

          title: "SMA 20",

          color: "#f59e0b",

          priceLineVisible: false
        }
      );

    const sma50Series =
      chart.addSeries(
        LineSeries,
        {
          lineWidth: 2,

          title: "SMA 50",

          color: "#3b82f6",

          priceLineVisible: false
        }
      );

    const ema9Series =
      chart.addSeries(
        LineSeries,
        {
          lineWidth: 1,

          title: "EMA 9",

          color: "#22c55e",

          priceLineVisible: false
        }
      );

    const ema21Series =
      chart.addSeries(
        LineSeries,
        {
          lineWidth: 1,

          title: "EMA 21",

          color: "#ef4444",

          priceLineVisible: false
        }
      );

    /*
    ========================================
    RSI PANE
    ========================================
    */

    const rsiSeries =
      chart.addSeries(
        LineSeries,
        {
          lineWidth: 2,

          title: "RSI 14",

          color: "#a855f7",

          priceLineVisible: false,

          lastValueVisible: true
        },

        1
      );

    /*
    ========================================
    RSI LEVELS
    ========================================
    */

    const rsi70Line =
      rsiSeries.createPriceLine({
        price: 70,

        color: "#ef4444",

        lineWidth: 1,

        lineStyle: 2,

        axisLabelVisible: true,

        title: "70"
      });

    const rsi50Line =
      rsiSeries.createPriceLine({
        price: 50,

        color: "#6b7280",

        lineWidth: 1,

        lineStyle: 2,

        axisLabelVisible: true,

        title: "50"
      });

    const rsi30Line =
      rsiSeries.createPriceLine({
        price: 30,

        color: "#22c55e",

        lineWidth: 1,

        lineStyle: 2,

        axisLabelVisible: true,

        title: "30"
      });

    /*
    ========================================
    RSI SCALE
    ========================================
    */

    rsiSeries
      .priceScale()
      .applyOptions({
        autoScale: false,

        scaleMargins: {
          top: 0.1,

          bottom: 0.1
        }
      });

    /*
    ========================================
    MARKERS
    ========================================
    */

    const markers =
      createSeriesMarkers(
        candleSeries,
        []
      );

    /*
    ========================================
    SAVE REFERENCES
    ========================================
    */

    chartRef.current =
      chart;

    candleSeriesRef.current =
      candleSeries;

    sma20SeriesRef.current =
      sma20Series;

    sma50SeriesRef.current =
      sma50Series;

    ema9SeriesRef.current =
      ema9Series;

    ema21SeriesRef.current =
      ema21Series;

    rsiSeriesRef.current =
      rsiSeries;

    rsi70LineRef.current =
      rsi70Line;

    rsi50LineRef.current =
      rsi50Line;

    rsi30LineRef.current =
      rsi30Line;

    markersRef.current =
      markers;

    /*
    ========================================
    RESIZE
    ========================================
    */

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

    /*
    ========================================
    CLEANUP
    ========================================
    */

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current = null;

      sma20SeriesRef.current = null;

      sma50SeriesRef.current = null;

      ema9SeriesRef.current = null;

      ema21SeriesRef.current = null;

      rsiSeriesRef.current = null;

      markersRef.current = null;
    };
  }, []);

  /*
  ========================================
  LOAD MARKET DATA
  ========================================
  */

  useEffect(() => {
    if (!symbol || !timeframe) {
      return;
    }

    let intervalId;

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

          const candles =
            result.candles;

          if (
            !candleSeriesRef.current
          ) {
            return;
          }

          /*
          ========================================
          CANDLES
          ========================================
          */

          candleSeriesRef.current.setData(
            candles
          );

          /*
          ========================================
          SMA 20
          ========================================
          */

          const sma20 =
            calculateSMA(
              candles,
              20
            );

          if (
            isIndicatorVisible("sma20")
          ) {
            sma20SeriesRef.current?.setData(
              sma20
            );
          } else {
            sma20SeriesRef.current?.setData(
              []
            );
          }

          /*
          ========================================
          SMA 50
          ========================================
          */

          const sma50 =
            calculateSMA(
              candles,
              50
            );

          if (
            isIndicatorVisible("sma50")
          ) {
            sma50SeriesRef.current?.setData(
              sma50
            );
          } else {
            sma50SeriesRef.current?.setData(
              []
            );
          }

          /*
          ========================================
          EMA 9
          ========================================
          */

          const ema9 =
            calculateEMA(
              candles,
              9
            );

          if (
            isIndicatorVisible("ema9")
          ) {
            ema9SeriesRef.current?.setData(
              ema9
            );
          } else {
            ema9SeriesRef.current?.setData(
              []
            );
          }

          /*
          ========================================
          EMA 21
          ========================================
          */

          const ema21 =
            calculateEMA(
              candles,
              21
            );

          if (
            isIndicatorVisible("ema21")
          ) {
            ema21SeriesRef.current?.setData(
              ema21
            );
          } else {
            ema21SeriesRef.current?.setData(
              []
            );
          }

          /*
          ========================================
          RSI
          ========================================
          */

          const rsi14 =
            calculateRSI(
              candles,
              14
            );

          if (
            isIndicatorVisible("rsi14")
          ) {
            rsiSeriesRef.current?.setData(
              rsi14
            );

            rsi70LineRef.current?.applyOptions({
              lineVisible: true
            });

            rsi50LineRef.current?.applyOptions({
              lineVisible: true
            });

            rsi30LineRef.current?.applyOptions({
              lineVisible: true
            });
          } else {
            rsiSeriesRef.current?.setData(
              []
            );

            rsi70LineRef.current?.applyOptions({
              lineVisible: false
            });

            rsi50LineRef.current?.applyOptions({
              lineVisible: false
            });

            rsi30LineRef.current?.applyOptions({
              lineVisible: false
            });
          }

          /*
          ========================================
          STRATEGY SIGNALS
          ========================================
          */

          if (
            showStrategySignals
          ) {
            const strategy =
              generateSignal(
                candles
              );

            const strategyMarkers = [];

            if (
              strategy.signal === "BUY"
            ) {
              strategyMarkers.push({
                time:
                  candles[
                    candles.length - 1
                  ].time,

                position:
                  "belowBar",

                color:
                  "#22c55e",

                shape:
                  "arrowUp",

                text: "BUY"
              });
            }

            if (
              strategy.signal === "SELL"
            ) {
              strategyMarkers.push({
                time:
                  candles[
                    candles.length - 1
                  ].time,

                position:
                  "aboveBar",

                color:
                  "#ef4444",

                shape:
                  "arrowDown",

                text: "SELL"
              });
            }

            markersRef.current?.setMarkers(
              strategyMarkers
            );
          } else {
            markersRef.current?.setMarkers(
              []
            );
          }

          /*
          ========================================
          FIT CHART
          ========================================
          */

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

    loadMarketData();

    intervalId =
      setInterval(
        loadMarketData,
        5000
      );

    return () => {
      clearInterval(
        intervalId
      );
    };
  }, [
    symbol,
    timeframe,
    isIndicatorVisible,
    showStrategySignals
  ]);

  /*
  ========================================
  RENDER
  ========================================
  */

  return (
    <div className="trading-chart-container">

      {loading && (
        <div className="chart-message">
          Loading {symbol} {timeframe}...
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