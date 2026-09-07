function TopBar({
  symbol,
  marketPrice,
  priceChange
}) {
  return (
    <header className="top-bar">

      <div className="market-info">

        <div className="market-symbol">
          {symbol}
        </div>

        <div className="market-price">
          {marketPrice !== null
            ? marketPrice.toFixed(5)
            : "---"}
        </div>

        <div
          className={
            priceChange !== null &&
            priceChange >= 0
              ? "price-change positive"
              : "price-change negative"
          }
        >
          {priceChange !== null
            ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%`
            : "---"}
        </div>

      </div>

      <div className="top-bar-actions">
        <button>Search</button>
        <button>Settings</button>
      </div>

    </header>
  );
}

export default TopBar;