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

// FORCE HTTPS - CLOUDFLARE PAGES REQUIREMENT!
const API_BASE_URL = 'https://linkventory-production.up.railway.app'
const REQUEST_TIMEOUT = 10000 // 10 seconds

// Cloudflare Pages ONLY works with HTTPS
const isCloudflarePages = window.location.hostname.includes('.pages.dev')

// Ensure HTTPS is always used - convert any HTTP to HTTPS
let SECURE_API_BASE_URL = API_BASE_URL.replace(/^http:\/\//i, 'https://')

// On Cloudflare Pages, absolutely enforce HTTPS
if (isCloudflarePages && !SECURE_API_BASE_URL.startsWith('https://')) {
  throw new Error('Cloudflare Pages requires HTTPS API endpoints!')
}

// Double-check HTTPS enforcement
if (!SECURE_API_BASE_URL.startsWith('https://')) {
  SECURE_API_BASE_URL = 'https://' + SECURE_API_BASE_URL.replace(/^https?:\/\//, '')
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const url = `${SECURE_API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
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

    const data = await response.json()
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
      // Check if it's specifically a CORS error
      if (error.message.includes('CORS') || error.message.includes('blocked')) {
        throw new ApiException(
          'Unable to connect to server due to security restrictions. Please check that the backend CORS is properly configured.',
          0,
          'network'
        )
      }
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
  _id: string  // MongoDB uses _id
  title: string
  url: string
  note?: string
  category_id?: string
  user_id: string
  created_at: string
}

export interface Category {
  _id: string  // MongoDB uses _id
  name: string
  user_id: string
  created_at: string
}

export interface User {
  _id: string  // MongoDB uses _id
  name: string
  email: string
}

// Get current user info
export async function getCurrentUser() {
  const token = localStorage.getItem('token')
  
  if (!token) throw new ApiException('No authentication token', 401, 'client')
  
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

// CORS debugging helper
export async function checkCORS() {
  try {
    const response = await fetch(`${SECURE_API_BASE_URL}/ping`, {
      method: 'OPTIONS',
    })
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
    }
    
    console.log('CORS Headers:', corsHeaders)
    return corsHeaders
  } catch (error) {
    console.error('CORS check failed:', error)
    return null
  }
}
