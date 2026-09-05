const API_URL = import.meta.env.VITE_API_URL;

export async function getMarketData(symbol, timeframe) {
  const params = new URLSearchParams({
    symbol,
    timeframe,
  });

  const url = `${API_URL}/market?${params.toString()}`;

  console.log("Requesting market data:", url);

  const response = await fetch(url);

  const responseText = await response.text();

  console.log("Backend response:", responseText);

  if (!response.ok) {
    throw new Error(
      `Backend error ${response.status}: ${responseText}`
    );
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid JSON from backend:", responseText);

    throw new Error(
      "Backend returned invalid JSON."
    );
  }
}