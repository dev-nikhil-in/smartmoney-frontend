import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  TrendingDown,
  Calculator,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/loans", icon: CreditCard, label: "My Loans" },
  { to: "/strategy", icon: TrendingDown, label: "Strategy" },
  { to: "/simulator", icon: Zap, label: "EMI Simulator" },
  { to: "/calculators", icon: Calculator, label: "Calculators" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } min-h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300`}
    >
      {/* Logo + Toggle */}
      <div className="px-3 py-4 border-b border-slate-100 flex items-center justify-between">
        {!collapsed && (
          <img src={logo} alt="SmartMoney" className="h-10 w-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            © 2026 Nivtron SmartMoney
          </p>
        </div>
      )}
    </aside>
  );
}