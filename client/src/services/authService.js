import { httpClient } from './httpClient';

const login = (credentials) => httpClient.post('/api/auth/login', credentials);
const register = (payload) => httpClient.post('/api/auth/register', payload);

export const authService = {
  login,
  register,
};

