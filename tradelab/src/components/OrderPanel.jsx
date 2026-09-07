import { useEffect, useState } from "react";
import { useTrading } from "../context/TradingContext";

import {
  calculateExecutionPrice
} from "../utils/tradingCalculations";

function OrderPanel({
  symbol,
  marketPrice
}) {
  const {
    openPosition,
    maxRiskAmount,
    minimumRiskReward,
    dailyProfitLoss,
    dailyLossLimitAmount,
    dailyLossExceeded
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

  const [executionPrice, setExecutionPrice] =
    useState(null);

  // --------------------------------------------------
  // CALCULATE EXECUTION PRICE
  // --------------------------------------------------

  useEffect(() => {
    if (marketPrice === null) {
      setExecutionPrice(null);
      return;
    }

    /*
      We calculate the BUY execution price here
      for the risk preview.

      The actual order will recalculate it according
      to the selected BUY/SELL side.
    */

    const previewPrice =
      calculateExecutionPrice({
        symbol,
        side: "BUY",
        marketPrice,
        spreadPips: 1.0,
        slippagePips: 0.2
      });

    setExecutionPrice(previewPrice);

  }, [
    symbol,
    marketPrice
  ]);

  // --------------------------------------------------
  // CALCULATE SUGGESTED VOLUME
  // --------------------------------------------------

  useEffect(() => {
    if (
      executionPrice === null ||
      !stopLoss
    ) {
      setSuggestedVolume(null);
      return;
    }

    const stopLossPrice =
      Number(stopLoss);

    if (
      !stopLossPrice ||
      stopLossPrice <= 0
    ) {
      setSuggestedVolume(null);
      return;
    }

    const distance =
      Math.abs(
        executionPrice -
        stopLossPrice
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
      (
        distanceInPips *
        pipValuePerLot
      );

    const roundedVolume =
      Math.floor(
        calculatedVolume * 100
      ) / 100;

    setSuggestedVolume(
      roundedVolume
    );

  }, [
    executionPrice,
    stopLoss,
    maxRiskAmount
  ]);

  // --------------------------------------------------
  // CALCULATE ACTUAL RISK
  // --------------------------------------------------

  useEffect(() => {
    if (
      executionPrice === null ||
      !stopLoss ||
      !volume
    ) {
      setActualRisk(null);
      return;
    }

    const stopLossPrice =
      Number(stopLoss);

    const volumeNumber =
      Number(volume);

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
        executionPrice -
        stopLossPrice
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
    executionPrice,
    stopLoss,
    volume
  ]);

  // --------------------------------------------------
  // CALCULATE REWARD + RISK/REWARD
  // --------------------------------------------------

  useEffect(() => {
    if (
      executionPrice === null ||
      !stopLoss ||
      !takeProfit ||
      !volume
    ) {
      setPotentialReward(null);
      setRiskReward(null);
      return;
    }

    const stopLossPrice =
      Number(stopLoss);

    const takeProfitPrice =
      Number(takeProfit);

    const volumeNumber =
      Number(volume);

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
        executionPrice -
        stopLossPrice
      );

    const rewardDistance =
      Math.abs(
        takeProfitPrice -
        executionPrice
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
      rewardAmount /
      riskAmount;

    setPotentialReward(
      rewardAmount
    );

    setRiskReward(rr);

  }, [
    executionPrice,
    stopLoss,
    takeProfit,
    volume
  ]);

  // --------------------------------------------------
  // USE SUGGESTED VOLUME
  // --------------------------------------------------

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

  // --------------------------------------------------
  // HANDLE BUY / SELL
  // --------------------------------------------------

  const handleOrder = (side) => {

    // -----------------------------------------------
    // 1. DAILY LOSS PROTECTION
    // -----------------------------------------------

    if (dailyLossExceeded) {

      alert(
        `Trade rejected.\n\n` +
        `Daily loss limit reached.\n` +
        `Today's P/L: $${dailyProfitLoss.toFixed(2)}\n` +
        `Maximum daily loss: $${dailyLossLimitAmount.toFixed(2)}`
      );

      return;
    }

    // -----------------------------------------------
    // 2. MARKET PRICE VALIDATION
    // -----------------------------------------------

    if (marketPrice === null) {

      alert(
        "Market price is not available."
      );

      return;
    }

    // -----------------------------------------------
    // 3. VOLUME VALIDATION
    // -----------------------------------------------

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

    // -----------------------------------------------
    // 4. STOP LOSS REQUIRED
    // -----------------------------------------------

    if (!stopLoss) {

      alert(
        "Please enter a Stop Loss to calculate trade risk."
      );

      return;
    }

    const stopLossPrice =
      Number(stopLoss);

    // -----------------------------------------------
    // 5. ACTUAL EXECUTION PRICE
    // -----------------------------------------------

    const orderExecutionPrice =
      calculateExecutionPrice({
        symbol,

        side,

        marketPrice,

        spreadPips: 1.0,

        slippagePips: 0.2
      });

    // -----------------------------------------------
    // 6. STOP LOSS DIRECTION
    // -----------------------------------------------

    if (
      side === "BUY" &&
      stopLossPrice >= orderExecutionPrice
    ) {

      alert(
        "For a BUY order, Stop Loss must be below the execution price."
      );

      return;
    }

    if (
      side === "SELL" &&
      stopLossPrice <= orderExecutionPrice
    ) {

      alert(
        "For a SELL order, Stop Loss must be above the execution price."
      );

      return;
    }

    // -----------------------------------------------
    // 7. TAKE PROFIT DIRECTION
    // -----------------------------------------------

    if (takeProfit) {

      const takeProfitPrice =
        Number(takeProfit);

      if (
        side === "BUY" &&
        takeProfitPrice <= orderExecutionPrice
      ) {

        alert(
          "For a BUY order, Take Profit must be above the execution price."
        );

        return;
      }

      if (
        side === "SELL" &&
        takeProfitPrice >= orderExecutionPrice
      ) {

        alert(
          "For a SELL order, Take Profit must be below the execution price."
        );

        return;
      }
    }

    // -----------------------------------------------
    // 8. CALCULATE ACTUAL RISK
    // -----------------------------------------------

    const riskDistance =
      Math.abs(
        orderExecutionPrice -
        stopLossPrice
      );

    const riskPips =
      riskDistance / 0.0001;

    const pipValuePerLot = 10;

    const executionRisk =
      riskPips *
      pipValuePerLot *
      volumeNumber;

    // -----------------------------------------------
    // 9. VALIDATE RISK
    // -----------------------------------------------

    if (
      executionRisk <= 0
    ) {

      alert(
        "Unable to calculate trade risk."
      );

      return;
    }

    // -----------------------------------------------
    // 10. MAXIMUM RISK PROTECTION
    // -----------------------------------------------

    if (
      executionRisk > maxRiskAmount
    ) {

      alert(
        `Trade rejected.\n\n` +
        `Maximum allowed risk: $${maxRiskAmount.toFixed(2)}\n` +
        `Actual trade risk: $${executionRisk.toFixed(2)}`
      );

      return;
    }

    // -----------------------------------------------
    // 11. RISK / REWARD VALIDATION
    // -----------------------------------------------

    if (takeProfit) {

      const takeProfitPrice =
        Number(takeProfit);

      const rewardDistance =
        Math.abs(
          takeProfitPrice -
          orderExecutionPrice
        );

      const rewardPips =
        rewardDistance / 0.0001;

      const potentialRewardAmount =
        rewardPips *
        pipValuePerLot *
        volumeNumber;

      const executionRiskReward =
        potentialRewardAmount /
        executionRisk;

      if (
        executionRiskReward <
        minimumRiskReward
      ) {

        alert(
          `Trade rejected.\n\n` +
          `Minimum allowed risk/reward: 1:${minimumRiskReward.toFixed(2)}\n` +
          `Actual risk/reward: 1:${executionRiskReward.toFixed(2)}`
        );

        return;
      }
    }

    // -----------------------------------------------
    // 12. OPEN POSITION
    // -----------------------------------------------

    openPosition({
      symbol,

      side,

      volume: volumeNumber,

      entryPrice:
        orderExecutionPrice,

      stopLoss:
        stopLossPrice,

      takeProfit:
        takeProfit
          ? Number(takeProfit)
          : null
    });

    // -----------------------------------------------
    // 13. DEBUG INFORMATION
    // -----------------------------------------------

    console.log(
      `${side} ${symbol} executed at ${orderExecutionPrice}`
    );

    console.log(
      `Risk: $${executionRisk.toFixed(2)}`
    );

  };

  return (
    <aside className="order-panel">

      <div className="order-panel-header">

        <h3>Order</h3>

        <span>
          DEMO
        </span>

      </div>

      <div className="order-symbol">
        {symbol}
      </div>

      <div className="order-price">
        {marketPrice !== null
          ? marketPrice.toFixed(5)
          : "---"}
      </div>

      {/* DAILY RISK */}

      <div
        className={
          dailyLossExceeded
            ? "daily-risk-status daily-risk-locked"
            : "daily-risk-status"
        }
      >

        <div>
          <span>
            Daily P/L
          </span>

          <strong
            className={
              dailyProfitLoss >= 0
                ? "daily-profit"
                : "daily-loss"
            }
          >
            {dailyProfitLoss >= 0
              ? "+"
              : ""}
            ${dailyProfitLoss.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>
            Daily limit
          </span>

          <strong>
            ${dailyLossLimitAmount.toFixed(2)}
          </strong>
        </div>

        {dailyLossExceeded && (
          <div className="daily-risk-locked-message">
            🔒 TRADING LOCKED
          </div>
        )}

      </div>

      {/* RISK INFO */}

      <div className="risk-info">

        <div>
          <span>
            Risk per trade
          </span>

          <strong>
            1%
          </strong>
        </div>

        <div>
          <span>
            Max risk
          </span>

          <strong>
            ${maxRiskAmount.toFixed(2)}
          </strong>
        </div>

      </div>

      {/* EXECUTION PRICE */}

      {executionPrice !== null && (
        <div className="execution-price-info">

          <span>
            Estimated execution
          </span>

          <strong>
            {executionPrice.toFixed(5)}
          </strong>

        </div>
      )}

      {/* VOLUME */}

      <div className="order-field">

        <label>
          Volume
        </label>

        <input
          type="number"
          value={volume}
          min="0.01"
          step="0.01"
          onChange={(event) =>
            setVolume(
              event.target.value
            )
          }
        />

      </div>

      {/* STOP LOSS */}

      <div className="order-field">

        <label>
          Stop Loss
        </label>

        <input
          type="number"
          value={stopLoss}
          placeholder="Required"
          onChange={(event) =>
            setStopLoss(
              event.target.value
            )
          }
        />

      </div>

      {/* SUGGESTED VOLUME */}

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

      {/* ACTUAL RISK */}

      {actualRisk !== null && (

        <div
          className={
            actualRisk <= maxRiskAmount
              ? "actual-risk risk-safe"
              : "actual-risk risk-danger"
          }
        >

          <span>
            Estimated risk
          </span>

          <strong>
            ${actualRisk.toFixed(2)}
          </strong>

        </div>

      )}

      {/* TAKE PROFIT */}

      <div className="order-field">

        <label>
          Take Profit
        </label>

        <input
          type="number"
          value={takeProfit}
          placeholder="Optional"
          onChange={(event) =>
            setTakeProfit(
              event.target.value
            )
          }
        />

      </div>

      {/* RISK REWARD */}

      {riskReward !== null && (

        <div className="rr-info">

          <div>

            <span>
              Potential reward
            </span>

            <strong>
              ${potentialReward.toFixed(2)}
            </strong>

          </div>

          <div>

            <span>
              Risk / Reward
            </span>

            <strong
              className={
                riskReward >= minimumRiskReward
                  ? "rr-good"
                  : "rr-bad"
              }
            >
              1 : {riskReward.toFixed(2)}
            </strong>

          </div>

          <div className="rr-minimum">

            <span>
              Minimum R:R
            </span>

            <strong>
              1 :{" "}
              {minimumRiskReward.toFixed(2)}
            </strong>

          </div>

        </div>

      )}

      {/* ORDER BUTTONS */}

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