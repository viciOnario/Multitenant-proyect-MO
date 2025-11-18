import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { clienteService } from '../services/clienteService';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'cliente', label: 'Cliente' },
];

const defaultFormState = {
  nombre: '',
  email: '',
  password: '',
  role: 'admin',
  cliente: '',
};

const clienteInitialState = {
  razonSocial: '',
  cuit: '',
  email: '',
  telefono: '',
  direccion: '',
};

export default function GestionUsuariosPage() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [formData, setFormData] = useState(defaultFormState);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [confirmarBorradoAbierto, setConfirmarBorradoAbierto] = useState(false);
  const [usuarioABorrar, setUsuarioABorrar] = useState(null);
  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState(clienteInitialState);
  const [clienteError, setClienteError] = useState(null);

  useEffect(() => {
    if (!token) return;
    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usuariosResponse, clientesResponse] = await Promise.all([
          userService.getUsers(token),
          clienteService.getClientes(token),
        ]);
        setUsuarios(usuariosResponse);
        setClientes(clientesResponse);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
        setError(err.message || 'No se pudo cargar la información');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [token]);

  // --- Funciones de Apertura/Cierre de Modales ---
  const handleAbrirDialogCrear = () => {
    setFormData(defaultFormState);
    setUsuarioAEditar(null);
    setDialogAbierto(true);
  };

  const handleAbrirDialogEditar = (user) => {
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: '',
      role: user.role,
      cliente: typeof user.cliente === 'object' ? user.cliente?._id : user.cliente ?? '',
    });
    setUsuarioAEditar(user);
    setDialogAbierto(true);
  };

  const handleCerrarDialog = () => {
    setDialogAbierto(false);
    setUsuarioAEditar(null);
    setFormData(defaultFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      role: formData.role,
      ...(formData.role === 'cliente' ? { cliente: formData.cliente } : { cliente: null }),
    };

    if (!usuarioAEditar || formData.password) {
      payload.password = formData.password;
    }

    try {
      if (usuarioAEditar) {
        const updated = await userService.updateUser(usuarioAEditar._id, payload, token);
        setUsuarios((prev) => prev.map((user) => (user._id === updated._id ? updated : user)));
      } else {
        const created = await userService.createUser(payload, token);
        setUsuarios((prev) => [...prev, created]);
      }

      handleCerrarDialog();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      setError(err.message || 'No se pudo guardar el usuario');
    }
  };

  // --- CRUD: Borrar ---
  const handleAbrirConfirmarBorrado = (id) => {
    setUsuarioABorrar(id);
    setConfirmarBorradoAbierto(true);
  };

  const handleCerrarConfirmarBorrado = () => {
    setUsuarioABorrar(null);
    setConfirmarBorradoAbierto(false);
  };

  const handleConfirmarBorrado = async () => {
    try {
      await userService.deleteUser(usuarioABorrar, token);
      setUsuarios((prev) => prev.filter((user) => user._id !== usuarioABorrar));
      handleCerrarConfirmarBorrado();
    } catch (err) {
      console.error('Error borrando usuario:', err);
      setError(err.message || 'No se pudo eliminar el usuario');
    }
  };
  const handleAbrirModalCliente = () => {
    setNuevoCliente(clienteInitialState);
    setClienteError(null);
    setModalClienteAbierto(true);
  };

  const handleGuardarCliente = async (event) => {
    event.preventDefault();
    setClienteError(null);
    try {
      const created = await clienteService.createCliente(nuevoCliente, token);
      setClientes((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, cliente: created._id }));
      setModalClienteAbierto(false);
    } catch (err) {
      setClienteError(err.message || 'No se pudo crear el cliente');
    }
  };


  // --- Funciones de Ayuda ---
  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'cliente':
        return 'success';
      default:
        return 'default';
    }
  };

  const getNombreCliente = (clienteData) => {
    if (!clienteData) return 'N/A (Interno LYNNA)';
    if (typeof clienteData === 'object') return clienteData.razonSocial;
    const cliente = clientes.find((c) => c._id === clienteData);
    return cliente ? cliente.razonSocial : 'Cliente Desconocido';
  };

  // --- Renderizado ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAbrirDialogCrear}
        >
          Crear Usuario
        </Button>
      </Box>

      {/* --- Tabla de Usuarios --- */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Perfil (Rol)</TableCell>
              <TableCell>Empresa Cliente</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role}
                    color={getRoleChipColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{getNombreCliente(user.cliente)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => handleAbrirDialogEditar(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => handleAbrirConfirmarBorrado(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Modal (Dialog) para Crear / Editar Usuario --- */}
      <Dialog open={dialogAbierto} onClose={handleCerrarDialog} fullWidth maxWidth="sm">
        <DialogTitle>{usuarioAEditar ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
        <Box component="form" onSubmit={handleGuardarUsuario}>
          <DialogContent>
            <TextField
              autoFocus margin="dense" name="nombre" label="Nombre Completo" type="text" fullWidth
              value={formData.nombre} onChange={handleInputChange} required
            />
            <TextField
              margin="dense" name="email" label="Email" type="email" fullWidth
              value={formData.email} onChange={handleInputChange} required
              disabled={Boolean(usuarioAEditar)}
            />
            <TextField
              margin="dense" name="password" label="Contraseña" type="password" fullWidth
              value={formData.password} onChange={handleInputChange}
              required={!usuarioAEditar}
              helperText={usuarioAEditar ? 'Dejar en blanco para no cambiarla' : 'Mínimo 6 caracteres'}
            />
            
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="role-select-label">Perfil (Rol)</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                label="Perfil (Rol)"
                onChange={handleInputChange}
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.value} value={rol.value}>
                    {rol.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.role === 'cliente' && (
              <>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel id="cliente-select-label">Empresa Cliente Asignada</InputLabel>
                  <Select
                    labelId="cliente-select-label"
                    name="cliente"
                    value={formData.cliente}
                    label="Empresa Cliente Asignada"
                    onChange={handleInputChange}
                    disabled={!clientes.length}
                  >
                    {!clientes.length ? (
                      <MenuItem value="" disabled>
                        No hay clientes disponibles
                      </MenuItem>
                    ) : (
                      clientes.map((cliente) => (
                        <MenuItem key={cliente._id} value={cliente._id}>
                          {cliente.razonSocial} - {cliente.cuit}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={handleAbrirModalCliente}
                >
                  Crear nueva empresa
                </Button>
              </>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCerrarDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {usuarioAEditar ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* --- Modal de Confirmación de Borrado --- */}
      <Dialog open={confirmarBorradoAbierto} onClose={handleCerrarConfirmarBorrado}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarConfirmarBorrado}>Cancelar</Button>
          <Button onClick={handleConfirmarBorrado} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Modal para crear Cliente --- */}
      <Dialog open={modalClienteAbierto} onClose={() => setModalClienteAbierto(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nueva empresa cliente</DialogTitle>
        <Box component="form" onSubmit={handleGuardarCliente}>
          <DialogContent>
            {clienteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {clienteError}
              </Alert>
            )}
            <TextField
              margin="dense"
              name="razonSocial"
              label="Razón Social"
              type="text"
              fullWidth
              required
              value={nuevoCliente.razonSocial}
              onChange={(e) => setNuevoCliente((prev) => ({ ...prev, razonSocial: e.target.value }))}
            />
            <TextField
              margin="dense"
              name="cuit"
              label="CUIT"
              type="text"
              fullWidth
              required
              value={nuevoCliente.cuit}
              onChange={(e) => setNuevoCliente((prev) => ({ ...prev, cuit: e.target.value }))}
              helperText="Formato: XX-XXXXXXXX-X"
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              value={nuevoCliente.email}
              onChange={(e) => setNuevoCliente((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              margin="dense"
              name="telefono"
              label="Teléfono"
              type="text"
              fullWidth
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente((prev) => ({ ...prev, telefono: e.target.value }))}
            />
            <TextField
              margin="dense"
              name="direccion"
              label="Dirección"
              type="text"
              fullWidth
              value={nuevoCliente.direccion}
              onChange={(e) => setNuevoCliente((prev) => ({ ...prev, direccion: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalClienteAbierto(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Crear empresa
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}