import {
  LayoutDashboard,
  CandlestickChart,
  Brain,
  FlaskConical,
  History,
  BarChart3,
  NotebookPen,
  Settings
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Trading", icon: CandlestickChart, path: "/trading" },
  { name: "Strategies", icon: Brain, path: "/strategies" },
  { name: "Backtesting", icon: FlaskConical, path: "/backtesting" },
  { name: "Trade History", icon: History, path: "/history" },
  { name: "Statistics", icon: BarChart3, path: "/statistics" },
  { name: "Journal", icon: NotebookPen, path: "/journal" },
  { name: "Settings", icon: Settings, path: "/settings" }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Trade<span>Lab</span>
      </div>

      <div className="demo-account">
        <div>● DEMO ACCOUNT</div>
        <strong>$10,000.00 Virtual</strong>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.path}
              className={item.name === "Trading" ? "active" : ""}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div>Market connection</div>
        <div className="connection-status">
          <span></span>
          Simulation connected
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;