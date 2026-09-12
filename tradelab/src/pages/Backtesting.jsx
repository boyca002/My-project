import { useState } from "react";

import strategyConfig from "../config/strategyConfig";

import { getMarketData } from "../services/marketAPI";

import {
  loadHistoricalData
} from "../services/historicalDataService";

import { runBacktest } from "../utils/backtestEngine";

function Backtesting() {
  const [symbol, setSymbol] =
    useState("EUR/USD");

  const [timeframe, setTimeframe] =
    useState("15m");

  const [strategy, setStrategy] =
    useState("trendMomentum");

  const [startingBalance, setStartingBalance] =
    useState(10000);

  const [riskPercent, setRiskPercent] =
    useState(1);

  const [stopLoss, setStopLoss] =
    useState(20);

  const [takeProfit, setTakeProfit] =
    useState(40);

  const [spread, setSpread] =
    useState(1);

  const [slippage, setSlippage] =
    useState(0.2);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [historicalFile, setHistoricalFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [backtestResult, setBacktestResult] =
    useState(null);

  const handleRunBacktest = async () => {
    try {
      setLoading(true);

      let candles;

      /*
        ========================================
        LOAD HISTORICAL DATA
      ========================================
      */

      if (historicalFile) {
        console.log(
          "Loading historical data from CSV..."
        );

        candles =
          await loadHistoricalData(
            historicalFile,
            startDate,
            endDate
          );

      } else {
        console.log(
          "Loading historical market data from API..."
        );

        const result =
          await getMarketData(
            symbol,
            timeframe,
            startDate,
            endDate,
            1000
          );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load market data."
          );
        }

        candles =
          result.candles;
      }

      /*
        ========================================
        VALIDATE HISTORICAL DATA
      ========================================
      */

      if (
        !candles ||
        candles.length < 50
      ) {
        throw new Error(
          "Not enough historical candles for backtesting."
        );
      }

      console.log(
        `Loaded ${candles.length} candles`
      );

      /*
        ========================================
        RUN BACKTEST
      ========================================
      */

      const result =
        runBacktest({
          candles,

          strategyId:
            strategy,

          startingBalance,

          riskPercent,

          stopLossPips:
            stopLoss,

          takeProfitPips:
            takeProfit,

          spreadPips:
            spread,

          slippagePips:
            slippage
        });

      /*
        ========================================
        CHECK BACKTEST RESULT
      ========================================
      */

      if (!result.success) {
        throw new Error(
          result.message
        );
      }

      console.log(
        "Backtest completed:",
        result
      );

      /*
        ========================================
        SAVE RESULT
      ========================================
      */

      setBacktestResult(
        result
      );

    } catch (error) {
      console.error(
        "Backtest error:",
        error
      );

      alert(
        error.message ||
          "Backtest failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="page-header">

        <div>

          <h1>
            Backtesting
          </h1>

          <p>
            Test your trading strategy against historical market data.
          </p>

        </div>

      </div>

      {/* ========================================
          BACKTEST PANEL
      ======================================== */}

      <div className="backtest-panel">

        {/* ========================================
            MARKET CONFIGURATION
        ======================================== */}

        <div className="backtest-section">

          <h2>
            Market Configuration
          </h2>

          <div className="backtest-grid">

            <div className="backtest-field">

              <label>
                Symbol
              </label>

              <select
                value={symbol}
                onChange={(e) =>
                  setSymbol(
                    e.target.value
                  )
                }
              >

                <option>
                  EUR/USD
                </option>

                <option>
                  GBP/USD
                </option>

                <option>
                  USD/JPY
                </option>

                <option>
                  XAU/USD
                </option>

                <option>
                  BTC/USD
                </option>

              </select>

            </div>

            <div className="backtest-field">

              <label>
                Timeframe
              </label>

              <select
                value={timeframe}
                onChange={(e) =>
                  setTimeframe(
                    e.target.value
                  )
                }
              >

                <option>
                  1m
                </option>

                <option>
                  5m
                </option>

                <option>
                  15m
                </option>

                <option>
                  1H
                </option>

                <option>
                  4H
                </option>

                <option>
                  1D
                </option>

              </select>

            </div>

            <div className="backtest-field">

              <label>
                Strategy
              </label>

              <select
                value={strategy}
                onChange={(e) =>
                  setStrategy(
                    e.target.value
                  )
                }
              >

                {Object.values(
                  strategyConfig
                ).map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>

                ))}

              </select>

            </div>

          </div>

        </div>

        {/* ========================================
            ACCOUNT & RISK
        ======================================== */}

        <div className="backtest-section">

          <h2>
            Account & Risk
          </h2>

          <div className="backtest-grid">

            <div className="backtest-field">

              <label>
                Starting Balance
              </label>

              <input
                type="number"
                min="100"
                value={startingBalance}
                onChange={(e) =>
                  setStartingBalance(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                Risk Per Trade (%)
              </label>

              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={riskPercent}
                onChange={(e) =>
                  setRiskPercent(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* ========================================
            TRADE PARAMETERS
        ======================================== */}

        <div className="backtest-section">

          <h2>
            Trade Parameters
          </h2>

          <div className="backtest-grid">

            <div className="backtest-field">

              <label>
                Stop Loss (pips)
              </label>

              <input
                type="number"
                min="1"
                value={stopLoss}
                onChange={(e) =>
                  setStopLoss(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                Take Profit (pips)
              </label>

              <input
                type="number"
                min="1"
                value={takeProfit}
                onChange={(e) =>
                  setTakeProfit(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                Spread (pips)
              </label>

              <input
                type="number"
                min="0"
                step="0.1"
                value={spread}
                onChange={(e) =>
                  setSpread(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                Slippage (pips)
              </label>

              <input
                type="number"
                min="0"
                step="0.1"
                value={slippage}
                onChange={(e) =>
                  setSlippage(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* ========================================
            HISTORICAL PERIOD
        ======================================== */}

        <div className="backtest-section">

          <h2>
            Historical Period
          </h2>

          <div className="backtest-grid">

            <div className="backtest-field">

              <label>
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="backtest-field">

              <label>
                Historical Data CSV
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setHistoricalFile(
                    e.target.files[0] ||
                      null
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* ========================================
            BACKTEST SUMMARY
        ======================================== */}

        <div className="backtest-summary">

          <div>

            <span>
              Symbol
            </span>

            <strong>
              {symbol}
            </strong>

          </div>

          <div>

            <span>
              Strategy
            </span>

            <strong>
              {
                strategyConfig[
                  strategy
                ]?.name
              }
            </strong>

          </div>

          <div>

            <span>
              Starting Balance
            </span>

            <strong>
              $
              {startingBalance.toFixed(2)}
            </strong>

          </div>

          <div>

            <span>
              Risk
            </span>

            <strong>
              {riskPercent}%
            </strong>

          </div>

          <div>

            <span>
              Data Source
            </span>

            <strong>
              {
                historicalFile
                  ? "CSV"
                  : "Market API"
              }
            </strong>

          </div>

        </div>

        {/* ========================================
            RUN BACKTEST BUTTON
        ======================================== */}

        <button
          className="run-backtest-button"
          onClick={
            handleRunBacktest
          }
          disabled={loading}
        >

          {loading
            ? "Preparing Backtest..."
            : "Run Backtest"}

        </button>

        {/* ========================================
            BACKTEST RESULTS
        ======================================== */}

        {backtestResult && (

          <div className="backtest-results">

            <h2>
              Backtest Results
            </h2>

            <div className="backtest-results-grid">

              <div className="backtest-result-card">

                <span>
                  Starting Balance
                </span>

                <strong>
                  $
                  {backtestResult.startingBalance.toFixed(2)}
                </strong>

              </div>


              <div className="backtest-result-card">

                <span>
                  Ending Balance
                </span>

                <strong>
                  $
                  {backtestResult.endingBalance.toFixed(2)}
                </strong>

              </div>

              <div className="backtest-result-card">

                <span>
                  Net P/L
                </span>

                <strong>
                  $
                  {backtestResult.netProfit.toFixed(2)}
                </strong>

              </div>

              <div className="backtest-result-card">

                <span>
                  Total Trades
                </span>

                <strong>
                  {backtestResult.totalTrades}
                </strong>

              </div>

              <div className="backtest-result-card">

                <span>
                  Wins
                </span>

                <strong>
                  {backtestResult.wins}
                </strong>

              </div>
              <div className="backtest-result-card">

  <span>
    Profit Factor
  </span>

  <strong>
    {Number.isFinite(
      backtestResult.profitFactor
    )
      ? backtestResult.profitFactor.toFixed(2)
      : "∞"}
  </strong>

</div>

<div className="backtest-result-card">

  <span>
    Expectancy
  </span>

  <strong>
    $
    {backtestResult.expectancy.toFixed(2)}
  </strong>

</div>

              <div className="backtest-result-card">

                <span>
                  Losses
                </span>

                <strong>
                  {backtestResult.losses}
                </strong>

              </div>

              <div className="backtest-result-card">

                <span>
                  Win Rate
                </span>

                <strong>
                  {backtestResult.winRate.toFixed(2)}%
                </strong>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Backtesting;