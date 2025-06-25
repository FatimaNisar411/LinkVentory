// Frontend API Integration for LinkVentory
// Replace YOUR_BACKEND_URL with your Railway deployment URL

const API_BASE_URL = 'http://localhost:8000'; // Local backend for testing

// Auth utilities
const getToken = () => localStorage.getItem('access_token');
const setToken = (token) => localStorage.setItem('access_token', token);
const removeToken = () => localStorage.removeItem('access_token');

// API request helper with auth
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
        if (response.status === 401) {
            // Token expired, redirect to login
            removeToken();
            window.location.href = '/login';
            return;
        }
        throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
};

// Auth API calls
export const authAPI = {
    // Login user
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) throw new Error('Login failed');
        
        const data = await response.json();
        setToken(data.access_token);
        return data;
    },

    // Register user
    signup: async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        
        if (!response.ok) throw new Error('Signup failed');
        
        const data = await response.json();
        setToken(data.access_token);
        return data;
    },

    // Logout
    logout: () => {
        removeToken();
        window.location.href = '/login';
    }
};

// User API calls
export const userAPI = {
    // Get current user info
    getMe: () => apiRequest('/me'),
    
    // Get dashboard stats (user name + counts)
    getStats: () => apiRequest('/stats'),
};

// Categories API calls
export const categoriesAPI = {
    // Get all user categories
    getAll: () => apiRequest('/categories'),
    
    // Create new category
    create: (name) => apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
    }),
    
    // Update category
    update: (id, name) => apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name }),
    }),
    
    // Delete category
    delete: (id) => apiRequest(`/categories/${id}`, {
        method: 'DELETE',
    }),
};

// Links API calls
export const linksAPI = {
    // Get all user links (optionally filtered by category)
    getAll: (categoryId = null) => {
        const query = categoryId ? `?category_id=${categoryId}` : '';
        return apiRequest(`/links${query}`);
    },
    
    // Get links by category
    getByCategory: (categoryId) => apiRequest(`/links/category/${categoryId}`),
    
    // Create new link
    create: (linkData) => apiRequest('/links', {
        method: 'POST',
        body: JSON.stringify(linkData),
    }),
    
    // Update link
    update: (id, linkData) => apiRequest(`/links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(linkData),
    }),
    
    // Delete link
    delete: (id) => apiRequest(`/links/${id}`, {
        method: 'DELETE',
    }),
};

// Check if user is authenticated
export const isAuthenticated = () => !!getToken();

// Sample usage for dashboard:
export const loadDashboardData = async () => {
    try {
        const stats = await userAPI.getStats();
        const categories = await categoriesAPI.getAll();
        const links = await linksAPI.getAll();
        
        return {
            user: stats.user,
            totalLinks: stats.stats.total_links,
            totalCategories: stats.stats.total_categories,
            categories,
            links,
        };
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        throw error;
    }
};
