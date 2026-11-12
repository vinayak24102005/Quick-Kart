import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getMyOrders } from "../api/ordersApi";
import { formatDate, formatPrice, getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";
import OrderBadges from "../components/OrderBadges";

// A quick summary of the account. It only reads data that other pages already use.
function Dashboard() {
  const { user } = useAuth();
  const { itemCount } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Cancelled orders do not count towards the numbers
  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const totalOrdered = activeOrders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: "Orders placed", value: activeOrders.length },
    { label: "Total ordered", value: formatPrice(totalOrdered) },
    { label: "Items in cart", value: itemCount },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">Hi, {user?.name}!</h1>
      <p className="text-sm text-slate-500 mt-1">Here is a quick look at your account.</p>

      <div className="mt-6 space-y-6">
        <Alert>{error}</Alert>

        {/* Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? "-" : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Latest 3 orders */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Recent orders</h2>
            <Link to="/my-orders" className="text-sm text-sky-600 hover:underline">View all</Link>
          </div>

          {!loading && orders.length === 0 && (
            <p className="mt-4 text-sm text-slate-500">
              No orders yet. <Link to="/" className="text-sky-600 hover:underline">Start shopping</Link>
            </p>
          )}

          <ul className="mt-4 divide-y divide-slate-100">
            {orders.slice(0, 3).map((order) => (
              <li key={order._id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(order.createdAt)} &middot; {formatPrice(order.total)}
                  </p>
                </div>
                <OrderBadges order={order} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
