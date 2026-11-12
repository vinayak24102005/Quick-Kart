import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "../api/productsApi";
import { getErrorMessage } from "../api/apiClient";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";
import { formatPrice } from "../utils/format";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setProduct(null);
    setError("");
    setQty(1);
    getProductById(id)
      .then((p) => !ignore && setProduct(p))
      .catch((err) => !ignore && setError(getErrorMessage(err, "Could not load product")));
    return () => { ignore = true; };
  }, [id]);

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return <Spinner />;

  const outOfStock = product.stock <= 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="mt-5 grid md:grid-cols-2 gap-8 bg-white rounded-2xl border border-slate-200 p-5 md:p-8">
        <img src={product.image} alt={product.name} className="w-full h-72 md:h-96 object-cover rounded-xl bg-slate-100" />

        <div className="flex flex-col">
          {product.category && <span className="text-xs font-semibold text-sky-600 uppercase tracking-wide">{product.category}</span>}
          <h1 className="text-2xl font-bold text-slate-800 mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-slate-900 mt-3">{formatPrice(product.price)}</p>
          <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>

          <p className={`mt-4 text-sm font-medium ${outOfStock ? "text-red-500" : product.stock <= 5 ? "text-amber-600" : "text-emerald-600"}`}>
            {outOfStock ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="px-3 py-2 disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty(qty - 1)} aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button className="px-3 py-2 disabled:opacity-40" disabled={qty >= product.stock} onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button
              disabled={outOfStock}
              onClick={() => addToCart(product._id, qty)}
              className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
