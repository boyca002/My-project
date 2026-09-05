import Sidebar from "../components/Sidebar";

function TradingLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default TradingLayout;