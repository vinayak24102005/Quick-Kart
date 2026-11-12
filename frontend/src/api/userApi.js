import api from './apiClient'

export const getProfile = async () => (await api.get('/users/me')).data;
export const updateProfile = async (data) => (await api.put('/users/me', data)).data;
export const changePassword = async (data) => (await api.put('/users/me/password', data)).data;
