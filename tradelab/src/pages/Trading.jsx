import { useEffect, useState } from "react";


import AccountSummary from "../components/AccountSummary";
import { useTrading } from "../context/TradingContext";
import TopBar from "../components/TopBar";
import ChartToolbar from "../components/ChartToolBar";
import TradingChart from "../components/TradingCharts";
import OrderPanel from "../components/OrderPanel";
import PositionsPanel from "../components/PositionsPanel";
import { getMarketData } from "../services/marketAPI";

function Trading() {
  const [symbol, setSymbol] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("15m");
  const {updatePositionPrices} = useTrading();

  const [marketPrice, setMarketPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);

  useEffect(() => {
    let intervalId;

    const loadPrice = async () => {
      try {
        const result = await getMarketData(
          symbol,
          timeframe
        );

        if (
          !result.success ||
          !result.candles ||
          result.candles.length === 0
        ) {
          return;
        }

        const candles = result.candles;

        const latestCandle =
          candles[candles.length - 1];

        const previousCandle =
          candles[candles.length - 2];

        setMarketPrice(latestCandle.close);
        updatePositionPrices(
          symbol,
          latestCandle.close
        );

        if (previousCandle) {
          const change =
            ((latestCandle.close -
              previousCandle.close) /
              previousCandle.close) *
            100;

          setPriceChange(change);
        }

      } catch (error) {
        console.error(
          "Price update error:",
          error
        );
      }
    };

    loadPrice();

    intervalId = setInterval(() => {
      loadPrice();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };

  }, [symbol, timeframe,updatePositionPrices]);

  return (
    <div className="trading-page">

      <TopBar
        symbol={symbol}
        marketPrice={marketPrice}
        priceChange={priceChange}
      />

      <ChartToolbar
        symbol={symbol}
        setSymbol={setSymbol}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      />

      <AccountSummary/>

      <div className="trading-workspace">

        <div className="left-trading-area">

          <TradingChart
            symbol={symbol}
            timeframe={timeframe}
          />

          <PositionsPanel />

        </div>

        <OrderPanel
  symbol={symbol}
  marketPrice={marketPrice}
/>

      </div>

    </div>
  );
}

export default Trading;