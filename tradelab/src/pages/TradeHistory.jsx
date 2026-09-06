import { useTrading } from "../context/TradingContext";

function TradeHistory() {
  const { tradeHistory } = useTrading();

  const totalTrades = tradeHistory.length;

  const winningTrades = tradeHistory.filter(
    (trade) => trade.profit > 0
  ).length;

  const losingTrades = tradeHistory.filter(
    (trade) => trade.profit < 0
  ).length;

  const totalProfit = tradeHistory
    .filter((trade) => trade.profit > 0)
    .reduce(
      (total, trade) => total + trade.profit,
      0
    );

  const totalLoss = tradeHistory
    .filter((trade) => trade.profit < 0)
    .reduce(
      (total, trade) => total + trade.profit,
      0
    );

  const netProfit = tradeHistory.reduce(
    (total, trade) => total + trade.profit,
    0
  );

  const winRate =
    totalTrades > 0
      ? (winningTrades / totalTrades) * 100
      : 0;

  return (
    <div className="trade-history-page">

      <div className="page-header">
        <div>
          <h1>Trade History</h1>

          <p>
            Review your completed demo trades.
          </p>
        </div>

        <div className="trade-count">
          {totalTrades} trades
        </div>
      </div>

      {/* Statistics */}

      <div className="history-statistics">

        <div className="history-stat">
          <span>Total Trades</span>
          <strong>{totalTrades}</strong>
        </div>

        <div className="history-stat">
          <span>Winning Trades</span>
          <strong className="stat-positive">
            {winningTrades}
          </strong>
        </div>

        <div className="history-stat">
          <span>Losing Trades</span>
          <strong className="stat-negative">
            {losingTrades}
          </strong>
        </div>

        <div className="history-stat">
          <span>Win Rate</span>
          <strong>
            {winRate.toFixed(2)}%
          </strong>
        </div>

        <div className="history-stat">
          <span>Total Profit</span>
          <strong className="stat-positive">
            +${totalProfit.toFixed(2)}
          </strong>
        </div>

        <div className="history-stat">
          <span>Total Loss</span>
          <strong className="stat-negative">
            ${totalLoss.toFixed(2)}
          </strong>
        </div>

        <div className="history-stat">
          <span>Net P/L</span>
          <strong
            className={
              netProfit >= 0
                ? "stat-positive"
                : "stat-negative"
            }
          >
            {netProfit >= 0 ? "+" : ""}
            ${netProfit.toFixed(2)}
          </strong>
        </div>

      </div>

      {tradeHistory.length === 0 ? (
        <div className="empty-history">
          <h3>No completed trades</h3>

          <p>
            Closed positions will appear here.
          </p>
        </div>
      ) : (
        <div className="history-table-container">

          <table className="history-table">

            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Volume</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>P/L</th>
                <th>Reason</th>
                <th>Closed</th>
              </tr>
            </thead>

            <tbody>

              {tradeHistory.map((trade) => (

                <tr key={trade.id}>

                  <td>
                    <strong>
                      {trade.symbol}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={
                        trade.side === "BUY"
                          ? "history-buy"
                          : "history-sell"
                      }
                    >
                      {trade.side}
                    </span>
                  </td>

                  <td>
                    {trade.volume}
                  </td>

                  <td>
                    {trade.entryPrice.toFixed(5)}
                  </td>

                  <td>
                    {trade.exitPrice.toFixed(5)}
                  </td>

                  <td
                    className={
                      trade.profit >= 0
                        ? "history-profit"
                        : "history-loss"
                    }
                  >
                    {trade.profit >= 0
                      ? "+"
                      : ""}
                    ${trade.profit.toFixed(2)}
                  </td>

                  <td>
                    {trade.reason}
                  </td>

                  <td>
                    {new Date(
                      trade.closedAt
                    ).toLocaleString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default TradeHistory;