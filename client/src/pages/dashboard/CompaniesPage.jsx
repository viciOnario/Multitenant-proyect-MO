

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';
import { clienteService } from '../../services/clienteService';

const initialState = {
  razonSocial: '',
  cuit: '',
  email: '',
  telefono: '',
  direccion: '',
  nominas: 0,
  estado: 'activo',
};

const CompaniesPage = () => {
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState(initialState);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const columns = [
    { field: 'razonSocial', headerName: 'Razón Social', flex: 1, minWidth: 200 },
    { field: 'cuit', headerName: 'CUIT', width: 160 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 220 },
    { field: 'telefono', headerName: 'Teléfono', width: 140 },
    {
      field: 'nominas',
      headerName: 'Nóminas',
      width: 120,
      valueGetter: (params) => params?.value ?? params?.row?.nominas ?? 0,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value === 'activo' ? 'Activa' : 'Inactiva'}
          color={params.value === 'activo' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" size="small" onClick={() => handleOpenModal(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleOpenDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const fetchCompanies = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getClientes(token);
      console.log('fetchCompanies response:', data);
      setCompanies(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [token]);

  const handleOpenModal = (company = null) => {
    if (company) {
      setEditingCompany(company);
      setFormValues({
        razonSocial: company.razonSocial,
        cuit: company.cuit,
        email: company.email,
        telefono: company.telefono || '',
        direccion: company.direccion || '',
        nominas: company.nominas ?? 0,
        estado: company.estado,
      });
    } else {
      setEditingCompany(null);
      setFormValues(initialState);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCompany(null);
    setFormValues(initialState);
  };

  const handleOpenDelete = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setCompanyToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'nominas' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const payload = {
      ...formValues,
      nominas: Number(formValues.nominas) || 0,
    };

    try {
      if (editingCompany) {
        const updated = await clienteService.updateCliente(editingCompany._id, payload, token);
        console.log('updateCliente response:', updated);
        setCompanies((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      } else {
        const created = await clienteService.createCliente(payload, token);
        console.log('createCliente response:', created);
        setCompanies((prev) => [...prev, created]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la empresa');
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;
    setError(null);
    try {
      await clienteService.deleteCliente(companyToDelete._id, token);
      setCompanies((prev) => prev.filter((c) => c._id !== companyToDelete._id));
      handleCloseDelete();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la empresa');
    }
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
          Gestión de Empresas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ backgroundColor: 'tertiary.main', color: 'secondary.main', '&:hover': { backgroundColor: 'primary.main' } }}
        >
          Agregar Empresa
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={companies}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        sx={{ backgroundColor: 'background.paper' }}
        autoHeight
      />

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'secondary.main' }}>
          {editingCompany ? 'Editar Empresa' : 'Registrar Nueva Empresa'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              name="razonSocial"
              label="Razón Social"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.razonSocial}
              onChange={handleFormChange}
            />
            <TextField
              required
              margin="dense"
              name="cuit"
              label="CUIT"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.cuit}
              onChange={handleFormChange}
            />
            <TextField
              required
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formValues.email}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="telefono"
              label="Teléfono"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.telefono}
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              name="direccion"
              label="Dirección"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.direccion}
              onChange={handleFormChange}
            />
            <TextField
              required
              margin="dense"
              name="nominas"
              label="Cantidad de nóminas"
              type="number"
              fullWidth
              variant="outlined"
              value={formValues.nominas}
              onChange={handleFormChange}
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{ color: 'secondary.main' }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'primary.main' }}>
              {editingCompany ? 'Actualizar' : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
        <DialogTitle>Eliminar empresa</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar{' '}
            <strong>{companyToDelete?.razonSocial}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDeleteCompany}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompaniesPage;