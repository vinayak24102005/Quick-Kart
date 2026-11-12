import api from './apiClient'

export const getAllProducts = async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
}

export const getProductById = async (id) => (await api.get(`/products/${id}`)).data;
export const getCategories = async () => (await api.get('/products/categories')).data.categories;

// Admin
export const createProduct = async (data) => (await api.post('/products', data)).data;
export const updateProduct = async (id, data) => (await api.put(`/products/${id}`, data)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;
