import { useTrading } from "../context/TradingContext";

function PositionsPanel() {
  const {
    positions,
    closePosition
  } = useTrading();

  return (
    <section className="positions-panel">

      <div className="positions-header">
        <h3>Positions</h3>

        <span>
          {positions.length} open
        </span>
      </div>

      {positions.length === 0 ? (
        <div className="empty-positions">
          No open positions
        </div>
      ) : (
        <div className="positions-list">

          {positions.map((position) => (
            <div
              className="position-row"
              key={position.id}
            >

              <div className="position-symbol">
                <strong>
                  {position.symbol}
                </strong>

                <span
                  className={
                    position.side === "BUY"
                      ? "position-buy"
                      : "position-sell"
                  }
                >
                  {position.side}
                </span>
              </div>

              <div className="position-volume">
                {position.volume}
              </div>

              <div className="position-entry">
                {position.entryPrice.toFixed(5)}
              </div>

              <div className="position-profit">
                ${position.profit.toFixed(2)}
              </div>

              <button
                className="close-position-button"
                onClick={() =>
                  closePosition(position.id)
                }
              >
                Close
              </button>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default PositionsPanel;