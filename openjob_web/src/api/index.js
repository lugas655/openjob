import api from './axios';
export { default as api } from './axios';

export const authApi = {
  login: (data) => api.post('/authentications', data),
  register: (data) => api.post('/users', data),
  logout: (refreshToken) => api.delete('/authentications', { data: { refreshToken } }),
};

export const jobsApi = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getByCompany: (companyId) => api.get(`/jobs/company/${companyId}`),
  getByCategory: (categoryId) => api.get(`/jobs/category/${categoryId}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationsApi = {
  apply: (jobId, data) => api.post(`/jobs/${jobId}/applications`, data),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const companiesApi = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.put(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
};

export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  getApplications: () => api.get('/profile/applications'),
  getBookmarks: () => api.get('/profile/bookmarks'),
};


export const documentsApi = {
  getAll: () => api.get('/documents'),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const bookmarksApi = {
  add: (jobId) => api.post('/bookmarks', { jobId }),
  remove: (jobId) => api.delete(`/bookmarks/${jobId}`),
};

export const usersApi = {
  update: (id, data) => api.put(`/users/${id}`, data),
};
