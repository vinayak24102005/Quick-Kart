import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
    { label: "Cart", path: "/cart", icon: ShoppingCart },
    { label: "Checkout", path: "/checkout", icon: CreditCard },
    { label: "Payments", path: "/payments", icon: Wallet },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sky-100 flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sky-100">
        <h1 className="text-xl font-bold text-sky-600">
          Quick-Kart
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sky-100 text-sky-700 shadow-sm"
                        : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sky-100">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;