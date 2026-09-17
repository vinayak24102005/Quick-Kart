import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import {getAllProducts} from '../api/productsApi'

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await getAllProducts();
      console.log(`Fetched ${response.productCount} products from the backend.`);
      setProducts(response.products);
    }
    fetchProducts();
  }, []);


  return (
    <>
      <div>Home Page</div>
      <ProductGrid products={products} />
    </>
  )
}

export default Home