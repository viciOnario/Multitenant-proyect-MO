import { httpClient } from './httpClient';

const getUsers = (token) => httpClient.get('/api/users', { token });
const createUser = (payload, token) => httpClient.post('/api/users', payload, { token });
const updateUser = (id, payload, token) => httpClient.put(`/api/users/${id}`, payload, { token });
const deleteUser = (id, token) => httpClient.delete(`/api/users/${id}`, { token });

export const userService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};

