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
  { to: "/calculators", icon: Calculator, label: "Calculators" },
  { to: "/loans", icon: CreditCard, label: "My Loans" },
  { to: "/strategy", icon: TrendingDown, label: "Strategy" },
  { to: "/simulator", icon: Zap, label: "EMI Simulator" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } min-h-screen flex flex-col transition-all duration-300 relative overflow-hidden`}
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Subtle glow top-right */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Logo + Toggle */}
      <div
        className="px-3 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {!collapsed && (
          <img src={logo} alt="SmartMoney" className="h-[60px] w-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ${
            collapsed ? "mx-auto" : ""
          }`}
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 relative z-10">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
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
        <div
          className="px-4 py-3 relative z-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs text-slate-500 text-center">
            © 2026 Nivtron SmartMoney
          </p>
        </div>
      )}
    </aside>
  );
}