import { useState } from "react";
import { useTrading } from "../context/TradingContext";

function OrderPanel({
  symbol,
  marketPrice
}) {
  const { openPosition } = useTrading();

  const [volume, setVolume] = useState("0.10");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const handleOrder = (side) => {
    if (marketPrice === null) {
      return;
    }

    const volumeNumber = Number(volume);

    if (!volumeNumber || volumeNumber <= 0) {
      alert("Enter a valid volume.");
      return;
    }

    openPosition({
      symbol,
      side,
      volume: volumeNumber,
      entryPrice: marketPrice,
      stopLoss: stopLoss
        ? Number(stopLoss)
        : null,
      takeProfit: takeProfit
        ? Number(takeProfit)
        : null
    });

    console.log(
      `${side} ${symbol} opened at ${marketPrice}`
    );
  };

  return (
    <aside className="order-panel">

      <div className="order-panel-header">
        <h3>Order</h3>
        <span>DEMO</span>
      </div>

      <div className="order-symbol">
        {symbol}
      </div>

      <div className="order-price">
        {marketPrice !== null
          ? marketPrice.toFixed(5)
          : "---"}
      </div>

      <div className="order-field">
        <label>Volume</label>

        <input
          type="number"
          value={volume}
          min="0.01"
          step="0.01"
          onChange={(event) =>
            setVolume(event.target.value)
          }
        />
      </div>

      <div className="order-field">
        <label>Stop Loss</label>

        <input
          type="number"
          value={stopLoss}
          placeholder="Optional"
          onChange={(event) =>
            setStopLoss(event.target.value)
          }
        />
      </div>

      <div className="order-field">
        <label>Take Profit</label>

        <input
          type="number"
          value={takeProfit}
          placeholder="Optional"
          onChange={(event) =>
            setTakeProfit(event.target.value)
          }
        />
      </div>

      <div className="order-buttons">

        <button
          className="buy-button"
          onClick={() => handleOrder("BUY")}
        >
          BUY
        </button>

        <button
          className="sell-button"
          onClick={() => handleOrder("SELL")}
        >
          SELL
        </button>

      </div>

    </aside>
  );
}

export default OrderPanel;