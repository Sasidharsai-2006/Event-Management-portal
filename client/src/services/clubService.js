import axios from 'axios'

const API_URL = '/api/clubs'

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

// Get all clubs
const getClubs = async (filters = {}) => {
  const response = await api.get('/', { params: filters })
  return response.data
}

// Get single club
const getClub = async (clubId) => {
  const response = await api.get(`/${clubId}`)
  return response.data
}

// Create club
const createClub = async (clubData) => {
  const response = await api.post('/', clubData)
  return response.data
}

// Update club
const updateClub = async (clubId, clubData) => {
  const response = await api.put(`/${clubId}`, clubData)
  return response.data
}

// Delete club
const deleteClub = async (clubId) => {
  const response = await api.delete(`/${clubId}`)
  return response.data
}

// Join club
const joinClub = async (clubId) => {
  const response = await api.post(`/${clubId}/join`)
  return response.data
}

// Leave club
const leaveClub = async (clubId) => {
  const response = await api.post(`/${clubId}/leave`)
  return response.data
}

// Update member status
const updateMemberStatus = async (clubId, memberId, statusData) => {
  const response = await api.put(`/${clubId}/members/${memberId}`, statusData)
  return response.data
}

const clubService = {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  updateMemberStatus,
}

export default clubService
