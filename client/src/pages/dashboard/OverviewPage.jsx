import React from 'react';
import { Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const OverviewPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Resumen
      </Typography>
      <Typography color="text.secondary">
        Bienvenido al panel. Aquí verás métricas y accesos rápidos.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography color="text.secondary">
                Crea, edita y administra los accesos y roles de tu equipo.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                component={RouterLink}
                to="/dashboard/usuarios"
              >
                Ir a Usuarios
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPage;



