import axios from 'axios'

const API_URL = '/api/auth'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Register user
const register = async (userData) => {
  const response = await api.post('/register', userData)
  
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await api.post('/login', userData)
  
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Get current user
const getMe = async () => {
  const response = await api.get('/me')
  return response.data
}

// Update profile
const updateProfile = async (userData) => {
  const response = await api.put('/profile', userData)
  return response.data
}

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put('/change-password', passwordData)
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
}

export default authService
