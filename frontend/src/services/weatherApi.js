import api from './api';

export const weatherService = {
  getCurrent: (params) => api.get('/weather/current', { params }),
  getForecast: (params) => api.get('/weather/forecast', { params }),
  getHistory: () => api.get('/weather/history'),
};

export const favoritesService = {
  list: () => api.get('/favorites'),
  add: (payload) => api.post('/favorites', payload),
  remove: (id) => api.delete(`/favorites/${id}`),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (payload) => api.put('/profile', payload),
  updateSettings: (payload) => api.put('/profile/settings', payload),
};

export const adminService = {
  listUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
  listAlerts: () => api.get('/admin/alerts'),
  createAlert: (payload) => api.post('/admin/alerts', payload),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),
};