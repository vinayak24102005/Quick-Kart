import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelOrder, getMyOrders } from "../api/ordersApi";
import { formatDate, formatPrice, getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";
import OrderBadges from "../components/OrderBadges";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // the order being cancelled right now

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    setError("");
    setBusyId(orderId);
    try {
      const updated = await cancelOrder(orderId);
      // Swap the old copy of this order for the updated one
      setOrders((current) => current.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>

      <div className="mt-6 space-y-6">
        <Alert>{error}</Alert>

        {loading && <p className="text-slate-500">Loading your orders...</p>}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="text-slate-500">You have not placed any orders yet.</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Start shopping
            </Link>
          </div>
        )}

        {orders.map((order) => {
          const canCancel = order.status === "processing";
          const needsPayment =
            order.status === "processing" && order.paymentStatus === "pending" && !order.paymentMethod;

          return (
            <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-800">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <OrderBadges order={order} />
              </div>

              {/* Items */}
              <ul className="mt-4 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <li key={item.product} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-2 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">Total: {formatPrice(order.total)}</p>

                <div className="flex gap-3">
                  {needsPayment && (
                    <Link
                      to={`/payments/${order._id}`}
                      className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      Pay now
                    </Link>
                  )}
                  {canCancel && (
                    <button
                      type="button"
                      disabled={busyId === order._id}
                      onClick={() => handleCancel(order._id)}
                      className="border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      {busyId === order._id ? "Cancelling..." : "Cancel order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
