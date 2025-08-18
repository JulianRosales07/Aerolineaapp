import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/tiquetes',
  headers: { 'Content-Type': 'application/json' },
});

export const tiquetesAPI = {
  getAll: () => api.get('/'),
  getById: (id: number | string) => api.get(`/${id}`),
  create: (data: any) => api.post('/', data),
  update: (id: number | string, data: any) => api.put(`/${id}`, data),
  remove: (id: number | string) => api.delete(`/${id}`),
};