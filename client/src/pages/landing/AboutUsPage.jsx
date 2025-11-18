import { Container, Typography } from '@mui/material';


const AboutUsPage = () => (
  <Container sx={{ py: 4 }}>
    {/* Contenido en Español */}
    <Typography variant="h3">Quiénes Somos</Typography>
    <Typography sx={{ mt: 2 }}>
      Aquí va el contenido de la página Quiénes Somos...
    </Typography>
  </Container>
);


export default AboutUsPage;