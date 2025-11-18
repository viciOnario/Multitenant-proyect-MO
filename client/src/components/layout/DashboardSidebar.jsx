// client/src/components/layout/DashboardSidebar.jsx

import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../../theme/constants';

// Importa los iconos que usaremos
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Definimos los items del menú en un array
const menuItems = [
  { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Empresas', icon: <BusinessIcon />, path: '/dashboard/companies' },
  { text: 'Pacientes', icon: <PeopleIcon />, path: '/dashboard/patients' },
  { text: 'Agenda', icon: <CalendarMonthIcon />, path: '/dashboard/agenda' },
  { text: 'Facturación', icon: <ReceiptIcon />, path: '/dashboard/facturacion' },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent" // Siempre visible
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        // Estilos para el contenedor del Drawer
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'secondary.main', // Fondo azul oscuro
          color: 'white', // Texto blanco
        },
      }}
    >
      {/* Toolbar para alinear con el Header de arriba */}
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          LYNNA
        </Typography>
      </Toolbar>
      
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  // Estilos para los items
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}> {/* Icono turquesa */}
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default DashboardSidebar;