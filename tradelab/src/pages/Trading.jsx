import { useState } from "react";

import TopBar from "../components/TopBar";
import TradingChart from "../components/TradingCharts";
import OrderPanel from "../components/OrderPanel";
import PositionsPanel from "../components/PositionsPanel";
import ChartToolbar from "../components/ChartToolBar";

function Trading() {

  const [timeframe, setTimeframe] = useState("15m");

  const [symbol, setSymbol] = useState("EUR/USD");

  return (
    <div className="trading-page">

      <TopBar />

      <ChartToolbar
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        symbol={symbol}
        setSymbol={setSymbol}
      />

      <div className="trading-workspace">

        <div className="left-trading-area">

          <TradingChart
            timeframe={timeframe}
            symbol={symbol}
          />

          <PositionsPanel />

        </div>

        <OrderPanel />

      </div>

    </div>
  );
}

export default Trading;