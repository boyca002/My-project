import { useTrading } from "../context/TradingContext";

function AccountSummary() {
  const {
    balance,
    floatingProfit,
    equity
  } = useTrading();

  const formatMoney = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="account-summary">

      <div className="account-stat">
        <span>Balance</span>

        <strong>
          {formatMoney(balance)}
        </strong>
      </div>

      <div className="account-stat">
        <span>Floating P/L</span>

        <strong
          className={
            floatingProfit >= 0
              ? "profit-positive"
              : "profit-negative"
          }
        >
          {floatingProfit >= 0 ? "+" : ""}
          {formatMoney(floatingProfit)}
        </strong>
      </div>

      <div className="account-stat">
        <span>Equity</span>

        <strong>
          {formatMoney(equity)}
        </strong>
      </div>

    </div>
  );
}

export default AccountSummary;