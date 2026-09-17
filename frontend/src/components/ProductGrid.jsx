import { ProductCard } from './ProductCard';

export default function ProductGrid({ products }) {

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 md:p-8">
      
      {}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}