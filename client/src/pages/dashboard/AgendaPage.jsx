

import React, { useState, useEffect } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

// --- Imports de FullCalendar ---
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// Estado inicial del formulario del modal
const initialAppointmentState = {
  title: '',
  patientId: '',
  doctorId: '',
  start: '',
  end: '',
};

const AgendaPage = () => {
  // --- Estados ---
  const [events, setEvents] = useState([]); // Citas para el calendario
  const [openModal, setOpenModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
  
  // Estados para los dropdowns del formulario
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // --- Cargar datos ---
  // 1. Cargar citas existentes
  const fetchEvents = () => {
    fetch('http://localhost:5001/citas')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error cargando citas:", error));
  };

  // 2. Cargar pacientes y médicos para el formulario
  const fetchFormData = () => {
    // Pacientes
    fetch('http://localhost:5001/pacientes')
      .then((res) => res.json())
      .then((data) => setPatients(data));
    
    // Médicos (filtramos por rol desde json-server)
    fetch('http://localhost:5001/users?rol=MEDICO')
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  };

  // Cargar todo al inicio
  useEffect(() => {
    fetchEvents();
    fetchFormData();
  }, []);

  // --- Manejadores del Modal ---
  const handleDateClick = (clickInfo) => {
    // clickInfo contiene la fecha y hora donde se hizo clic
    setNewAppointment({
      ...initialAppointmentState,
      start: clickInfo.dateStr, // Pre-llena la fecha de inicio
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewAppointment(initialAppointmentState); // Limpia el formulario
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- CREAR (POST) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Buscamos el paciente seleccionado para armar el título
    const selectedPatient = patients.find(p => p.id === newAppointment.patientId);
    const title = `Examen: ${selectedPatient.nombre} ${selectedPatient.apellido}`;

    const payload = {
      ...newAppointment,
      title: title,
    };

    fetch('http://localhost:5001/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((citaCreada) => {
        // Actualizamos la UI al instante
        setEvents((prevEvents) => [...prevEvents, citaCreada]);
        handleCloseModal();
      })
      .catch((error) => console.error("Error creando cita:", error));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
        Agenda de Citas
      </Typography>

      {/* --- El Calendario --- */}
      <Box sx={{ backgroundColor: 'background.paper', p: 2, borderRadius: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek" // Vista inicial de Semana
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay', // Botones para cambiar vistas
          }}
          events={events} // Carga las citas desde el estado
          editable={true} // Permite arrastrar eventos (¡json-server lo soporta!)
          selectable={true}
          dateClick={handleDateClick} // ¡Importante! Abre el modal al hacer clic
          locale="es" // Pone el calendario en español
          buttonText={{
             today: 'Hoy',
             month: 'Mes',
             week: 'Semana',
             day: 'Día'
          }}
          slotMinTime="08:00:00" // Horario laboral
          slotMaxTime="19:00:00"
        />
      </Box>

      {/* --- Modal (Dialog) para Nueva Cita --- */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle sx={{ color: 'secondary.main' }}>Crear Nueva Cita</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            {/* Selector de Paciente */}
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="patient-label">Paciente</InputLabel>
              <Select
                labelId="patient-label"
                name="patientId"
                value={newAppointment.patientId}
                label="Paciente"
                onChange={handleFormChange}
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} (DNI: {p.dni})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selector de Médico */}
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="doctor-label">Médico</InputLabel>
              <Select
                labelId="doctor-label"
                name="doctorId"
                value={newAppointment.doctorId}
                label="Médico"
                onChange={handleFormChange}
              >
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.nombre} {d.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Fecha/Hora de Inicio */}
            <TextField
              required
              margin="dense"
              name="start"
              label="Fecha y Hora de Inicio"
              type="datetime-local" // ¡Importante!
              fullWidth
              value={newAppointment.start ? newAppointment.start.substring(0, 16) : ''}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />

            {/* Fecha/Hora de Fin */}
            <TextField
              required
              margin="dense"
              name="end"
              label="Fecha y Hora de Fin"
              type="datetime-local"
              fullWidth
              value={newAppointment.end ? newAppointment.end.substring(0, 16) : ''}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{ color: 'secondary.main' }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'primary.main' }}>
              Guardar Cita
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AgendaPage;