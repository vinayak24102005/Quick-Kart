import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Attach the JWT to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// If the token is rejected (expired/invalid) on a protected call, log the user out
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || ''
        const isAuthForm = url.includes('/auth/login') || url.includes('/auth/register')
        if (error.response?.status === 401 && !isAuthForm && localStorage.getItem('token')) {
            window.dispatchEvent(new Event('auth:expired'))
        }
        return Promise.reject(error)
    }
)

// Turns any axios error into a readable message
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
    error?.response?.data?.message || (error?.request ? 'Cannot reach the server. Is the backend running?' : fallback)

export default api
