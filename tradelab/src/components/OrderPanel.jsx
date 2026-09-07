import { useEffect, useState } from "react";
import { useTrading } from "../context/TradingContext";

function OrderPanel({
  symbol,
  marketPrice
}) {
  const {
    openPosition,
    maxRiskAmount
  } = useTrading();

  const [volume, setVolume] = useState("0.10");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const [suggestedVolume, setSuggestedVolume] =
    useState(null);

  const [actualRisk, setActualRisk] =
    useState(null);

  const [potentialReward, setPotentialReward] =
    useState(null);

  const [riskReward, setRiskReward] =
    useState(null);

  // Calculate suggested volume
  useEffect(() => {
    if (
      marketPrice === null ||
      !stopLoss
    ) {
      setSuggestedVolume(null);
      return;
    }

    const stopLossPrice = Number(stopLoss);

    if (
      !stopLossPrice ||
      stopLossPrice <= 0
    ) {
      setSuggestedVolume(null);
      return;
    }

    const distance =
      Math.abs(
        marketPrice - stopLossPrice
      );

    if (distance === 0) {
      setSuggestedVolume(null);
      return;
    }

    const pipSize = 0.0001;
    const distanceInPips =
      distance / pipSize;

    const pipValuePerLot = 10;

    const calculatedVolume =
      maxRiskAmount /
      (distanceInPips * pipValuePerLot);

    const roundedVolume =
      Math.floor(
        calculatedVolume * 100
      ) / 100;

    setSuggestedVolume(
      roundedVolume
    );

  }, [
    marketPrice,
    stopLoss,
    maxRiskAmount
  ]);

  // Calculate actual risk
  useEffect(() => {
    if (
      marketPrice === null ||
      !stopLoss ||
      !volume
    ) {
      setActualRisk(null);
      return;
    }

    const stopLossPrice = Number(stopLoss);
    const volumeNumber = Number(volume);

    if (
      !stopLossPrice ||
      !volumeNumber ||
      volumeNumber <= 0
    ) {
      setActualRisk(null);
      return;
    }

    const distance =
      Math.abs(
        marketPrice - stopLossPrice
      );

    const distanceInPips =
      distance / 0.0001;

    const pipValuePerLot = 10;

    const risk =
      distanceInPips *
      pipValuePerLot *
      volumeNumber;

    setActualRisk(risk);

  }, [
    marketPrice,
    stopLoss,
    volume
  ]);

  // Calculate potential reward and R:R
  useEffect(() => {
    if (
      marketPrice === null ||
      !stopLoss ||
      !takeProfit ||
      !volume
    ) {
      setPotentialReward(null);
      setRiskReward(null);
      return;
    }

    const stopLossPrice = Number(stopLoss);
    const takeProfitPrice = Number(takeProfit);
    const volumeNumber = Number(volume);

    if (
      !stopLossPrice ||
      !takeProfitPrice ||
      !volumeNumber ||
      volumeNumber <= 0
    ) {
      setPotentialReward(null);
      setRiskReward(null);
      return;
    }

    const riskDistance =
      Math.abs(
        marketPrice - stopLossPrice
      );

    const rewardDistance =
      Math.abs(
        takeProfitPrice - marketPrice
      );

    if (
      riskDistance === 0 ||
      rewardDistance === 0
    ) {
      setPotentialReward(null);
      setRiskReward(null);
      return;
    }

    const pipSize = 0.0001;
    const pipValuePerLot = 10;

    const riskPips =
      riskDistance / pipSize;

    const rewardPips =
      rewardDistance / pipSize;

    const riskAmount =
      riskPips *
      pipValuePerLot *
      volumeNumber;

    const rewardAmount =
      rewardPips *
      pipValuePerLot *
      volumeNumber;

    const rr =
      rewardAmount / riskAmount;

    setPotentialReward(
      rewardAmount
    );

    setRiskReward(rr);

  }, [
    marketPrice,
    stopLoss,
    takeProfit,
    volume
  ]);

  const handleUseSuggestedVolume = () => {
    if (
      suggestedVolume &&
      suggestedVolume > 0
    ) {
      setVolume(
        suggestedVolume.toFixed(2)
      );
    }
  };

  const handleOrder = (side) => {
    if (marketPrice === null) {
      alert(
        "Market price is not available."
      );
      return;
    }

    const volumeNumber =
      Number(volume);

    if (
      !volumeNumber ||
      volumeNumber <= 0
    ) {
      alert(
        "Enter a valid volume."
      );
      return;
    }

    if (!stopLoss) {
      alert(
        "Please enter a Stop Loss to calculate trade risk."
      );
      return;
    }

    if (
      actualRisk === null ||
      actualRisk <= 0
    ) {
      alert(
        "Unable to calculate trade risk."
      );
      return;
    }

    if (
      actualRisk > maxRiskAmount
    ) {
      alert(
        `Trade rejected.\n\n` +
        `Maximum allowed risk: $${maxRiskAmount.toFixed(2)}\n` +
        `Actual trade risk: $${actualRisk.toFixed(2)}`
      );
      return;
    }

    // Validate Stop Loss direction
    if (
      side === "BUY" &&
      Number(stopLoss) >= marketPrice
    ) {
      alert(
        "For a BUY order, Stop Loss must be below the entry price."
      );
      return;
    }

    if (
      side === "SELL" &&
      Number(stopLoss) <= marketPrice
    ) {
      alert(
        "For a SELL order, Stop Loss must be above the entry price."
      );
      return;
    }

    // Validate Take Profit direction
    if (takeProfit) {
      if (
        side === "BUY" &&
        Number(takeProfit) <= marketPrice
      ) {
        alert(
          "For a BUY order, Take Profit must be above the entry price."
        );
        return;
      }

      if (
        side === "SELL" &&
        Number(takeProfit) >= marketPrice
      ) {
        alert(
          "For a SELL order, Take Profit must be below the entry price."
        );
        return;
      }
    }

    openPosition({
      symbol,
      side,
      volume: volumeNumber,
      entryPrice: marketPrice,
      stopLoss: Number(stopLoss),
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

      <div className="risk-info">

        <div>
          <span>Risk per trade</span>

          <strong>
            1%
          </strong>
        </div>

        <div>
          <span>Max risk</span>

          <strong>
            ${maxRiskAmount.toFixed(2)}
          </strong>
        </div>

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
          placeholder="Required"
          onChange={(event) =>
            setStopLoss(event.target.value)
          }
        />
      </div>

      {suggestedVolume !== null &&
        suggestedVolume > 0 && (
          <div className="suggested-volume">

            <div>
              <span>
                Suggested volume
              </span>

              <strong>
                {suggestedVolume.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              onClick={
                handleUseSuggestedVolume
              }
            >
              Use
            </button>

          </div>
        )}

      {actualRisk !== null && (
        <div
          className={
            actualRisk <= maxRiskAmount
              ? "actual-risk risk-safe"
              : "actual-risk risk-danger"
          }
        >
          <span>
            Actual risk
          </span>

          <strong>
            ${actualRisk.toFixed(2)}
          </strong>
        </div>
      )}

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

      {riskReward !== null && (
        <div className="rr-info">

          <div>
            <span>Potential reward</span>

            <strong>
              ${potentialReward.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Risk / Reward</span>

            <strong>
              1 : {riskReward.toFixed(2)}
            </strong>
          </div>

        </div>
      )}

      <div className="order-buttons">

        <button
          className="buy-button"
          onClick={() =>
            handleOrder("BUY")
          }
        >
          BUY
        </button>

        <button
          className="sell-button"
          onClick={() =>
            handleOrder("SELL")
          }
        >
          SELL
        </button>

      </div>

    </aside>
  );
}

export default OrderPanel;