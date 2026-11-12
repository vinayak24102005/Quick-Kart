import {
  LayoutDashboard,
  ShoppingCart,
  Handbag,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Common styles
  const baseStyle = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors";
  const activeStyle = "bg-sky-100 text-sky-700 shadow-sm";
  const inactiveStyle = "text-gray-600 hover:bg-sky-50 hover:text-sky-600";

  // To add a page to the menu, add one line here
  const links = [
    { to: "/", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/dashboard", label: "Dashboard", icon: User },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
    { to: "/my-orders", label: "My Orders", icon: Handbag },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sky-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sky-100">
        <h1 className="text-xl font-bold text-sky-600">Quick-Kart</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                }
              >
                <Icon size={20} />
                <span>{label}</span>

                {/* Number of items in the cart */}
                {badge > 0 && (
                  <span className="ml-auto bg-sky-500 text-white text-xs font-semibold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Who is logged in + Logout */}
      <div className="p-4 border-t border-sky-100">
        {user && (
          <p className="px-4 pb-2 text-xs text-gray-500 truncate" title={user.email}>
            Signed in as <span className="font-medium text-gray-700">{user.name}</span>
          </p>
        )}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
          onClick={() => {
            logout();
            navigate("/login");
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
