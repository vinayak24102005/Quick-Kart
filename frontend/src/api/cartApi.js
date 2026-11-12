import api from "./apiClient";

// Every cart call returns the whole updated cart: { items: [...], total }

export const getCart = async () => {
    const response = await api.get("/cart");
    return response.data;
};

export const addCartItem = async (productId, quantity = 1) => {
    const response = await api.post("/cart/items", { productId, quantity });
    return response.data;
};

export const updateCartItem = async (productId, quantity) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
};

export const removeCartItem = async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
};
