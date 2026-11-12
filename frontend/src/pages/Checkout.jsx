import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/ordersApi";
import { formatPrice, getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";

// The shipping form is built from this list. To add a field, add a line here
// (and the same field in the backend: models/Order.js and order.controllers.js).
const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", wide: true },
  { name: "phone", label: "Phone number", type: "tel", wide: true },
  { name: "address", label: "Address", type: "text", wide: true },
  { name: "city", label: "City", type: "text" },
  { name: "postalCode", label: "Postal code", type: "text" },
];

function Checkout() {
  const { user } = useAuth();
  const { cart, cartLoading, reloadCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  // One handler for every input: it updates the field whose name matches
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      const order = await createOrder(form); // the server turns the cart into an order
      navigate(`/payments/${order._id}`);    // next step: pay for it
      reloadCart();                           // the server emptied the cart, so refresh our copy
    } catch (err) {
      setError(getErrorMessage(err));
      setPlacing(false);
    }
  };

  if (cartLoading) {
    return <div className="p-6 md:p-8 text-slate-500">Loading your cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">Your cart is empty, so there is nothing to check out.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
      <p className="text-sm text-slate-500 mt-1">Step 1 of 2: where should we send it?</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Shipping form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4"
        >
          <h2 className="font-semibold text-slate-800">Shipping address</h2>

          <Alert>{error}</Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5
                  text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
            {placing ? "Placing order..." : "Continue to payment"}
          </button>
        </form>

        {/* Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-800">Your items</h2>

          <ul className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <li key={item._id} className="flex justify-between gap-3 text-sm text-slate-600">
                <span className="truncate">
                  {item.product.name} <span className="text-slate-400">x {item.quantity}</span>
                </span>
                <span className="shrink-0">{formatPrice(item.totalPrice)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
