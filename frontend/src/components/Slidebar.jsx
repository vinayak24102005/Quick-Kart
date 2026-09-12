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

  // Common styles
  const baseStyle =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors";
  const activeStyle = "bg-sky-100 text-sky-700 shadow-sm";
  const inactiveStyle = "text-gray-600 hover:bg-sky-50 hover:text-sky-600";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sky-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sky-100">
        <h1 className="text-xl font-bold text-sky-600">Quick-Kart</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Cart */}
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
            </NavLink>
          </li>

          {/* Checkout */}
          <li>
            <NavLink
              to="/checkout"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <CreditCard size={20} />
              <span>Checkout</span>
            </NavLink>
          </li>

          {/* Payments */}
          <li>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <Wallet size={20} />
              <span>Payments</span>
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
              }
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </li>
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