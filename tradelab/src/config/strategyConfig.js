const strategyConfig = {
  trendMomentum: {
    id: "trendMomentum",

    name: "Trend Momentum",

    description:
      "Combines moving averages, RSI and price position.",

    enabled: true,

    minimumScore: 3,

    indicators: {
      smaFast: 20,
      smaSlow: 50,

      emaFast: 9,
      emaSlow: 21,

      rsiPeriod: 14
    },

    rules: {
      requirePriceAboveSMA: true,

      requireRSIFilter: true,

      rsiBullishLevel: 50,

      rsiBearishLevel: 50
    }
  }
};

export default strategyConfig;