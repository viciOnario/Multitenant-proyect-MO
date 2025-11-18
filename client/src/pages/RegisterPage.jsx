import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const initialValues = {
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'admin',
};

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'cliente', label: 'Cliente' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formValues.nombre || !formValues.email || !formValues.password || !formValues.confirmPassword) {
      return 'Todos los campos son obligatorios';
    }
    if (formValues.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formValues.password !== formValues.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await authService.register({
        nombre: formValues.nombre,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
      });

      setSuccess('Usuario registrado con éxito. Puedes iniciar sesión.');
      setFormValues(initialValues);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.message || 'No se pudo registrar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 520 }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Crear cuenta
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Registra un nuevo usuario para acceder al panel.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Nombre completo"
              name="nombre"
              value={formValues.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              fullWidth
              required
              helperText="Mínimo 6 caracteres"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              select
              label="Rol"
              name="role"
              value={formValues.role}
              onChange={handleChange}
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
          disabled={submitting}
        >
          {submitting ? 'Registrando...' : 'Registrar'}
        </Button>

        <Button
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage;

