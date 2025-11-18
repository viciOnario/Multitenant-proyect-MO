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
  Grid,
  Alert,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { clienteService } from '../services/clienteService';
import { facturaService } from '../services/facturaService';

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Objeto vacío para el formulario
const defaultFormState = {
  cliente: '',
  numero: '',
  fechaEmision: getTodayDate(),
  fechaVencimiento: getTodayDate(),
  montoTotal: 0,
  descripcion: '',
  estado: 'pendiente',
};

export default function FacturacionPage() {
  // --- Estados para los datos de la API ---
  const { token } = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // --- Estados de UI ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [formData, setFormData] = useState(defaultFormState);
  const [facturaAEditar, setFacturaAEditar] = useState(null); // null = Crear
  const [confirmarBorradoAbierto, setConfirmarBorradoAbierto] = useState(false);
  const [facturaABorrar, setFacturaABorrar] = useState(null);

  // --- Cargar datos de la API al montar el componente ---
  useEffect(() => {
    if (!token) return;

    const cargarDatos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [facturasResponse, clientesResponse] = await Promise.all([
          facturaService.getFacturas(token),
          clienteService.getClientes(token),
        ]);

        setFacturas(facturasResponse);
        setClientes(clientesResponse);
      } catch (err) {
        console.error('Error cargando datos:', err);
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
    setFacturaAEditar(null);
    setDialogAbierto(true);
  };

  const handleAbrirDialogEditar = (factura) => {
    setFormData({
      cliente: typeof factura.cliente === 'object' ? factura.cliente?._id : factura.cliente,
      numero: factura.numero,
      fechaEmision: factura.fechaEmision?.substring(0, 10) || getTodayDate(),
      fechaVencimiento: factura.fechaVencimiento?.substring(0, 10) || getTodayDate(),
      montoTotal: factura.total,
      descripcion: factura.items?.[0]?.descripcion || '',
      estado: factura.estado,
    });
    setFacturaAEditar(factura);
    setDialogAbierto(true);
  };

  const handleCerrarDialog = () => {
    setDialogAbierto(false);
    setFacturaAEditar(null);
    setFormData(defaultFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- CRUD: Guardar (Crear/Editar) ---
  const handleGuardarFactura = async (e) => {
    e.preventDefault();
    
    // Convertir monto a número
    const facturaData = {
      ...formData,
      montoTotal: parseFloat(formData.montoTotal),
    };

    try {
      const payload = {
        numero: facturaData.numero,
        cliente: facturaData.cliente,
        total: facturaData.montoTotal,
        estado: facturaData.estado,
        fechaEmision: facturaData.fechaEmision,
        items: [
          {
            descripcion: facturaData.descripcion || 'Servicio',
            cantidad: 1,
            precioUnitario: facturaData.montoTotal,
          },
        ],
      };

      const dataGuardada = facturaAEditar
        ? await facturaService.updateFactura(facturaAEditar._id, payload, token)
        : await facturaService.createFactura(payload, token);

      setFacturas((prev) => {
        if (facturaAEditar) {
          return prev.map((f) => (f._id === dataGuardada._id ? dataGuardada : f));
        }
        return [...prev, dataGuardada];
      });
      
      handleCerrarDialog();

    } catch (error) {
      console.error("Error guardando factura:", error);
      setError(error.message || 'No se pudo guardar la factura');
    }
  };

  // --- CRUD: Borrar ---
  const handleAbrirConfirmarBorrado = (id) => {
    setFacturaABorrar(id);
    setConfirmarBorradoAbierto(true);
  };

  const handleCerrarConfirmarBorrado = () => {
    setFacturaABorrar(null);
    setConfirmarBorradoAbierto(false);
  };

  const handleConfirmarBorrado = async () => {
    try {
      await facturaService.deleteFactura(facturaABorrar, token);
      
      setFacturas(facturas.filter((f) => f._id !== facturaABorrar));
      handleCerrarConfirmarBorrado();
    
    } catch (error) {
      console.error("Error borrando factura:", error);
      setError(error.message || 'No se pudo eliminar la factura');
    }
  };

  // --- Funciones de Ayuda ---
  const getChipColor = (estado) => {
    switch (estado) {
      case 'PAGADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'VENCIDA': return 'error';
      default: return 'default';
    }
  };

  const getNombreCliente = (clienteData) => {
    if (!clienteData) return 'Cliente Desconocido';
    if (typeof clienteData === 'object') return clienteData.razonSocial;
    const cliente = clientes.find((c) => c._id === clienteData);
    return cliente ? cliente.razonSocial : 'Cliente Desconocido';
  };

  const formatCurrency = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(monto);
  };

  // --- Renderizado ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando Facturas...</Typography>
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
          Gestión de Facturación
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleAbrirDialogCrear}
        >
          Crear Factura
        </Button>
      </Box>

      {/* --- Tabla de Facturas --- */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Factura</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha Emisión</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura._id} hover>
                <TableCell>{factura.numero}</TableCell>
                <TableCell>{getNombreCliente(factura.cliente)}</TableCell>
                <TableCell>{factura.fechaEmision?.split('T')[0]}</TableCell>
                <TableCell>{formatCurrency(factura.total)}</TableCell>
                <TableCell>
                  <Chip 
                    label={factura.estado?.toUpperCase()}
                    color={getChipColor(factura.estado?.toUpperCase())}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => handleAbrirDialogEditar(factura)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => handleAbrirConfirmarBorrado(factura._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Modal (Dialog) para Crear / Editar Factura --- */}
      <Dialog open={dialogAbierto} onClose={handleCerrarDialog} fullWidth maxWidth="md">
        <DialogTitle>{facturaAEditar ? 'Editar Factura' : 'Crear Nueva Factura'}</DialogTitle>
        <Box component="form" onSubmit={handleGuardarFactura}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel id="cliente-select-label">Cliente</InputLabel>
                  <Select
                    labelId="cliente-select-label"
                    name="cliente"
                    value={formData.cliente}
                    label="Cliente"
                    onChange={handleInputChange}
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente._id} value={cliente._id}>
                        {cliente.razonSocial}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                 <TextField
                  margin="dense" name="numero" label="N° Factura" type="text" fullWidth
                  value={formData.numero} onChange={handleInputChange} required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  margin="dense" name="fechaEmision" label="Fecha Emisión" type="date" fullWidth
                  value={formData.fechaEmision} onChange={handleInputChange} required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                 <TextField
                  margin="dense" name="fechaVencimiento" label="Fecha Vencimiento" type="date" fullWidth
                  value={formData.fechaVencimiento} onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  name="descripcion"
                  label="Descripción del servicio / producto"
                  type="text"
                  fullWidth
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  margin="dense" name="montoTotal" label="Monto Total (ARS)" type="number" fullWidth
                  value={formData.montoTotal} onChange={handleInputChange} required
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth margin="dense" required>
                  <InputLabel id="estado-select-label">Estado</InputLabel>
                  <Select
                    labelId="estado-select-label"
                    name="estado"
                    value={formData.estado}
                    label="Estado"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="pendiente">Pendiente</MenuItem>
                    <MenuItem value="pagada">Pagada</MenuItem>
                    <MenuItem value="vencida">Vencida</MenuItem>
                    <MenuItem value="cancelada">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCerrarDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {facturaAEditar ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* --- Modal de Confirmación de Borrado --- */}
      <Dialog open={confirmarBorradoAbierto} onClose={handleCerrarConfirmarBorrado}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta factura?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarConfirmarBorrado}>Cancelar</Button>
          <Button onClick={handleConfirmarBorrado} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}