import { useState } from "react";

import { useChart } from "../context/ChartContext";

import indicatorConfig from "../config/indicatorConfig";

function ChartToolbar({
  timeframe,
  setTimeframe,
  symbol,
  setSymbol
}) {
  const timeframes = [
    "1m",
    "5m",
    "15m",
    "1H",
    "4H",
    "1D"
  ];

  const symbols = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "XAU/USD",
    "BTC/USD"
  ];

  const [
    showIndicatorMenu,
    setShowIndicatorMenu
  ] = useState(false);

  const {
    isIndicatorVisible,
    toggleIndicator,
    showStrategySignals,
    setShowStrategySignals,
    getIndicatorParameter,
    updateIndicatorParameter
  } = useChart();

  return (
    <div className="chart-toolbar">

      <select
        value={symbol}
        onChange={(e) =>
          setSymbol(
            e.target.value
          )
        }
      >
        {symbols.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      {timeframes.map(
        (item) => (
          <button
            key={item}
            className={
              timeframe === item
                ? "selected"
                : ""
            }
            onClick={() =>
              setTimeframe(item)
            }
          >
            {item}
          </button>
        )
      )}

      <div className="indicator-menu-container">

        <button
          className={
            showIndicatorMenu
              ? "selected"
              : ""
          }
          onClick={() =>
            setShowIndicatorMenu(
              !showIndicatorMenu
            )
          }
        >
          Indicators
        </button>

        {showIndicatorMenu && (
          <div className="indicator-menu">

            <div className="indicator-menu-title">
              Indicators
            </div>

            {Object.values(
              indicatorConfig
            ).map(
              (indicator) => {
                const period =
                  getIndicatorParameter(
                    indicator.id,
                    "period"
                  );

                return (
                  <div
                    key={
                      indicator.id
                    }
                    className="indicator-config"
                  >

                    <label className="indicator-option">

                      <input
                        type="checkbox"
                        checked={isIndicatorVisible(
                          indicator.id
                        )}
                        onChange={() =>
                          toggleIndicator(
                            indicator.id
                          )
                        }
                      />

                      <span>
                        {indicator.name}
                      </span>

                    </label>

                    {isIndicatorVisible(
                      indicator.id
                    ) &&
                      indicator.period && (
                        <div className="indicator-period">

                          <label>
                            Period
                          </label>

                          <input
                            type="number"
                            min="2"
                            max="200"
                            value={
                              period
                            }
                            onChange={(
                              e
                            ) =>
                              updateIndicatorParameter(
                                indicator.id,
                                "period",
                                Number(
                                  e.target.value
                                )
                              )
                            }
                          />

                        </div>
                      )}

                  </div>
                );
              }
            )}

            <div className="indicator-divider" />

            <div className="indicator-menu-title">
              Strategy
            </div>

            <label className="indicator-option">

              <input
                type="checkbox"
                checked={
                  showStrategySignals
                }
                onChange={(e) =>
                  setShowStrategySignals(
                    e.target.checked
                  )
                }
              />

              <span>
                Strategy signals
              </span>

            </label>

          </div>
        )}
      </div>

      <button>
        Trendline
      </button>

    </div>
  );
}

export default ChartToolbar;