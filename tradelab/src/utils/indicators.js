// ==========================================
// INDICATORS
// ==========================================

// ------------------------------------------
// SIMPLE MOVING AVERAGE (SMA)
// ------------------------------------------

export function calculateSMA(candles, period) {
  if (!candles || candles.length < period) {
    return [];
  }

  const sma = [];

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;

    for (let j = i - period + 1; j <= i; j++) {
      sum += Number(candles[j].close);
    }

    const average = sum / period;

    sma.push({
      time: candles[i].time,
      value: average
    });
  }

  return sma;
}

// ------------------------------------------
// EXPONENTIAL MOVING AVERAGE (EMA)
// ------------------------------------------

export function calculateEMA(candles, period) {
  if (!candles || candles.length < period) {
    return [];
  }

  const ema = [];

  // First EMA value starts with SMA
  let sum = 0;

  for (let i = 0; i < period; i++) {
    sum += Number(candles[i].close);
  }

  let previousEMA = sum / period;

  ema.push({
    time: candles[period - 1].time,
    value: previousEMA
  });

  // EMA multiplier
  const multiplier =
    2 / (period + 1);

  for (let i = period; i < candles.length; i++) {
    const close =
      Number(candles[i].close);

    const currentEMA =
      (
        close - previousEMA
      ) * multiplier +
      previousEMA;

    ema.push({
      time: candles[i].time,
      value: currentEMA
    });

    previousEMA = currentEMA;
  }

  return ema;
}

// ------------------------------------------
// RSI
// ------------------------------------------

export function calculateRSI(candles, period = 14) {
  if (!candles || candles.length <= period) {
    return [];
  }

  const rsi = [];

  let gains = 0;
  let losses = 0;

  // Calculate initial gains/losses
  for (let i = 1; i <= period; i++) {
    const change =
      Number(candles[i].close) -
      Number(candles[i - 1].close);

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let averageGain =
    gains / period;

  let averageLoss =
    losses / period;

  let firstRSI;

  if (averageLoss === 0) {
    firstRSI = 100;
  } else {
    const rs =
      averageGain / averageLoss;

    firstRSI =
      100 - 100 / (1 + rs);
  }

  rsi.push({
    time: candles[period].time,
    value: firstRSI
  });

  // Calculate remaining RSI values
  for (
    let i = period + 1;
    i < candles.length;
    i++
  ) {
    const change =
      Number(candles[i].close) -
      Number(candles[i - 1].close);

    const gain =
      change > 0
        ? change
        : 0;

    const loss =
      change < 0
        ? Math.abs(change)
        : 0;

    averageGain =
      (
        averageGain * (period - 1) +
        gain
      ) / period;

    averageLoss =
      (
        averageLoss * (period - 1) +
        loss
      ) / period;

    let currentRSI;

    if (averageLoss === 0) {
      currentRSI = 100;
    } else {
      const rs =
        averageGain / averageLoss;

      currentRSI =
        100 - 100 / (1 + rs);
    }

    rsi.push({
      time: candles[i].time,
      value: currentRSI
    });
  }

  return rsi;
}