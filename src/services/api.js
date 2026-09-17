import { adminAuth } from './adminAuth';

// Kundan Works Central API Service
// Connects frontend to PostgreSQL backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(url, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('kundan_admin_token') : null;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  };

  // If body is FormData, delete Content-Type so the browser sets the boundary correctly
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${url}`, config);
  
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.error) errorMessage = errJson.error;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  // Health
  checkHealth: () => request('/api/healthz'),

  // Products
  getProducts: () => request('/api/products'),
  getProductById: (id) => request(`/api/products/${encodeURIComponent(id)}`),
  createProduct: (product) => request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  updateProduct: (id, product) => request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  deleteProduct: (id) => request(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),

  // Categories
  getCategories: () => request('/api/categories'),
  createCategory: (category) => request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  updateCategory: (id, category) => request(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  deleteCategory: (id) => request(`/api/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),

  // Orders & Live Tracking
  getOrders: () => request('/api/orders'),
  trackOrder: (identifier) => request(`/api/orders/${encodeURIComponent(identifier)}`),
  createOrder: (order) => request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  updateOrder: (id, orderData) => request(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  deleteOrder: (id) => request(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),

  // Store Settings
  getConfig: () => request('/api/config'),
  updateConfig: (config) => request('/api/config', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),

  // File Upload (Camera / Gallery images)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Admin Authentication (Zero passwords stored in frontend code)
  adminLogin: (password) => adminAuth.login(password),
  adminVerifySession: (token) => adminAuth.verifySession(token),
  adminChangePassword: ({ currentPassword, newPassword }, token) => adminAuth.changePassword({ currentPassword, newPassword }, token),
  adminLogout: (token) => adminAuth.logout(token),
};

