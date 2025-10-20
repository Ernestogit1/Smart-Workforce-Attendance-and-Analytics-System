import axios from 'axios'
import { API_BASE_URL } from './endpoint'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

const saved = localStorage.getItem('token')
if (saved) setAuthToken(saved)

