import api from './apiClient'

export const fetchCart = async () => (await api.get('/cart')).data;
export const addCartItem = async (productId, quantity = 1) => (await api.post('/cart', { productId, quantity })).data;
export const updateCartItem = async (productId, quantity) => (await api.put(`/cart/${productId}`, { quantity })).data;
export const removeCartItem = async (productId) => (await api.delete(`/cart/${productId}`)).data;
export const clearCartApi = async () => (await api.delete('/cart')).data;
