import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  function truncateByCharacters(text, maxChars = 75) {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return `${text.slice(0, maxChars).trim()}...`;
  }

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`} className="relative block w-full h-48 bg-slate-50 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${outOfStock ? "opacity-50" : ""}`}
          loading="lazy"
        />
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-blue-50">
            {product.category}
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <h3
            className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 flex-1 leading-relaxed">
          {truncateByCharacters(product.description, 75)}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">Price</span>
            <span className="text-lg sm:text-xl font-bold text-slate-900">{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product._id, 1)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-slate-300 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
