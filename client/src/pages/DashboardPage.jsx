import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login'); // El 'ProtectedRoute' lo haría igual, pero es bueno ser explícito.
  };

  return (
    <div>
      <h2>Panel de Control (Dashboard)</h2>
      <p>¡Bienvenido! Estás logueado.</p>
      <p>Estado de autenticación: {isAuthenticated ? 'Autenticado' : 'No Autenticado'}</p>
      
      <button onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default DashboardPage;