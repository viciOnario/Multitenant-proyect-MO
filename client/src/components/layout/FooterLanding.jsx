// client/src/components/layout/FooterLanding.jsx

import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const FooterLanding = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'secondary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          LYNNA Ecosistema Digital © {new Date().getFullYear()}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          
          {/* --- Links actualizados --- */}
          <Link color="inherit" component={RouterLink} to="/about-us">
            Quiénes Somos
          </Link>
          {' | '}
          <Link color="inherit" component={RouterLink} to="/contact">
            Contacto
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default FooterLanding;