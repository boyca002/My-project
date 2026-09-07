const instrumentConfig = {
  "EUR/USD": {
    type: "forex",
    pipSize: 0.0001,
    contractSize: 100000,
    pipValuePerLot: 10
  },

  "GBP/USD": {
    type: "forex",
    pipSize: 0.0001,
    contractSize: 100000,
    pipValuePerLot: 10
  },

  "USD/JPY": {
    type: "forex",
    pipSize: 0.01,
    contractSize: 100000,
    pipValuePerLot: 10
  },

  "XAU/USD": {
    type: "metal",
    pipSize: 0.01,
    contractSize: 100
  },

  "BTC/USD": {
    type: "crypto",
    pipSize: 1,
    contractSize: 1
  }
};

export function getInstrumentConfig(symbol) {
  return (
    instrumentConfig[symbol] || {
      type: "forex",
      pipSize: 0.0001,
      contractSize: 100000,
      pipValuePerLot: 10
    }
  );
}

export function calculateProfit({
  symbol,
  side,
  volume,
  entryPrice,
  currentPrice
}) {
  const config =
    getInstrumentConfig(symbol);

  const priceDifference =
    side === "BUY"
      ? currentPrice - entryPrice
      : entryPrice - currentPrice;

  return (
    priceDifference *
    volume *
    config.contractSize
  );
}
export function calculateMargin({
  symbol,
  volume,
  price,
  leverage = 100
}) {
  const config =
    getInstrumentConfig(symbol);

  const notionalValue =
    volume *
    config.contractSize *
    price;

  return notionalValue / leverage;
}

export function calculateExecutionPrice({
  symbol,
  side,
  marketPrice,
  spreadPips = 1.0,
  slippagePips = 0.2
}) {
  const config =
    getInstrumentConfig(symbol);

  const spread =
    spreadPips * config.pipSize;

  const slippage =
    slippagePips * config.pipSize;

  let executionPrice;

  if (side === "BUY") {
    executionPrice =
      marketPrice +
      spread +
      slippage;
  } else {
    executionPrice =
      marketPrice -
      spread -
      slippage;
  }

  return executionPrice;
}