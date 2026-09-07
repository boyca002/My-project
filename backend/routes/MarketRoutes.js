import express from "express";

const router = express.Router();

router.get("/market", async (req, res) => {
  try {console.log(
  "Finnhub key being used:",
  process.env.FINNHUB_API_KEY
    ? `${process.env.FINNHUB_API_KEY.slice(0, 4)}...${process.env.FINNHUB_API_KEY.slice(-4)}`
    : "NOT FOUND"
);
    const {
      symbol = "OANDA:EUR_USD",
      timeframe = "15m"
    } = req.query;

    const resolutionMap = {
      "1m": "1",
      "5m": "5",
      "15m": "15",
      "1H": "60",
      "4H": "240",
      "1D": "D"
    };

    const resolution = resolutionMap[timeframe];

    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: "Invalid timeframe"
      });
    }

    const now = Math.floor(Date.now() / 1000);

    // Get approximately 100 candles
    const secondsPerCandle =
      resolution === "D"
        ? 86400
        : Number(resolution) * 60;

    const from =
      now - secondsPerCandle * 100;

    const url =
      `https://finnhub.io/api/v1/forex/candle` +
      `?symbol=${encodeURIComponent(symbol)}` +
      `&resolution=${resolution}` +
      `&from=${from}` +
      `&to=${now}` +
      `&token=${process.env.FINNHUB_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok || data.s !== "ok") {
      return res.status(400).json({
        success: false,
        message: data.error || "Finnhub market API error",
        data
      });
    }

    const candles = data.t.map((timestamp, index) => ({
      time: timestamp,
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index]
    }));

    res.json({
      success: true,
      symbol,
      timeframe,
      candles
    });

  } catch (error) {
    console.error("Market data error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch market data"
    });
  }
});

export default router;