import { httpClient } from './httpClient';

const getClientes = (token) => httpClient.get('/api/clientes', { token });
const createCliente = (payload, token) => httpClient.post('/api/clientes', payload, { token });
const updateCliente = (id, payload, token) => httpClient.put(`/api/clientes/${id}`, payload, { token });
const deleteCliente = (id, token) => httpClient.delete(`/api/clientes/${id}`, { token });

export const clienteService = {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
};

