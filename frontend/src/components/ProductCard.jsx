import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice, getErrorMessage } from "../utils/format";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  // "idle" -> "adding" (waiting for the server) -> "added" (shown for 1.5 seconds)
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const outOfStock = product.stock <= 0;

  function truncateByCharacters(text, maxChars = 75) {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return `${text.slice(0, maxChars).trim()}...`;
  }

  const handleAddToCart = async () => {
    setError("");
    setStatus("adding");
    try {
      await addToCart(product._id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setStatus("idle");
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-48 bg-slate-50 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Tag */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-blue-50">
            {product.category}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Product Name */}
        <h3
          className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Short Description (Character Truncated) */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 flex-1 leading-relaxed">
          {truncateByCharacters(product.description, 75)}
        </p>

        {/* Price + Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
              Price
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || status === "adding"}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white disabled:cursor-not-allowed ${
              outOfStock
                ? "bg-slate-300"
                : status === "added"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : status === "adding"
              ? "Adding..."
              : status === "added"
              ? "Added!"
              : "+ Add to Cart"}
          </button>
        </div>

        {/* Why adding failed (for example: not enough stock) */}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
