// API utility with enhanced error handling

export interface ApiError {
  message: string
  status?: number
  type: 'network' | 'server' | 'client' | 'timeout'
}

export class ApiException extends Error {
  status?: number
  type: ApiError['type']

  constructor(message: string, status?: number, type: ApiError['type'] = 'server') {
    super(message)
    this.status = status
    this.type = type
    this.name = 'ApiException'
  }
}

const API_BASE_URL = 'http://localhost:8000' // TODO: Move to environment variable
const REQUEST_TIMEOUT = 10000 // 10 seconds

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const message = errorData.detail || getErrorMessage(response.status)
      
      throw new ApiException(
        message,
        response.status,
        response.status >= 500 ? 'server' : 'client'
      )
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof ApiException) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiException(
        'Request timed out. Please check your connection and try again.',
        0,
        'timeout'
      )
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiException(
        'Unable to connect to server. Please check your internet connection.',
        0,
        'network'
      )
    }

    throw new ApiException(
      'An unexpected error occurred. Please try again.',
      0,
      'network'
    )
  }
}

function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Invalid email or password.'
    case 403:
      return 'Access denied.'
    case 404:
      return 'Service not found.'
    case 409:
      return 'Email already exists.'
    case 422:
      return 'Please check your input and try again.'
    case 429:
      return 'Too many attempts. Please wait and try again.'
    case 500:
      return 'Server error. Please try again later.'
    case 503:
      return 'Service unavailable. Please try again later.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export async function loginUser(email: string, password: string) {
  return apiRequest<{ access_token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signupUser(name: string, email: string, password: string) {
  return apiRequest<{ access_token: string }>('/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
