import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getStudents = (params) => api.get('/api/students', { params });
export const createStudent = (payload) => api.post('/api/students', payload);
export const updateStudent = (id, payload) => api.put(`/api/students/${id}`, payload);
export const deleteStudent = (id) => api.delete(`/api/students/${id}`);

export default api;
