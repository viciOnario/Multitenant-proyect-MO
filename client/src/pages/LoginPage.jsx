import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    const result = await login(formValues);
    setSubmitting(false);

    if (result.success) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } else {
      setLocalError(result.message || 'No se pudo iniciar sesión');
    }
  };

  const isDisabled = !formValues.email || !formValues.password || submitting;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Iniciar sesión
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Ingresa tus credenciales para acceder al panel.
        </Typography>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {(localError || authError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {localError || authError}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
          disabled={isDisabled}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
        <Button
          component={Link}
          to="/register"
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
        >
          Crear cuenta
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
