import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Trading from "./pages/Trading";
import Dashboard from "./pages/Dashboard";
import Strategies from "./pages/Strategies";
import Backtesting from "./pages/Backtesting";
import TradeHistory from "./pages/TradeHistory";
import Statistics from "./pages/Statistics";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";

import TradingLayout from "./Layout/TradingLayout";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <TradingLayout>
        <Routes>

          {/* Main trading platform */}
          <Route path="/trading" element={<Trading />} />

          {/* Platform pages */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/strategies" element={<Strategies />} />

          <Route path="/backtesting" element={<Backtesting />} />

          <Route path="/trade-history" element={<TradeHistory />} />

          <Route path="/statistics" element={<Statistics />} />

          <Route path="/journal" element={<Journal />} />

          <Route path="/settings" element={<Settings />} />

          {/* Redirect root to trading */}
          <Route
            path="/"
            element={<Navigate to="/trading" replace />}
          />

        </Routes>
      </TradingLayout>
    </BrowserRouter>
  );
}

export default App;