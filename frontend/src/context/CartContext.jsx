import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../api/cartApi";

// Keeps the shopping cart in one place so the product cards, the sidebar badge
// and the Cart page all show the same thing.
// The real cart lives on the server; this is just the latest copy of it.
const CartContext = createContext();

const EMPTY_CART = { items: [], total: 0 };

export const CartProvider = ({ children }) => {
  const { isLoggedin } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);

  // true until the first load finishes, so pages can show "Loading..."
  // instead of flashing "your cart is empty"
  const [cartLoading, setCartLoading] = useState(true);

  // Load the cart when the user logs in, and forget it when they log out
  useEffect(() => {
    if (!isLoggedin) {
      setCart(EMPTY_CART);
      setCartLoading(false);
      return;
    }
    setCartLoading(true);
    cartApi
      .getCart()
      .then(setCart)
      .catch((error) => console.error("Could not load the cart:", error))
      .finally(() => setCartLoading(false));
  }, [isLoggedin]);

  // Each action asks the server to change the cart, then stores the updated
  // cart the server sends back. If the server refuses (for example "out of
  // stock") the error is thrown so the page can show it.
  const addToCart = async (productId, quantity = 1) =>
    setCart(await cartApi.addCartItem(productId, quantity));

  const updateQuantity = async (productId, quantity) =>
    setCart(await cartApi.updateCartItem(productId, quantity));

  const removeFromCart = async (productId) =>
    setCart(await cartApi.removeCartItem(productId));

  // Used after checkout, when the server has emptied the cart
  const reloadCart = async () => {
    try {
      setCart(await cartApi.getCart());
    } catch (error) {
      console.error("Could not reload the cart:", error);
    }
  };

  // Total number of items (3 shirts + 1 mug = 4)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, itemCount, addToCart, updateQuantity, removeFromCart, reloadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
