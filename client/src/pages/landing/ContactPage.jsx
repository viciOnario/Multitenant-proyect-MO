import { Container, Typography } from '@mui/material';


const ContactPage = () => (
  <Container sx={{ py: 4 }}>
    {/* Contenido en Español */}
    <Typography variant="h3">Contacto</Typography>
    <Typography sx={{ mt: 2 }}>
      Aquí va el formulario de contacto...
    </Typography>
  </Container>
);


export default ContactPage;