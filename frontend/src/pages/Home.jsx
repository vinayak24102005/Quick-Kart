import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Alert from '../components/Alert';
import { getAllProducts } from '../api/productsApi'
import { getErrorMessage } from '../utils/format';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // What the shopper typed / picked. The filtering happens right here in the browser.
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getAllProducts();
        setProducts(response.products);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // "All" plus every category that exists in the products
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-800">Shop</h1>
      <p className="text-sm text-slate-500 mt-1">Find something you like and add it to your cart.</p>

      {/* Search + category filter */}
      <div className="mt-5 space-y-4">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 bg-white rounded-lg px-3 py-2.5
          text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === name
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Alert>{error}</Alert>

        {loading && <p className="text-slate-500">Loading products...</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-slate-500">
            There are no products yet. Run <code className="bg-slate-100 px-1.5 py-0.5 rounded">npm run seed</code> in the backend folder to add some.
          </p>
        )}

        {!loading && products.length > 0 && visibleProducts.length === 0 && (
          <p className="text-slate-500">No products match your search.</p>
        )}

        <ProductGrid products={visibleProducts} />
      </div>
    </div>
  )
}

export default Home
