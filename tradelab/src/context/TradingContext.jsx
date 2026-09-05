import { createContext, useContext, useMemo, useState } from "react";

const TradingContext = createContext();

export function TradingProvider({ children }) {
  const [balance, setBalance] = useState(10000);

  const [positions, setPositions] = useState([]);

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

  const updatePositionPrices = (
    symbol,
    currentPrice
  ) => {
    setPositions((currentPositions) =>
      currentPositions.map((position) => {
        if (position.symbol !== symbol) {
          return position;
        }

        const priceDifference =
          position.side === "BUY"
            ? currentPrice - position.entryPrice
            : position.entryPrice - currentPrice;

        const profit =
          priceDifference *
          position.volume *
          100000;

        return {
          ...position,
          currentPrice,
          profit
        };
      })
    );
  };

  const closePosition = (positionId) => {
    setPositions((currentPositions) => {
      const position = currentPositions.find(
        (item) => item.id === positionId
      );

      if (!position) {
        return currentPositions;
      }

      setBalance(
        (currentBalance) =>
          currentBalance + position.profit
      );

      return currentPositions.filter(
        (item) => item.id !== positionId
      );
    });
  };

  const floatingProfit = useMemo(() => {
    return positions.reduce(
      (total, position) =>
        total + position.profit,
      0
    );
  }, [positions]);

  const equity = balance + floatingProfit;

  return (
    <TradingContext.Provider
      value={{
        balance,
        positions,
        floatingProfit,
        equity,
        openPosition,
        updatePositionPrices,
        closePosition
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  return useContext(TradingContext);
}