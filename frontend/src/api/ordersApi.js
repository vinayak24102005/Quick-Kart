import api from "./apiClient";

// Checkout: turns the cart into an order
export const createOrder = async (shippingAddress) => {
    const response = await api.post("/orders", { shippingAddress });
    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

export const getOrder = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

// method is "card", "upi" or "cod"
export const payOrder = async (orderId, method) => {
    const response = await api.post(`/orders/${orderId}/pay`, { method });
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response.data;
};
