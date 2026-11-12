import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice, getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";

function Cart() {
  const { cart, cartLoading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [busyId, setBusyId] = useState(null); // the product being changed right now
  const [error, setError] = useState("");

  // Runs one cart change, disables that row's buttons while waiting, shows any error
  const run = async (productId, action) => {
    setError("");
    setBusyId(productId);
    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  if (cartLoading) {
    return <div className="p-6 md:p-8 text-slate-500">Loading your cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>

      <div className="mt-4">
        <Alert>{error}</Alert>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            const busy = busyId === product._id;

            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 rounded-lg object-cover bg-slate-50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
                  <p className="text-sm text-slate-500">{formatPrice(item.price)} each</p>

                  <div className="mt-3 flex items-center gap-3">
                    {/* Quantity - and + */}
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy || item.quantity <= 1}
                        onClick={() => run(product._id, () => updateQuantity(product._id, item.quantity - 1))}
                        className="p-2 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={busy || item.quantity >= product.stock}
                        onClick={() => run(product._id, () => updateQuantity(product._id, item.quantity + 1))}
                        className="p-2 text-slate-600 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(product._id, () => removeFromCart(product._id))}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>

                <p className="font-semibold text-slate-900">{formatPrice(item.totalPrice)}</p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-800">Order Summary</h2>

          <div className="mt-4 flex justify-between text-sm text-slate-600">
            <span>Items</span>
            <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-5 w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
