// client/src/pages/landing/HomePage.jsx

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box>
      {/* --- Hero Section --- */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(80vh)', // Ocupa el 80% de la altura de la ventana
          textAlign: 'center',
          p: 4,
          backgroundColor: '#f4f6f8', // Un fondo gris muy claro
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'secondary.main' }}
          >
            Bienvenido a LYNNA
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            El Ecosistema Digital N°1 para Medicina Laboral y Ocupacional.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/contact"
            sx={{
              mt: 4,
              backgroundColor: 'tertiary.main', // Tu color verde
              color: 'secondary.main',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'primary.main', // Turquesa
              },
            }}
          >
            Solicitar una Demo
          </Button>
        </Container>
      </Box>

      {/* --- Aquí puedes añadir más secciones (Features, etc.) --- */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Nuestros Servicios
        </Typography>
        {/* Aquí iría un Grid de MUI con los servicios */}
      </Container>
    </Box>
  );
};

export default HomePage;