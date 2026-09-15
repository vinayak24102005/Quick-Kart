import { useState } from 'react';
import ProductGrid from '../components/ProductGrid';

const PRODUCTS_DATA = [
  {
    id: 1,
    title: 'Wireless Noise-Canceling Headphones',
    description: 'Immerse yourself in crystal clear acoustics with 40-hour battery life, active noise cancellation, and ergonomic memory foam ear cushions.',
    price: 99.99,
    rating: 4.8,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Classic Minimalist Leather Watch',
    description: 'Timeless analog design featuring a genuine saddle-brown leather strap, quartz precision movement, and water resistance up to 50 meters.',
    price: 139.50,
    rating: 4.6,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Compact RGB Mechanical Keyboard',
    description: 'Engineered for tactile feedback with custom mechanical switches, anodized aluminum casing, and dynamic per-key RGB backlighting.',
    price: 79.99,
    rating: 4.9,
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Insulated Stainless Steel Bottle',
    description: 'Keep your hot drinks steaming for 12 hours or cold refreshments chilled for 24 hours with double-wall copper vacuum insulation.',
    price: 24.99,
    rating: 4.7,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Ergonomic Wireless Optical Mouse',
    description: 'Designed to reduce wrist fatigue during long workdays with whisper-quiet clicks, ultra-precise optical tracking, and rechargeable battery.',
    price: 34.50,
    rating: 4.5,
    category: 'Computers',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'Canvas Everyday Commuter Backpack',
    description: 'Weatherproof waxed canvas backpack equipped with a padded 16-inch laptop compartment, hidden passport pocket, and breathable straps.',
    price: 64.95,
    rating: 4.7,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
];


function Home() {
  const [products] = useState(PRODUCTS_DATA);
  return (
    <>
      <div>Home Page</div>
      <ProductGrid products={products} />
    </>
  )
}

export default Home