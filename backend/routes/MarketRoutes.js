import express from "express";

const router = express.Router();

router.get("/market", async (req, res) => {
  try {
    const {
      symbol = "EUR/USD",
      timeframe = "15m"
    } = req.query;

    // Frontend symbol → BiQuote symbol
    const symbolMap = {
      "EUR/USD": "EURUSD",
      "GBP/USD": "GBPUSD",
      "USD/JPY": "USDJPY",
      "XAU/USD": "XAUUSD",
      "BTC/USD": "BTCUSD"
    };

    const apiSymbol = symbolMap[symbol];

    if (!apiSymbol) {
      return res.status(400).json({
        success: false,
        message: `Unsupported symbol: ${symbol}`
      });
    }

    // Frontend timeframe → BiQuote interval
    const timeframeMap = {
      "1m": "1m",
      "5m": "5m",
      "15m": "15m",
      "1H": "1h",
      "4H": "4h",
      "1D": "1d"
    };

    const apiTimeframe =
      timeframeMap[timeframe];

    if (!apiTimeframe) {
      return res.status(400).json({
        success: false,
        message: `Unsupported timeframe: ${timeframe}`
      });
    }

    const url =
      `https://biquote.io/api/${apiSymbol}/ohlc` +
      `?interval=${apiTimeframe}` +
      `&limit=100`;

    console.log(
      `Market request: ${symbol} ${timeframe}`
    );

    const response = await fetch(url);

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "BiQuote error:",
        errorText
      );

      return res.status(response.status).json({
        success: false,
        message: "BiQuote market API error",
        error: errorText
      });
    }

    const data =
      await response.json();

    console.log(
      `Received ${data.bars?.length || 0} bars`
    );

    if (
      !data.bars ||
      data.bars.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "No market data available"
      });
    }

    const candles = data.bars
      .map((bar) => ({
        time: Math.floor(
          new Date(
            bar.openTime
          ).getTime() / 1000
        ),
        open: Number(bar.open),
        high: Number(bar.high),
        low: Number(bar.low),
        close: Number(bar.close)
      }))
      .sort(
        (a, b) => a.time - b.time
      );

    res.json({
      success: true,
      symbol,
      timeframe,
      candles
    });

  } catch (error) {
    console.error(
      "Market data error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch market data"
    });
  }
});

export default router;