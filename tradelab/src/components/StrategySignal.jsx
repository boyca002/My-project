import { useEffect, useState } from "react";

import { getMarketData } from "../services/marketAPI";

import { generateSignal } from "../utils/strategyEngine";

function StrategySignal({
  symbol,
  timeframe
}) {
  const [strategyData, setStrategyData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!symbol || !timeframe) {
      return;
    }

    let intervalId;

    const loadStrategy = async () => {
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
          result.candles.length < 50
        ) {
          setStrategyData({
            signal: "HOLD",
            reason:
              "Waiting for enough market data",
            strength: 0
          });

          return;
        }

        const resultSignal =
          generateSignal(
            result.candles
          );

        setStrategyData(
          resultSignal
        );

      } catch (err) {
        console.error(
          "Strategy signal error:",
          err
        );

        setError(
          err.message ||
            "Failed to calculate strategy signal."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStrategy();

    intervalId = setInterval(() => {
      loadStrategy();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };

  }, [
    symbol,
    timeframe
  ]);

  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (loading && !strategyData) {
    return (
      <div className="strategy-signal">
        <div className="strategy-header">
          <h3>Strategy Signal</h3>
          <span>DEMO</span>
        </div>

        <div className="strategy-message">
          Calculating signal...
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // ERROR
  // ------------------------------------------

  if (error) {
    return (
      <div className="strategy-signal">
        <div className="strategy-header">
          <h3>Strategy Signal</h3>
          <span>DEMO</span>
        </div>

        <div className="strategy-error">
          {error}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // NO DATA
  // ------------------------------------------

  if (!strategyData) {
    return null;
  }

  const {
    signal,
    reason,
    strength,
    price,
    indicators
  } = strategyData;

  const signalClass =
    signal === "BUY"
      ? "signal-buy"
      : signal === "SELL"
        ? "signal-sell"
        : "signal-hold";

  return (
    <div className="strategy-signal">

      <div className="strategy-header">

        <h3>
          Strategy Signal
        </h3>

        <span>
          DEMO
        </span>

      </div>

      <div className="strategy-symbol">
        {symbol}
      </div>

      <div
        className={`signal-badge ${signalClass}`}
      >
        {signal}
      </div>

      <div className="signal-strength">

        <div className="signal-strength-header">

          <span>
            Signal strength
          </span>

          <strong>
            {strength.toFixed(0)}%
          </strong>

        </div>

        <div className="strength-bar">

          <div
            className="strength-bar-fill"
            style={{
              width: `${strength}%`
            }}
          />

        </div>

      </div>

      <div className="strategy-reason">
        {reason}
      </div>

      {price !== undefined && (
        <div className="strategy-price">

          <span>
            Price
          </span>

          <strong>
            {price.toFixed(5)}
          </strong>

        </div>
      )}

      {indicators && (
        <div className="strategy-indicators">

          <div className="indicator-row">

            <span>
              SMA 20
            </span>

            <strong>
              {indicators.sma20.toFixed(5)}
            </strong>

          </div>

          <div className="indicator-row">

            <span>
              SMA 50
            </span>

            <strong>
              {indicators.sma50.toFixed(5)}
            </strong>

          </div>

          <div className="indicator-row">

            <span>
              EMA 9
            </span>

            <strong>
              {indicators.ema9.toFixed(5)}
            </strong>

          </div>

          <div className="indicator-row">

            <span>
              EMA 21
            </span>

            <strong>
              {indicators.ema21.toFixed(5)}
            </strong>

          </div>

          <div className="indicator-row">

            <span>
              RSI 14
            </span>

            <strong>
              {indicators.rsi14.toFixed(2)}
            </strong>

          </div>

        </div>
      )}

      <div className="strategy-status">
        Signal updates automatically
      </div>

    </div>
  );
}

export default StrategySignal;