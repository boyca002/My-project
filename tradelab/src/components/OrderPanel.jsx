import { useState } from "react";

function OrderPanel() {
  const [side, setSide] = useState("buy");

  return (
    <aside className="order-panel">

      {/* Account */}
      <div className="panel-section">

        <h3>ACCOUNT</h3>

        <div className="account-balance">
          $10,000.00
        </div>

        <p className="account-label">
          Available demo balance
        </p>

        <div className="account-metrics">

          <div className="metric">
            <span>Equity</span>
            <strong>$10,000.00</strong>
          </div>

          <div className="metric">
            <span>Today's P/L</span>
            <strong className="profit">
              $0.00
            </strong>
          </div>

          <div className="metric">
            <span>Margin</span>
            <strong>$0.00</strong>
          </div>

          <div className="metric">
            <span>Free Margin</span>
            <strong>$10,000.00</strong>
          </div>

        </div>

      </div>


      {/* Order */}
      <div className="panel-section">

        <h3>PLACE DEMO ORDER</h3>

        <div className="order-tabs">

          <button
            className={side === "buy" ? "buy active" : "buy"}
            onClick={() => setSide("buy")}
          >
            BUY
          </button>

          <button
            className={side === "sell" ? "sell active" : "sell"}
            onClick={() => setSide("sell")}
          >
            SELL
          </button>

        </div>


        <div className="form-field">

          <label>VOLUME (LOTS)</label>

          <input
            type="number"
            defaultValue="0.10"
            min="0.01"
            step="0.01"
          />

        </div>


        <div className="form-field">

          <label>STOP LOSS</label>

          <input
            type="number"
            placeholder="Optional"
          />

        </div>


        <div className="form-field">

          <label>TAKE PROFIT</label>

          <input
            type="number"
            placeholder="Optional"
          />

        </div>


        <div className="order-buttons">

          <button className="buy-order">
            BUY MARKET
          </button>

          <button className="sell-order">
            SELL MARKET
          </button>

        </div>

      </div>


      {/* Watchlist */}
      <div className="panel-section">

        <h3>WATCHLIST</h3>

        <div className="watch-item">
          <span>★ EUR/USD</span>
          <strong>1.17240</strong>
        </div>

        <div className="watch-item">
          <span>★ GBP/USD</span>
          <strong>1.35410</strong>
        </div>

        <div className="watch-item">
          <span>★ USD/JPY</span>
          <strong>147.280</strong>
        </div>

        <div className="watch-item">
          <span>★ XAU/USD</span>
          <strong>3,465.20</strong>
        </div>

        <div className="watch-item">
          <span>★ BTC/USD</span>
          <strong>112,840</strong>
        </div>

      </div>

    </aside>
  );
}

export default OrderPanel;