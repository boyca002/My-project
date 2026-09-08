import {
  calculateSMA,
  calculateEMA,
  calculateRSI
} from "./indicators";

// ==========================================
// STRATEGY ENGINE
// ==========================================

export function generateSignal(candles) {
  if (!candles || candles.length < 50) {
    return {
      signal: "HOLD",
      reason: "Not enough market data",
      strength: 0
    };
  }

  // ----------------------------------------
  // INDICATORS
  // ----------------------------------------

  const sma20 =
    calculateSMA(candles, 20);

  const sma50 =
    calculateSMA(candles, 50);

  const ema9 =
    calculateEMA(candles, 9);

  const ema21 =
    calculateEMA(candles, 21);

  const rsi14 =
    calculateRSI(candles, 14);

  if (
    sma20.length === 0 ||
    sma50.length === 0 ||
    ema9.length === 0 ||
    ema21.length === 0 ||
    rsi14.length === 0
  ) {
    return {
      signal: "HOLD",
      reason: "Indicators unavailable",
      strength: 0
    };
  }

  // ----------------------------------------
  // LATEST VALUES
  // ----------------------------------------

  const latestSMA20 =
    sma20[sma20.length - 1].value;

  const latestSMA50 =
    sma50[sma50.length - 1].value;

  const latestEMA9 =
    ema9[ema9.length - 1].value;

  const latestEMA21 =
    ema21[ema21.length - 1].value;

  const latestRSI =
    rsi14[rsi14.length - 1].value;

  const latestPrice =
    Number(
      candles[candles.length - 1].close
    );

  // ----------------------------------------
  // SIGNAL SCORE
  // ----------------------------------------

  let buyScore = 0;
  let sellScore = 0;

  // ----------------------------------------
  // SMA TREND
  // ----------------------------------------

  if (latestSMA20 > latestSMA50) {
    buyScore++;
  }

  if (latestSMA20 < latestSMA50) {
    sellScore++;
  }

  // ----------------------------------------
  // EMA TREND
  // ----------------------------------------

  if (latestEMA9 > latestEMA21) {
    buyScore++;
  }

  if (latestEMA9 < latestEMA21) {
    sellScore++;
  }

  // ----------------------------------------
  // RSI
  // ----------------------------------------

  if (
    latestRSI > 30 &&
    latestRSI < 70
  ) {
    if (latestRSI >= 50) {
      buyScore++;
    } else {
      sellScore++;
    }
  }

  // ----------------------------------------
  // PRICE POSITION
  // ----------------------------------------

  if (latestPrice > latestSMA20) {
    buyScore++;
  }

  if (latestPrice < latestSMA20) {
    sellScore++;
  }

  // ----------------------------------------
  // FINAL SIGNAL
  // ----------------------------------------

  let signal = "HOLD";
  let reason = "No clear setup";
  let strength = 0;

  if (
    buyScore >= 3 &&
    buyScore > sellScore
  ) {
    signal = "BUY";

    strength =
      (buyScore / 4) * 100;

    reason =
      "Bullish trend conditions detected";
  }

  else if (
    sellScore >= 3 &&
    sellScore > buyScore
  ) {
    signal = "SELL";

    strength =
      (sellScore / 4) * 100;

    reason =
      "Bearish trend conditions detected";
  }

  return {
    signal,
    reason,
    strength,

    price: latestPrice,

    indicators: {
      sma20: latestSMA20,
      sma50: latestSMA50,
      ema9: latestEMA9,
      ema21: latestEMA21,
      rsi14: latestRSI
    }
  };
}