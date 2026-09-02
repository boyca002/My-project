import { useState } from "react";

function ChartToolbar({ timeframe, setTimeframe, symbol, setSymbol }) {
  const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D"];

  const symbols = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "XAU/USD",
    "BTC/USD"
  ];

  return (
    <div className="chart-toolbar">

      {/* Symbol */}
      <select
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        {symbols.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {/* Timeframes */}
      {timeframes.map((item) => (
        <button
          key={item}
          className={timeframe === item ? "selected" : ""}
          onClick={() => setTimeframe(item)}
        >
          {item}
        </button>
      ))}

      {/* Tools */}
      <button>
        Indicators
      </button>

      <button>
        Trendline
      </button>

    </div>
  );
}

export default ChartToolbar;