import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Spinner from '../components/Spinner';
import { getAllProducts, getCategories } from '../api/productsApi'
import { getErrorMessage } from '../api/apiClient';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');        // debounced search text
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Wait until the user stops typing before searching
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    getAllProducts({ q: query || undefined, category, sort, page, limit: 12 })
      .then((res) => {
        if (ignore) return;
        setProducts(res.products);
        setPages(res.pages);
        setCount(res.productCount);
      })
      .catch((err) => !ignore && setError(getErrorMessage(err, 'Could not load products')))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [query, category, sort, page]);

  const pickCategory = (c) => { setCategory(c); setPage(1); };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-slate-800">Shop</h1>
      <p className="text-sm text-slate-500 mt-1">{count} product{count === 1 ? '' : 's'}</p>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 bg-white"
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-sky-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            onClick={() => pickCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize ${
              category === c ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-600 border-gray-200 hover:border-sky-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner label="Loading products..." />
        ) : error ? (
          <p className="text-center text-red-500 py-16">{error}</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>

      {pages > 1 && !loading && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
