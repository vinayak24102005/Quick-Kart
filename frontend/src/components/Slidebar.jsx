import {
  LayoutDashboard,
  ShoppingCart,
  Handbag,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Sidebar = () => {
  const { logout, user, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: cart.itemCount },
    { to: "/my-orders", label: "My Orders", icon: Handbag },
    { to: "/settings", label: "Settings", icon: Settings },
    ...(isAdmin ? [{ to: "/dashboard", label: "Dashboard", icon: Shield }] : []),
  ];

  // Common styles
  const baseStyle = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors";
  const activeStyle = "bg-sky-100 text-sky-700 shadow-sm";
  const inactiveStyle = "text-gray-600 hover:bg-sky-50 hover:text-sky-600";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-sky-100 flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-sky-100">
          <h1 className="text-xl font-bold text-sky-600">Quick-Kart</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon, end, badge }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
                >
                  <Icon size={20} />
                  <span className="flex-1">{label}</span>
                  {badge > 0 && (
                    <span className="bg-sky-600 text-white text-xs rounded-full px-2 py-0.5">{badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sky-100">
          {user && (
            <p className="px-4 pb-2 text-xs text-gray-400 truncate" title={user.email}>
              Signed in as {user.name}
            </p>
          )}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sky-100 z-20 flex justify-around py-2">
        {links.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `relative flex flex-col items-center px-3 py-1 text-xs ${isActive ? "text-sky-700" : "text-gray-500"}`
            }
          >
            <Icon size={22} />
            {badge > 0 && (
              <span className="absolute -top-1 right-0 bg-sky-600 text-white text-[10px] rounded-full px-1.5">{badge}</span>
            )}
          </NavLink>
        ))}
        <button onClick={handleLogout} aria-label="Logout" className="flex flex-col items-center px-3 py-1 text-xs text-red-500">
          <LogOut size={22} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
