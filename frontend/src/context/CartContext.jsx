import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { getErrorMessage } from "../api/apiClient";
import * as cartApi from "../api/cartApi";

const CartContext = createContext();
const EMPTY = { items: [], total: 0, itemCount: 0 };

export const CartProvider = ({ children }) => {
    const { isLoggedin } = useAuth();
    const { toast } = useToast();
    const [cart, setCart] = useState(EMPTY);
    const [loading, setLoading] = useState(isLoggedin);

    const refreshCart = useCallback(async () => {
        setLoading(true);
        try {
            setCart(await cartApi.fetchCart());
        } catch (error) {
            toast(getErrorMessage(error), "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Load the cart on login, empty it on logout
    useEffect(() => {
        if (isLoggedin) refreshCart();
        else setCart(EMPTY);
    }, [isLoggedin, refreshCart]);

    // Runs a cart API call, stores the returned cart, and reports errors as toasts.
    const run = async (fn, successMessage) => {
        try {
            setCart(await fn());
            if (successMessage) toast(successMessage);
            return true;
        } catch (error) {
            toast(getErrorMessage(error), "error");
            return false;
        }
    };

    const value = {
        cart,
        loading,
        refreshCart,
        addToCart: (productId, qty = 1) => run(() => cartApi.addCartItem(productId, qty), "Added to cart"),
        updateQuantity: (productId, qty) => run(() => cartApi.updateCartItem(productId, qty)),
        removeFromCart: (productId) => run(() => cartApi.removeCartItem(productId), "Item removed"),
        clearCart: () => run(() => cartApi.clearCartApi()),
        // After an order is placed the server has already emptied the cart
        resetCart: () => setCart(EMPTY),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
