import { useState } from "react";
export function ProductCard({ product }) {

    function truncateByCharacters(text, maxChars = 75) {
        if (!text) return '';
        if (text.length <= maxChars) return text;
        return `${text.slice(0, maxChars).trim()}...`;
    }

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200/80 hover:border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {}
      <div className="relative w-full h-48 bg-slate-50 overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-blue-50">
          {product.category}
        </span>
      </div>

      {}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Product Title */}
        <h3 
          className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Short Description (Character Truncated) */}
        <p className="text-xs sm:text-sm text-slate-500 mt-2 flex-1 leading-relaxed">
          {truncateByCharacters(product.description, 75)}
        </p>

        {}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
              Price
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-900">
              ${product.price}
            </span>
          </div>

          <button
            type="button"
            className={'inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/20 hover:shadow-blue-500/30'}
            // isAdded
            //     ? 'bg-emerald-600 hover:bg-emerald-700 text-white':
          >

            {/* {isAdded ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : ( */}
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </>
            {/* )} */}
          </button>
        </div>
      </div>
    </div>
  );
}