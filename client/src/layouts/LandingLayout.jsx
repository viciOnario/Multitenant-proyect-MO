import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renderiza la página actual
import { Box } from '@mui/material';
import HeaderLanding from '../components/layout/HeaderLanding';
import FooterLanding from '../components/layout/FooterLanding';

const LandingLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderLanding />
      
      {/* "main" crece para empujar el footer hacia abajo */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet /> 
      </Box>

      <FooterLanding />
    </Box>
  );
};

export default LandingLayout;