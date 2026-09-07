const API_URL = import.meta.env.VITE_API_URL;

export async function getMarketData(symbol, timeframe) {

  const response = await fetch(
    `${API_URL}/market?symbol=${encodeURIComponent(symbol)}&timeframe=${timeframe}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch market data");
  }

  return response.json();
}