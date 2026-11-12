import api from './apiClient'

export const getStats = async () => (await api.get('/admin/stats')).data;
export const getAllOrders = async (status) =>
    (await api.get('/admin/orders', { params: status && status !== 'all' ? { status } : {} })).data.orders;
export const updateOrderStatus = async (id, status) => (await api.put(`/admin/orders/${id}/status`, { status })).data;
