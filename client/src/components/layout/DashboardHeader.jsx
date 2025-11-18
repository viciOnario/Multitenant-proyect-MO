// client/src/components/layout/DashboardHeader.jsx

import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Button, Tooltip } from '@mui/material';
import { DRAWER_WIDTH } from '../../theme/constants';

// Iconos de placeholder
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      position="fixed" // Fijo en la parte superior
      elevation={1} // Sombra sutil
      sx={{
        // Deja espacio para el sidebar
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`, // Margen izquierdo igual al sidebar
        backgroundColor: 'background.paper', // Fondo blanco
        color: 'text.primary', // Texto oscuro
      }}
    >
      <Toolbar>
        {/* Este Box empuja los iconos a la derecha */}
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="Notificaciones">
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={user?.nombre || 'Usuario'}>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          sx={{ ml: 2 }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;