import api from './apiClient'

export const getAllProducts = async() => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        if(error.response) {
            throw new Error(error.response.data.message || 'Error fetching products');
        }
        throw error;
    }
}
