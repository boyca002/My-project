import { generateSignal } from "./strategyEngine";

export function runBacktest({
  candles,
  strategyId = "trendMomentum",
  startingBalance = 10000,
  riskPercent = 1,
  stopLossPips = 20,
  takeProfitPips = 40,
  spreadPips = 1,
  slippagePips = 0.2
}) {
  if (!candles || candles.length < 50) {
    return {
      success: false,
      message: "Not enough historical data."
    };
  }

  let balance = startingBalance;

  const trades = [];

  let position = null;

  for (let i = 50; i < candles.length; i++) {
    const historicalCandles =
      candles.slice(0, i + 1);

    const candle =
      candles[i];

    if (!position) {
      const signal =
        generateSignal(
          historicalCandles,
          strategyId
        );

      if (
        signal.signal === "BUY" ||
        signal.signal === "SELL"
      ) {
        const riskAmount =
          balance *
          (riskPercent / 100);

        const price =
          Number(candle.close);

        const pipSize = 0.0001;

        const spread =
          spreadPips * pipSize;

        const slippage =
          slippagePips * pipSize;

        let entryPrice;
        let stopLoss;
        let takeProfit;

        if (signal.signal === "BUY") {
          entryPrice =
            price +
            spread +
            slippage;

          stopLoss =
            entryPrice -
            stopLossPips *
              pipSize;

          takeProfit =
            entryPrice +
            takeProfitPips *
              pipSize;
        } else {
          entryPrice =
            price -
            spread -
            slippage;

          stopLoss =
            entryPrice +
            stopLossPips *
              pipSize;

          takeProfit =
            entryPrice -
            takeProfitPips *
              pipSize;
        }

        const riskPerUnit =
          stopLossPips *
          pipSize *
          100000;

        const volume =
          riskPerUnit > 0
            ? riskAmount /
              riskPerUnit
            : 0;

        position = {
          side:
            signal.signal,

          entryPrice,

          stopLoss,

          takeProfit,

          volume,

          openedAt:
            candle.time
        };
      }

      continue;
    }

    const high =
      Number(candle.high);

    const low =
      Number(candle.low);

    let exitPrice = null;
    let reason = null;

    if (position.side === "BUY") {
      if (low <= position.stopLoss) {
        exitPrice =
          position.stopLoss;

        reason = "Stop Loss";
      } else if (
        high >=
        position.takeProfit
      ) {
        exitPrice =
          position.takeProfit;

        reason = "Take Profit";
      }
    }

    if (position.side === "SELL") {
      if (high >= position.stopLoss) {
        exitPrice =
          position.stopLoss;

        reason = "Stop Loss";
      } else if (
        low <=
        position.takeProfit
      ) {
        exitPrice =
          position.takeProfit;

        reason = "Take Profit";
      }
    }

    if (exitPrice !== null) {
      const priceDifference =
        position.side === "BUY"
          ? exitPrice -
            position.entryPrice
          : position.entryPrice -
            exitPrice;

      const profit =
        priceDifference *
        position.volume *
        100000;

      balance += profit;

      trades.push({
        side:
          position.side,

        entryPrice:
          position.entryPrice,

        exitPrice,

        volume:
          position.volume,

        profit,

        reason,

        openedAt:
          position.openedAt,

        closedAt:
          candle.time
      });

      position = null;
    }
  }

  const wins =
    trades.filter(
      (trade) =>
        trade.profit > 0
    ).length;

  const losses =
    trades.filter(
      (trade) =>
        trade.profit < 0
    ).length;

  const totalProfit =
    trades.reduce(
      (total, trade) =>
        total + trade.profit,
      0
    );

  const winRate =
    trades.length > 0
      ? (wins / trades.length) *
        100
      : 0;
      const grossProfit =
  trades
    .filter(
      (trade) =>
        trade.profit > 0
    )
    .reduce(
      (total, trade) =>
        total + trade.profit,
      0
    );

const grossLoss =
  trades
    .filter(
      (trade) =>
        trade.profit < 0
    )
    .reduce(
      (total, trade) =>
        total + Math.abs(
          trade.profit
        ),
      0
    );

const profitFactor =
  grossLoss > 0
    ? grossProfit / grossLoss
    : grossProfit > 0
      ? Infinity
      : 0;

const expectancy =
  trades.length > 0
    ? totalProfit / trades.length
    : 0;

 return {
  success: true,

  startingBalance,

  endingBalance:
    balance,

  netProfit:
    totalProfit,

  totalTrades:
    trades.length,

  wins,

  losses,

  winRate,

  grossProfit,

  grossLoss,

  profitFactor,

  expectancy,

  trades
};
}