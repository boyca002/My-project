import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

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
    setPositions((currentPositions) => {
      const remainingPositions = [];

      currentPositions.forEach((position) => {
        if (position.symbol !== symbol) {
          remainingPositions.push(position);
          return;
        }

        const priceDifference =
          position.side === "BUY"
            ? currentPrice - position.entryPrice
            : position.entryPrice - currentPrice;

        const profit =
          priceDifference *
          position.volume *
          100000;

        let shouldClose = false;
        let closeReason = null;

        // Stop Loss
        if (position.stopLoss !== null) {
          if (
            position.side === "BUY" &&
            currentPrice <= position.stopLoss
          ) {
            shouldClose = true;
            closeReason = "Stop Loss";
          }

          if (
            position.side === "SELL" &&
            currentPrice >= position.stopLoss
          ) {
            shouldClose = true;
            closeReason = "Stop Loss";
          }
        }

        // Take Profit
        if (position.takeProfit !== null) {
          if (
            position.side === "BUY" &&
            currentPrice >= position.takeProfit
          ) {
            shouldClose = true;
            closeReason = "Take Profit";
          }

          if (
            position.side === "SELL" &&
            currentPrice <= position.takeProfit
          ) {
            shouldClose = true;
            closeReason = "Take Profit";
          }
        }

        // Automatically close position
        if (shouldClose) {
          setBalance(
            (currentBalance) =>
              currentBalance + profit
          );

          console.log(
            `${position.symbol} ${position.side} closed by ${closeReason}`
          );

          return;
        }

        remainingPositions.push({
          ...position,
          currentPrice,
          profit
        });
      });

      return remainingPositions;
    });
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

  const equity =
    balance + floatingProfit;

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