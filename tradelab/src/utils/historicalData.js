export function parseHistoricalCSV(csvText) {
  if (!csvText) {
    return [];
  }

  const lines = csvText
    .trim()
    .split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) =>
      header.trim().toLowerCase()
    );

  const findColumn = (...names) => {
    return names.find((name) =>
      headers.includes(name)
    );
  };

  const timeColumn =
    findColumn(
      "time",
      "timestamp",
      "datetime",
      "date"
    );

  const openColumn =
    findColumn("open");

  const highColumn =
    findColumn("high");

  const lowColumn =
    findColumn("low");

  const closeColumn =
    findColumn("close");

  if (
    !timeColumn ||
    !openColumn ||
    !highColumn ||
    !lowColumn ||
    !closeColumn
  ) {
    throw new Error(
      "CSV must contain time, open, high, low and close columns."
    );
  }

  const timeIndex =
    headers.indexOf(timeColumn);

  const openIndex =
    headers.indexOf(openColumn);

  const highIndex =
    headers.indexOf(highColumn);

  const lowIndex =
    headers.indexOf(lowColumn);

  const closeIndex =
    headers.indexOf(closeColumn);

  const candles = [];

  for (
    let i = 1;
    i < lines.length;
    i++
  ) {
    const values =
      lines[i].split(",");

    if (
      values.length < headers.length
    ) {
      continue;
    }

    const timestamp =
      new Date(
        values[timeIndex].trim()
      ).getTime();

    const open =
      Number(
        values[openIndex]
      );

    const high =
      Number(
        values[highIndex]
      );

    const low =
      Number(
        values[lowIndex]
      );

    const close =
      Number(
        values[closeIndex]
      );

    if (
      Number.isNaN(timestamp) ||
      Number.isNaN(open) ||
      Number.isNaN(high) ||
      Number.isNaN(low) ||
      Number.isNaN(close)
    ) {
      continue;
    }

    candles.push({
      time: Math.floor(
        timestamp / 1000
      ),
      open,
      high,
      low,
      close
    });
  }

  return candles.sort(
    (a, b) =>
      a.time - b.time
  );
}

export function filterCandlesByDate(
  candles,
  startDate,
  endDate
) {
  if (!candles) {
    return [];
  }

  const startTimestamp =
    startDate
      ? new Date(
          `${startDate}T00:00:00`
        ).getTime() / 1000
      : -Infinity;

  const endTimestamp =
    endDate
      ? new Date(
          `${endDate}T23:59:59`
        ).getTime() / 1000
      : Infinity;

  return candles.filter(
    (candle) =>
      candle.time >=
        startTimestamp &&
      candle.time <=
        endTimestamp
  );
}