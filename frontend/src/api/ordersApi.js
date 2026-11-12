import api from './apiClient'

export const createOrder = async (payload) => (await api.post('/orders', payload)).data;
export const getMyOrders = async () => (await api.get('/orders')).data.orders;
export const getOrder = async (id) => (await api.get(`/orders/${id}`)).data;
export const payOrder = async (id) => (await api.post(`/orders/${id}/pay`)).data;
export const cancelOrder = async (id) => (await api.put(`/orders/${id}/cancel`)).data;
