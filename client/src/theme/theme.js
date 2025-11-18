// client/src/theme/theme.js

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#89d2d4', // Tu color primario
    },
    secondary: {
      main: '#211e5b', // Tu color secundario
    },
    tertiary: { // MUI no tiene "tertiary" por defecto, lo añadimos
      main: '#abd037',
    },
    background: {
      default: '#f4f6f8', // Un gris claro para el fondo del dashboard
      paper: '#ffffff',   // Blanco para tarjetas y sidebars
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});