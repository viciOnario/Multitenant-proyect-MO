// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Importa las herramientas de MUI
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme.js'; // 2. Importa tu tema

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envuelve la App */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Esto resetea los estilos (como un mini normalize.css) */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);