import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button,
} from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de autenticación

// Importa los iconos que usaremos
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

// Definimos el ancho de la barra lateral
const drawerWidth = 240;

export default function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir al login después de cerrar sesión
  };

  // Lista de enlaces de navegación
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Facturación', icon: <ReceiptIcon />, path: '/dashboard/facturacion' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/dashboard/usuarios' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* --- AppBar (Barra Superior) --- */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`, // Empuja la AppBar a la derecha del Drawer
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            LYNNA - Gestión de Medicina Laboral
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* --- Drawer (Barra Lateral) --- */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent" // La dejamos fija
        anchor="left"
      >
        <Toolbar>
          {/* Puedes poner tu logo aquí */}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            LYNNA
          </Typography>
        </Toolbar>
        
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={RouterLink} to={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* --- Contenido Principal de la Página --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Ocupa el espacio restante
          bgcolor: 'background.default',
          p: 3, // Padding
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {/* Espaciador para que el contenido no quede debajo de la AppBar */}
        <Toolbar /> 
        
        {/* --- Aquí se renderizan las páginas hijas (Dashboard, Facturación, etc.) --- */}
        <Outlet />
        
      </Box>
    </Box>
  );
}