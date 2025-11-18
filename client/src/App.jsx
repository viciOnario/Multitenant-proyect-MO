import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/landing/HomePage';
import AboutUsPage from './pages/landing/AboutUsPage';
import ContactPage from './pages/landing/ContactPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard pages
import OverviewPage from './pages/dashboard/OverviewPage';
import PatientsPage from './pages/dashboard/PatientsPage';
import CompaniesPage from './pages/dashboard/CompaniesPage';
import AgendaPage from './pages/dashboard/AgendaPage';
import DiagnosisPage from './pages/dashboard/DiagnosisPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import FacturacionPage from './pages/FacturacionPage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Landing layout */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="diagnosis/:patientId" element={<DiagnosisPage />} />
              <Route path="usuarios" element={<GestionUsuariosPage />} />
              <Route path="facturacion" element={<FacturacionPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


