import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, payOrder } from "../api/ordersApi";
import { formatPrice, getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";
import OrderBadges from "../components/OrderBadges";

// The ways a customer can pay. This is a DEMO: nothing is charged and no
// card details are collected.
const METHODS = [
  { value: "card", label: "Credit / Debit card", hint: "Demo payment, no card details needed" },
  { value: "upi", label: "UPI", hint: "Demo payment, no UPI ID needed" },
  { value: "cod", label: "Cash on delivery", hint: "Pay in cash when your order arrives" },
];

// The page address is /payments/<orderId>, so a refresh keeps working
function Payment() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(orderId)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePay = async () => {
    setError("");
    setPaying(true);
    try {
      setOrder(await payOrder(orderId, method)); // the page then shows the "done" message
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="p-6 md:p-8 text-slate-500">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 md:p-8 max-w-2xl space-y-4">
        <Alert>{error || "Order not found"}</Alert>
        <Link to="/my-orders" className="text-sky-600 hover:underline text-sm">Go to My Orders</Link>
      </div>
    );
  }

  // What the page says at the top, depending on how far the order has got
  let message = null;
  if (order.status === "cancelled") {
    message = { title: "This order was cancelled", text: "Nothing is due for it." };
  } else if (order.paymentStatus === "paid") {
    message = { title: "Payment received. Thank you!", text: "Your order is confirmed and is being processed." };
  } else if (order.paymentMethod === "cod") {
    message = { title: "Order confirmed", text: "Please pay in cash when your order arrives." };
  }

  const address = order.shippingAddress;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800">Payment</h1>
      {!message && <p className="text-sm text-slate-500 mt-1">Step 2 of 2: choose how to pay.</p>}

      <div className="mt-6 space-y-6">
        <Alert>{error}</Alert>

        {/* Order summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-800">Order #{order._id.slice(-6).toUpperCase()}</h2>
            <OrderBadges order={order} />
          </div>

          <ul className="mt-4 space-y-2">
            {order.items.map((item) => (
              <li key={item.product} className="flex justify-between gap-3 text-sm text-slate-600">
                <span className="truncate">
                  {item.name} <span className="text-slate-400">x {item.quantity}</span>
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Delivering to {address.fullName}, {address.address}, {address.city} {address.postalCode}
          </p>
        </div>

        {/* Either the "done" message, or the payment choices */}
        {message ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <p className="font-semibold text-slate-800">{message.title}</p>
            <p className="text-sm text-slate-500 mt-1">{message.text}</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                to="/my-orders"
                className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                View my orders
              </Link>
              <Link
                to="/"
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                Keep shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-800">Payment method</h2>

            <div className="mt-4 space-y-3">
              {METHODS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                    method === option.value
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-sky-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={option.value}
                    checked={method === option.value}
                    onChange={() => setMethod(option.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{option.label}</span>
                    <span className="block text-xs text-slate-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="mt-5 w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
            >
              {paying
                ? "Processing..."
                : method === "cod"
                ? "Confirm order"
                : `Pay ${formatPrice(order.total)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payment;
