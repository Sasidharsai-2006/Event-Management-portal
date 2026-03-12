import axios from 'axios'

const API_URL = '/api/events'

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

// Get all events
const getEvents = async (filters = {}) => {
  const response = await api.get('/', { params: filters })
  return response.data
}

// Get single event
const getEvent = async (eventId) => {
  const response = await api.get(`/${eventId}`)
  return response.data
}

// Create event
const createEvent = async (eventData) => {
  const response = await api.post('/', eventData)
  return response.data
}

// Update event
const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/${eventId}`, eventData)
  return response.data
}

// Delete event
const deleteEvent = async (eventId) => {
  const response = await api.delete(`/${eventId}`)
  return response.data
}

// Register for event
const registerForEvent = async (eventId, registrationData = {}) => {
  const response = await api.post(`/${eventId}/register`, registrationData)
  return response.data
}

// Unregister from event
const unregisterFromEvent = async (eventId) => {
  const response = await api.delete(`/${eventId}/register`)
  return response.data
}

const eventService = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
}

export default eventService
