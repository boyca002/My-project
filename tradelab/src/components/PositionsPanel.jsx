import { useState } from "react";

const demoPositions = [
  {
    id: 1,
    symbol: "XAU/USD",
    side: "BUY",
    volume: 0.1,
    entry: 1.17240,
    current: 1.17310,
    pnl: 7.0
  },
  {
    id: 2,
    symbol: "GBP/USD",
    side: "SELL",
    volume: 0.2,
    entry: 1.35410,
    current: 1.35320,
    pnl: 18.0
  }
];

function PositionsPanel() {
  const [activeTab, setActiveTab] = useState("positions");

  const [positions, setPositions] = useState(demoPositions);

  function closePosition(id) {
    setPositions((currentPositions) =>
      currentPositions.filter((position) => position.id !== id)
    );
  }

  return (
    <section className="positions-panel">

      {/* Tabs */}

      <div className="position-tabs">

        <button
          className={activeTab === "positions" ? "active" : ""}
          onClick={() => setActiveTab("positions")}
        >
          Positions ({positions.length})
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Trade History
        </button>

      </div>


      {/* Positions */}

      {activeTab === "positions" && (

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Volume</th>
                <th>Entry</th>
                <th>Current</th>
                <th>P/L</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {positions.map((position) => (

                <tr key={position.id}>

                  <td>{position.symbol}</td>

                  <td
                    className={
                      position.side === "BUY"
                        ? "profit"
                        : "loss"
                    }
                  >
                    {position.side}
                  </td>

                  <td>{position.volume.toFixed(2)}</td>

                  <td>{position.entry.toFixed(5)}</td>

                  <td>{position.current.toFixed(5)}</td>

                  <td
                    className={
                      position.pnl >= 0
                        ? "profit"
                        : "loss"
                    }
                  >
                    +${position.pnl.toFixed(2)}
                  </td>

                  <td>

                    <button
                      className="close-position"
                      onClick={() =>
                        closePosition(position.id)
                      }
                    >
                      Close
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* Orders */}

      {activeTab === "orders" && (

        <div className="empty-state">

          <h3>No pending orders</h3>

          <p>
            Pending limit and stop orders will appear here.
          </p>

        </div>

      )}


      {/* History */}

      {activeTab === "history" && (

        <div className="empty-state">

          <h3>No trade history</h3>

          <p>
            Closed trades will appear here.
          </p>

        </div>

      )}

    </section>
  );
}

export default PositionsPanel;