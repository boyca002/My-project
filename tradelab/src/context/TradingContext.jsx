import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

import {
  calculateProfit,
  calculateMargin,
  calculateExecutionPrice
} from "../utils/tradingCalculations";

const TradingContext = createContext();

const contractSizes = {
  "EUR/USD": 100000,
  "GBP/USD": 100000,
  "USD/JPY": 100000,
  "XAU/USD": 100,
  "BTC/USD": 1
};


export function TradingProvider({ children }) {
  const [balance, setBalance] = useState(10000);

  const [positions, setPositions] = useState([]);

  const [tradeHistory, setTradeHistory] = useState([]);

  // Daily risk management
  const [dailyLossLimitPercent, setDailyLossLimitPercent] =
    useState(3);

  const [dailyProfitLoss, setDailyProfitLoss] =
    useState(0);

  // Risk management
  const [riskPercent, setRiskPercent] =
    useState(1);

  const [minimumRiskReward, setMinimumRiskReward] =
    useState(2);

  // --------------------------------------------------
  // OPEN POSITION
  // --------------------------------------------------

  const openPosition = ({
    symbol,
    side,
    volume,
    entryPrice,
    stopLoss,
    takeProfit
  }) => {
    const newPosition = {
      id: Date.now(),

      symbol,

      side,

      volume,

      entryPrice,

      currentPrice: entryPrice,

      stopLoss,

      takeProfit,

      profit: 0,

      openedAt: new Date().toISOString()
    };

    setPositions((currentPositions) => [
      ...currentPositions,
      newPosition
    ]);
  };

  // --------------------------------------------------
  // ADD CLOSED TRADE TO HISTORY
  // --------------------------------------------------

  const addToTradeHistory = (
    position,
    exitPrice,
    profit,
    reason
  ) => {
    const closedTrade = {
      id: Date.now(),

      symbol: position.symbol,

      side: position.side,

      volume: position.volume,

      entryPrice: position.entryPrice,

      exitPrice,

      profit,

      reason,

      openedAt: position.openedAt,

      closedAt: new Date().toISOString()
    };

    setTradeHistory((currentHistory) => [
      closedTrade,
      ...currentHistory
    ]);

    // Update today's realized P/L
    setDailyProfitLoss(
      (current) => current + profit
    );
  };

  // --------------------------------------------------
  // UPDATE POSITION PRICES
  // --------------------------------------------------

  const updatePositionPrices = (
    symbol,
    currentPrice
  ) => {
    setPositions((currentPositions) => {
      const remainingPositions = [];

      currentPositions.forEach((position) => {

        // Only update positions for the
        // currently received market symbol
        if (position.symbol !== symbol) {
          remainingPositions.push(position);
          return;
        }

        // ---------------------------------------------
        // FLOATING PROFIT
        // ---------------------------------------------

        const profit =
          calculateProfit({
            symbol: position.symbol,

            side: position.side,

            volume: position.volume,

            entryPrice: position.entryPrice,

            currentPrice
          });

        // ---------------------------------------------
        // STOP LOSS / TAKE PROFIT CHECK
        // ---------------------------------------------

        let shouldClose = false;

        let closeReason = null;

        // STOP LOSS

        if (position.stopLoss !== null) {

          // BUY Stop Loss
          if (
            position.side === "BUY" &&
            currentPrice <= position.stopLoss
          ) {
            shouldClose = true;

            closeReason = "Stop Loss";
          }

          // SELL Stop Loss
          if (
            position.side === "SELL" &&
            currentPrice >= position.stopLoss
          ) {
            shouldClose = true;

            closeReason = "Stop Loss";
          }
        }

        // TAKE PROFIT

        if (position.takeProfit !== null) {

          // BUY Take Profit
          if (
            position.side === "BUY" &&
            currentPrice >= position.takeProfit
          ) {
            shouldClose = true;

            closeReason = "Take Profit";
          }

          // SELL Take Profit
          if (
            position.side === "SELL" &&
            currentPrice <= position.takeProfit
          ) {
            shouldClose = true;

            closeReason = "Take Profit";
          }
        }

        // ---------------------------------------------
        // AUTOMATIC CLOSE
        // ---------------------------------------------

        if (shouldClose) {

          /*
            Closing a BUY position requires a SELL
            execution.

            Closing a SELL position requires a BUY
            execution.
          */

          const closingSide =
            position.side === "BUY"
              ? "SELL"
              : "BUY";

          // Apply spread + slippage
          const closingPrice =
            calculateExecutionPrice({
              symbol: position.symbol,

              side: closingSide,

              marketPrice: currentPrice,

              spreadPips: 1.0,

              slippagePips: 0.2
            });

          // Calculate final realized P/L
          const closingProfit =
            calculateProfit({
              symbol: position.symbol,

              side: position.side,

              volume: position.volume,

              entryPrice: position.entryPrice,

              currentPrice: closingPrice
            });

          // Add realized P/L to balance
          setBalance(
            (currentBalance) =>
              currentBalance + closingProfit
          );

          // Save completed trade
          addToTradeHistory(
            position,

            closingPrice,

            closingProfit,

            closeReason
          );

          console.log(
            `${position.symbol} ${position.side} closed by ${closeReason} at ${closingPrice}`
          );

          // Remove position
          return;
        }

        // ---------------------------------------------
        // KEEP POSITION OPEN
        // ---------------------------------------------

        remainingPositions.push({
          ...position,

          currentPrice,

          profit
        });
      });

      return remainingPositions;
    });
  };

  // --------------------------------------------------
  // MANUAL CLOSE POSITION
  // --------------------------------------------------

  const closePosition = (positionId) => {

    setPositions((currentPositions) => {

      const position =
        currentPositions.find(
          (item) => item.id === positionId
        );

      if (!position) {
        return currentPositions;
      }

      /*
        Closing side is opposite of opening side.
      */

      const closingSide =
        position.side === "BUY"
          ? "SELL"
          : "BUY";

      // Apply spread + slippage
      const closingPrice =
        calculateExecutionPrice({
          symbol: position.symbol,

          side: closingSide,

          marketPrice: position.currentPrice,

          spreadPips: 1.0,

          slippagePips: 0.2
        });

      // Calculate final P/L using
      // the actual execution price
      const closingProfit =
        calculateProfit({
          symbol: position.symbol,

          side: position.side,

          volume: position.volume,

          entryPrice: position.entryPrice,

          currentPrice: closingPrice
        });

      // Update balance
      setBalance(
        (currentBalance) =>
          currentBalance + closingProfit
      );

      // Save trade history
      addToTradeHistory(
        position,

        closingPrice,

        closingProfit,

        "Manual Close"
      );

      console.log(
        `${position.symbol} ${position.side} manually closed at ${closingPrice}`
      );

      // Remove position
      return currentPositions.filter(
        (item) => item.id !== positionId
      );
    });
  };

  // --------------------------------------------------
  // FLOATING PROFIT
  // --------------------------------------------------

  const floatingProfit = useMemo(() => {

    return positions.reduce(
      (total, position) =>
        total + position.profit,

      0
    );

  }, [positions]);

  // --------------------------------------------------
  // EQUITY
  // --------------------------------------------------

  const equity =
    balance + floatingProfit;

  // --------------------------------------------------
  // USED MARGIN
  // --------------------------------------------------

  const usedMargin =
    positions.reduce(
      (total, position) =>
        total +
        calculateMargin({
          symbol: position.symbol,

          volume: position.volume,

          price: position.currentPrice,

          leverage: 100
        }),

      0
    );

  // --------------------------------------------------
  // FREE MARGIN
  // --------------------------------------------------

  const freeMargin =
    equity - usedMargin;

  // --------------------------------------------------
  // MARGIN LEVEL
  // --------------------------------------------------

  const marginLevel =
    usedMargin > 0
      ? (equity / usedMargin) * 100
      : 0;

  // --------------------------------------------------
  // MAXIMUM RISK PER TRADE
  // --------------------------------------------------

  const maxRiskAmount =
    balance * (riskPercent / 100);

  // --------------------------------------------------
  // DAILY LOSS LIMIT
  // --------------------------------------------------

  const dailyLossLimitAmount =
    balance *
    (dailyLossLimitPercent / 100);

  // --------------------------------------------------
  // DAILY LOSS PROTECTION
  // --------------------------------------------------

  const dailyLossExceeded =
    dailyProfitLoss <=
    -dailyLossLimitAmount;

  // --------------------------------------------------
  // CONTEXT
  // --------------------------------------------------

  return (
    <TradingContext.Provider
      value={{

        // Account
        balance,

        positions,

        tradeHistory,

        // P/L
        floatingProfit,

        equity,

        // Margin
        usedMargin,

        freeMargin,

        marginLevel,

        // Risk
        riskPercent,

        setRiskPercent,

        maxRiskAmount,

        // Trading
        openPosition,

        updatePositionPrices,

        closePosition,

        // Risk/Reward
        minimumRiskReward,

        setMinimumRiskReward,

        // Daily risk
        dailyProfitLoss,

        dailyLossLimitPercent,

        setDailyLossLimitPercent,

        dailyLossLimitAmount,

        dailyLossExceeded

      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

// --------------------------------------------------
// USE TRADING CONTEXT
// --------------------------------------------------

export function useTrading() {

  return useContext(
    TradingContext
  );

}