import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, TextField, Autocomplete,
  CircularProgress, Button, Stack, Chip, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// API de CIE-10 (NIH)
const CIE10_API_URL = 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=';

const DiagnosisPage = () => {
  const { patientId } = useParams(); // Obtiene el ID del paciente de la URL
  const navigate = useNavigate();

  // --- Estados ---
  const [patient, setPatient] = useState(null); // Datos del paciente
  const [loadingPatient, setLoadingPatient] = useState(true);
  
  // Estados para el Autocomplete de CIE-10
  const [cie10Options, setCie10Options] = useState([]);
  const [loadingCie10, setLoadingCie10] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  
  // Cargar datos del paciente
  useEffect(() => {
    fetch(`http://localhost:5001/pacientes/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setPatient(data);
        setLoadingPatient(false);
      });
  }, [patientId]);

  // --- BÚSQUEDA CIE-10 ---
  // Esta función se ejecuta cada vez que el usuario teclea
  const fetchCie10 = (searchTerm) => {
    if (searchTerm.length < 3) { // No buscar si es muy corto
      setCie10Options([]);
      return;
    }
    setLoadingCie10(true);
    fetch(`${CIE10_API_URL}${searchTerm}`)
      .then(res => res.json())
      .then(data => {
        // La API devuelve [count, codes, null, results]
        // Mapeamos los resultados a { label, code } para el Autocomplete
        const formattedOptions = data[3].map(item => ({
          code: item[0],
          label: `${item[0]} - ${item[1]}`
        }));
        setCie10Options(formattedOptions);
        setLoadingCie10(false);
      });
  };

  // --- GUARDADO (PATCH Y POST) ---
  // Función para guardar el diagnóstico final (APTO / NO APTO)
  const handleUpdateStatus = (newStatus) => {
    fetch(`http://localhost:5001/pacientes/${patientId}`, {
      method: 'PATCH', // Patch actualiza solo los campos enviados
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estadoPreEmpleo: newStatus }),
    })
    .then(res => res.json())
    .then(updatedPatient => {
      setPatient(updatedPatient); // Actualiza la UI local
      
      // Opcional: guardar el diagnóstico seleccionado en nuestra API
      if (selectedDiagnosis) {
        saveDiagnosisEntry(updatedPatient.id, newStatus);
      }
      
      // Volver a la lista de pacientes después de guardar
      navigate('/dashboard/patients');
    });
  };

  // Función helper para guardar el registro del diagnóstico
  const saveDiagnosisEntry = (patientId, finalStatus) => {
    const payload = {
      patientId: patientId,
      cie10_code: selectedDiagnosis.code,
      cie10_label: selectedDiagnosis.label,
      finalStatus: finalStatus,
      createdAt: new Date().toISOString(),
    };
    fetch('http://localhost:5001/diagnosticos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };


  if (loadingPatient) return <CircularProgress />;
  if (!patient) return <Typography>Paciente no encontrado.</Typography>;

  return (
    <Paper sx={{ p: 4 }}>
      {/* --- Info del Paciente --- */}
      <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
        Diagnóstico: {patient.nombre} {patient.apellido}
      </Typography>
      <Typography variant="h6" gutterBottom>
        DNI: {patient.dni} | Estado Actual: 
        <Chip label={patient.estadoPreEmpleo} size="small" sx={{ ml: 1 }} />
      </Typography>
      
      <Divider sx={{ my: 3 }} />

      {/* --- Buscador CIE-10 --- */}
      <Typography variant="h6" gutterBottom>Añadir Diagnóstico (CIE-10)</Typography>
      <Autocomplete
        id="cie10-search"
        options={cie10Options}
        getOptionLabel={(option) => option.label}
        filterOptions={(x) => x} // Desactiva filtro local, usamos el de la API
        onInputChange={(event, newInputValue) => {
          fetchCie10(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedDiagnosis(newValue);
        }}
        loading={loadingCie10}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar código o enfermedad (ej: 'gripe' o 'J10')"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingCie10 ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {selectedDiagnosis && (
        <Typography sx={{ mt: 1, fontStyle: 'italic' }}>
          Seleccionado: {selectedDiagnosis.label}
        </Typography>
      )}

      {/* --- Acciones Finales --- */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Decisión Final (Pre-empleo)</Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<CheckCircleIcon />}
            onClick={() => handleUpdateStatus('APROBADO_APTO')}
          >
            Aprobar (Apto)
          </Button>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => handleUpdateStatus('APROBADO_CON_RESTRICCION')}
          >
            Aprobar con Restricción
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<CancelIcon />}
            onClick={() => handleUpdateStatus('NO_APTO')}
          >
            No Apto
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default DiagnosisPage;