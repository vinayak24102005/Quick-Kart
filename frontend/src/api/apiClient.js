import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Before every request: attach the login token (if there is one),
// so the backend knows who is asking.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// After every response: if the backend says the token is no longer valid
// (for example it expired), log the user out and go to the login page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem('token')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.assign('/login')
        }
        return Promise.reject(error)
    }
)

export default api
