import express from "express";

const router = express.Router();

router.get("/market", async (req, res) => {
  try {
    const {
      symbol = "EUR/USD",
      timeframe = "15m",
      startDate,
      endDate,
      limit = 100
    } = req.query;

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

    const safeLimit = Math.min(
      Math.max(Number(limit) || 100, 1),
      1000
    );

    const params = new URLSearchParams({
      interval: apiTimeframe,
      limit: safeLimit.toString()
    });

    if (startDate) {
      params.set(
        "from",
        `${startDate}T00:00:00Z`
      );
    }

    if (endDate) {
      params.set(
        "to",
        `${endDate}T23:59:59Z`
      );
    }

    const url =
      `https://biquote.io/api/${apiSymbol}/ohlc?${params.toString()}`;

    console.log(
      `Market request: ${symbol} ${timeframe}`
    );

    console.log(
      `Historical range: ${startDate || "latest"} → ${endDate || "latest"}`
    );

    const response =
      await fetch(url);

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "BiQuote error:",
        errorText
      );

      return res.status(response.status).json({
        success: false,
        message:
          "BiQuote market API error",
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
        message:
          "No market data available for the selected period."
      });
    }

    const candles = data.bars
      .filter(
        (bar) =>
          !bar.isOpen
      )
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
        (a, b) =>
          a.time - b.time
      );

    res.json({
      success: true,
      symbol,
      timeframe,
      startDate:
        startDate || null,
      endDate:
        endDate || null,
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