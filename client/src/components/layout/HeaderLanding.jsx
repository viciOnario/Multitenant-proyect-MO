

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HeaderLanding = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
      <Toolbar>
        {/* ... (Logo y Box) ... */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          LYNNA
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        {/* --- Links de Navegación (actualizados) --- */}
        <Button component={RouterLink} to="/about-us" color="inherit">
          Quiénes Somos
        </Button>
        <Button component={RouterLink} to="/contact" color="inherit">
          Contacto
        </Button>

        {/* ... (Botón Dashboard) ... */}
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          sx={{
            ml: 2,
            backgroundColor: 'primary.main',
            color: 'secondary.main',
            '&:hover': {
              backgroundColor: 'tertiary.main',
              color: 'secondary.main',
            },
          }}
        >
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderLanding;