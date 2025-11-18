import { httpClient } from './httpClient';

const getFacturas = (token) => httpClient.get('/api/facturas', { token });
const getFactura = (id, token) => httpClient.get(`/api/facturas/${id}`, { token });
const getFacturasCliente = (clienteId, token) =>
  httpClient.get(`/api/facturas/cliente/${clienteId}`, { token });

const createFactura = (payload, token) => httpClient.post('/api/facturas', payload, { token });
const updateFactura = (id, payload, token) => httpClient.put(`/api/facturas/${id}`, payload, { token });
const deleteFactura = (id, token) => httpClient.delete(`/api/facturas/${id}`, { token });

export const facturaService = {
  getFacturas,
  getFactura,
  getFacturasCliente,
  createFactura,
  updateFactura,
  deleteFactura,
};

