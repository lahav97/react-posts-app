import axios from 'axios'
import type { ApiError } from '../types'

export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

function messageForStatus(status: number): string {
  if (status === 404) return 'We could not find what you were looking for.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'The server is having trouble. Please try again shortly.'
  if (status >= 400) return 'That request could not be completed.'
  return 'Something went wrong.'
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return { message: 'The request timed out. Please try again.', isNetworkError: true }
    }
    if (!error.response) {
      return { message: 'Network error. Check your connection.', isNetworkError: true }
    }
    return {
      message: messageForStatus(error.response.status),
      status: error.response.status,
      isNetworkError: false,
    }
  }
  return { message: 'An unexpected error occurred.', isNetworkError: false }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
)