

import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; //

// Función helper para colorear el estado
const getStatusColor = (status) => {
  switch (status) {
    case 'APROBADO_APTO': return 'success';
    case 'EN_PROCESO': return 'warning';
    case 'NO_APTO': return 'error';
    default: return 'default';
  }
};

// columnas de la tabla
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'dni', headerName: 'DNI', width: 120 },
  { field: 'nombre', headerName: 'Nombre', width: 130 },
  { field: 'apellido', headerName: 'Apellido', width: 130 },
  {
    field: 'empresaCliente',
    headerName: 'Empresa ID',
    width: 120,
  },
  {
    field: 'estadoPreEmpleo',
    headerName: 'Estado',
    width: 200,
    renderCell: (params) => (
      <Chip
        label={params.value.replace('_', ' ')}
        color={getStatusColor(params.value)}
        variant="outlined"
        size="small"
      />
    ),
  },
];

const PatientsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('http://localhost:5001/pacientes')
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando pacientes:", error);
        setLoading(false);
      });
  }, []);

  const handleRowClick = (params) => {
    // params.id es el ID del paciente en esa fila
    navigate(`/dashboard/diagnosis/${params.id}`);
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
        Gestión de Pacientes
      </Typography>
      
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        
        onRowClick={handleRowClick} 

        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.light',
            color: 'secondary.main',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
        }}
      />
    </Box>
  );
};

export default PatientsPage;