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

// FORCE HTTPS - DO NOT USE HTTP FOR SECURITY!
const API_BASE_URL = 'https://linkventory-production.up.railway.app'
const REQUEST_TIMEOUT = 10000 // 10 seconds

// Force HTTPS and add cache busting
console.log('=== API CONFIGURATION ===')
console.log('API_BASE_URL configured as:', API_BASE_URL)
console.log('Current timestamp for cache busting:', Date.now())
console.log('Deployment version:', '2025-06-25-v3') // Cache buster

// Ensure HTTPS is always used
if (API_BASE_URL.startsWith('http://')) {
  throw new Error('API_BASE_URL must use HTTPS for security!')
}

// Double check the URL construction
const testUrl = `${API_BASE_URL}/ping`
console.log('Test URL construction:', testUrl)
if (testUrl.includes('http://')) {
  throw new Error('URL construction is creating HTTP instead of HTTPS!')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log('Making API request to:', url)
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)
    console.log('Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.log('Error response data:', errorData)
      const message = errorData.detail || getErrorMessage(response.status)
      
      throw new ApiException(
        message,
        response.status,
        response.status >= 500 ? 'server' : 'client'
      )
    }

    const data = await response.json()
    console.log('Success response data:', data)
    return data
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

// Dashboard API functions
export interface Link {
  id: string
  title: string
  url: string
  note?: string
  category_id?: string
  user_id: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  user_id: string
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
}

// Get current user info
export async function getCurrentUser() {
  const token = localStorage.getItem('token')
  console.log('Token from localStorage:', token ? 'Token exists' : 'No token found')
  
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  console.log('Making request to:', `${API_BASE_URL}/me/`)
  
  return apiRequest<User>('/me/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

// Links API
export async function getLinks() {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<Link[]>('/links/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function getLinksForCategory(categoryId: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  console.log('getLinksForCategory called with categoryId:', categoryId)
  
  if (!categoryId || categoryId === 'undefined') {
    throw new ApiException('Invalid category ID', 400, 'client')
  }
  
  return apiRequest<Link[]>(`/links/category/${categoryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function createLink(linkData: { title: string; url: string; note?: string; category_id?: string }) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<Link>('/links/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: linkData.title,
      url: linkData.url,
      note: linkData.note || null,
      category_id: linkData.category_id || null,
    }),
  })
}

export async function updateLink(linkId: string, linkData: { title?: string; url?: string; note?: string; category_id?: string }) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<Link>(`/links/${linkId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
  })
}

export async function deleteLink(linkId: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<{ message: string }>(`/links/${linkId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

// Categories API
export async function getCategories() {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<Category[]>('/categories/', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function createCategory(name: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<Category>('/categories/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      name,
    }),
  })
}

export async function deleteCategory(categoryId: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
  return apiRequest<{ message: string }>(`/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}
