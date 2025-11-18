

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import DashboardHeader from '../components/layout/DashboardHeader';
import DashboardSidebar from '../components/layout/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header (Superior) */}
      <DashboardHeader />

      {/* Sidebar (Izquierda) */}
      <DashboardSidebar />

      {/* Contenido Principal (Derecha) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Ocupa el espacio restante
          bgcolor: 'background.default', // Fondo gris claro
          p: 3, // Padding interno
          width: `calc(100% - 240px)`, // Ancho menos el sidebar
        }}
      >
        {/* Toolbar sirve como un espaciador para que el contenido no quede oculto bajo el Header */}
        <Toolbar />

        {/* Aquí se renderizan las páginas (OverviewPage, PatientsPage, etc.) */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;