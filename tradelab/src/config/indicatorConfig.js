const indicatorConfig = {
  sma20: {
    id: "sma20",
    name: "SMA 20",
    type: "overlay",
    period: 20,
    defaultVisible: true
  },

  sma50: {
    id: "sma50",
    name: "SMA 50",
    type: "overlay",
    period: 50,
    defaultVisible: true
  },

  ema9: {
    id: "ema9",
    name: "EMA 9",
    type: "overlay",
    period: 9,
    defaultVisible: true
  },

  ema21: {
    id: "ema21",
    name: "EMA 21",
    type: "overlay",
    period: 21,
    defaultVisible: true
  },

  rsi14: {
    id: "rsi14",
    name: "RSI 14",
    type: "oscillator",
    period: 14,
    defaultVisible: false,

    levels: {
      overbought: 70,
      middle: 50,
      oversold: 30
    }
  }
};

export default indicatorConfig;