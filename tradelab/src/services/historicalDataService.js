import {
  parseHistoricalCSV,
  filterCandlesByDate
} from "../utils/historicalData";

export async function loadHistoricalData(
  file,
  startDate = "",
  endDate = ""
) {
  if (!file) {
    throw new Error(
      "No historical data file selected."
    );
  }

  const csvText =
    await file.text();

  const candles =
    parseHistoricalCSV(csvText);

  if (candles.length === 0) {
    throw new Error(
      "No valid historical candles found in the CSV file."
    );
  }

  const filteredCandles =
    filterCandlesByDate(
      candles,
      startDate,
      endDate
    );

  if (filteredCandles.length === 0) {
    throw new Error(
      "No candles found inside the selected date range."
    );
  }

  return filteredCandles;
}