import axios from 'axios'

const BACKEND = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${BACKEND}/api/resume`,
  timeout: 120000,
  withCredentials: true,
})

const authApi = axios.create({
  baseURL: `${BACKEND}/api/auth`,
  timeout: 10000,
  withCredentials: true,
})

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(err)
  }
)

// ── Request cancellation support ────────────────────────────────────────

let activeAnalysisController = null

/**
 * Cancels any in-flight analysis request (e.g. when user navigates away).
 * Call this on component unmount or before starting a new analysis.
 */
export const cancelActiveAnalysis = () => {
  if (activeAnalysisController) {
    activeAnalysisController.abort()
    activeAnalysisController = null
  }
}

// ── API methods ─────────────────────────────────────────────────────────

export const analyzeResume = async (file, jobDescription = '', industry = '') => {
  cancelActiveAnalysis() // cancel any previous analysis
  activeAnalysisController = new AbortController()

  const formData = new FormData()
  formData.append('file', file)
  if (jobDescription && jobDescription.trim()) formData.append('jobDescription', jobDescription.trim())
  if (industry && industry.trim())            formData.append('industry', industry.trim())

  try {
    const response = await api.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: activeAnalysisController.signal,
    })
    return response.data
  } finally {
    activeAnalysisController = null
  }
}

export const getStats = async () => {
  const response = await api.get('/stats')
  return response.data
}

export const getHistory = async (page = 0, size = 10) => {
  const response = await api.get(`/history?page=${page}&size=${size}`)
  return response.data
}

export const getAnalysisById = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}

export const login = async (username, password) => {
  const response = await authApi.post('/login', { username, password })
  return response.data
}

export const register = async (username, password, email) => {
  const response = await authApi.post('/register', { username, password, email })
  return response.data
}

export const logout = async () => {
  await authApi.post('/logout')
}

export const getMe = async () => {
  const response = await authApi.get('/me')
  return response.data
}
