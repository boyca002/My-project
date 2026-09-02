import { Search, Settings } from "lucide-react";

function TopBar() {
  return (
    <header className="topbar">

      <div className="market-info">
        <div className="symbol-name">
          EUR/USD
        </div>

        <div className="current-price">
          1.17240
        </div>

        <div className="price-change">
          +0.18%
        </div>
      </div>

      <div className="topbar-actions">

        <button>
          <Search size={16} />
          Search
        </button>

        <button>
          <Settings size={16} />
        </button>

        <button className="reset-button">
          ↻ Reset Demo
        </button>

      </div>

    </header>
  );
}

export default TopBar;