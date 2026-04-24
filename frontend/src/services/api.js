import axios from 'axios'

const api = axios.create({
  baseURL: ' http://localhost:5000/v1/api',
  headers: { 'Content-Type': 'application/json' }
})

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// handle 401 globally — token expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// AUTH
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
}

// TURFS
export const turfAPI = {
  getAll:   (params) => api.get('/turf', { params }),
  getById:  (id)     => api.get(`/turf/${id}`),
  create:   (data)   => api.post('/turf', data),
  update:   (id, data) => api.put(`/turf/${id}`, data),
  delete:   (id)     => api.delete(`/turf/${id}`),

  // photo endpoints
  getPhotos:    (turf_id)           => api.get(`/turf/${turf_id}/photos`),
  uploadPhotos: (turf_id, formData) => api.post(`/turf/${turf_id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePhoto:  (turf_id, photo_id) => api.delete(`/turf/${turf_id}/photos/${photo_id}`),
  makePrimary:  (turf_id, photo_id) => api.patch(`/turf/${turf_id}/photos/${photo_id}/primary`),
}

// SLOTS
export const slotAPI = {
  generate:        (data)          => api.post('/slots/generate', data),
  getAvailability: (turf_id, date) => api.get('/slots/availability', { params: { turf_id, date } }),
  book:            (data)          => api.post('/slots/book', data),
}

// BOOKINGS
export const bookingAPI = {


  // owner APIs — new
    getTurfBookings:  (turf_id)        => api.get(`/bookings/turf/${turf_id}`),
    getTurfOccupancy: (turf_id, date)  => api.get(`/bookings/turf/${turf_id}/occupancy`, { params: { date } }),
    getTurfStats:     (turf_id)        => api.get(`/bookings/turf/${turf_id}/stats`),

  getHistory: ()   => api.get('/bookings/history'),
  getById:    (id) => api.get(`/bookings/${id}`),
  cancel:     (id) => api.patch(`/bookings/cancel/${id}`),
}

// PAYMENTS
export const paymentAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  verify:   (data) => api.post('/payments/verify', data),
}

// REVIEWS
export const reviewAPI = {
  add:         (data)     => api.post('/reviews', data),
  getByTurf:   (turf_id)  => api.get(`/reviews/turf/${turf_id}`),
}

export default api
