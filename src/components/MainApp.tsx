import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Layout/Sidebar';
import Header from './Layout/Header';
import AdminDashboard from './Dashboard/AdminDashboard';
import DoctorDashboard from './Dashboard/DoctorDashboard';
import StudentDashboard from './Dashboard/StudentDashboard';

export default function MainApp() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!user) {
    return null;
  }

  const renderContent = () => {
    // Dashboard principal
    if (activeSection === 'dashboard') {
      switch (user.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'doctor':
          return <DoctorDashboard />;
        case 'student':
          return <StudentDashboard />;
        default:
          return <div>Dashboard no disponible</div>;
      }
    }

    // Admin: Secciones
    if (user.role === 'admin') {
      if (activeSection === 'students') {
        const GestionEstudiantes = React.lazy(() => import('./Dashboard/Admin/Gestion_Estudiantes.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionEstudiantes />
          </React.Suspense>
        );
      }
      if (activeSection === 'admins') {
        const GestionAdministradores = React.lazy(() => import('./Dashboard/Admin/Gestion_Administradores.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionAdministradores />
          </React.Suspense>
        );
      }
      if (activeSection === 'doctors') {
        const GestionMedicos = React.lazy(() => import('./Dashboard/Admin/Gestion_Medicos'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionMedicos />
          </React.Suspense>
        );
      }
      if (activeSection === 'scholarships') {
        const GestionBecas = React.lazy(() => import('./Dashboard/Admin/Gestion_Becas'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionBecas />
          </React.Suspense>
        );
      }
      if (activeSection === 'reports') {
        const ReporteParticipacion = React.lazy(() => import('./Dashboard/Admin/Reporte_Participacion.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <ReporteParticipacion idEstudiante={user.id} />
          </React.Suspense>
        );
      }
      if (activeSection === 'users') {
        const GestionUsuarios = React.lazy(() => import('./Dashboard/Admin/Gestion_Usuarios'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionUsuarios />
          </React.Suspense>
        );
      
      }
      
      if (activeSection === 'activities') {
        const GestionActividades = React.lazy(() => import('./Dashboard/Admin/Gestion_Actividades'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionActividades />
          </React.Suspense>
        );
      }
    } // Closing brace for if (user.role === 'admin')

    // Doctor: Secciones
    if (user.role === 'doctor') {
      if (activeSection === 'patients') {
        const GestionPacientes = React.lazy(() => import('./Dashboard/Doctor/Gestion_Pacientes'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionPacientes />
          </React.Suspense>
        );
      }
      if (activeSection === 'appointments') {
        const GestionCitas = React.lazy(() => import('./Dashboard/Doctor/Gestion_Citas'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionCitas />
          </React.Suspense>
        );
      }
    }

    // Estudiante: Secciones
    if (user.role === 'student') {
      if (activeSection === 'appointments') {
        const GestionCitasEstudiante = React.lazy(() => import('./Dashboard/Estudiante/Gestion_Citas'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionCitasEstudiante />
          </React.Suspense>
        );
      }
      if (activeSection === 'atentions') {
        const GestionAtencionesEstudiante = React.lazy(() => import('./Dashboard/Estudiante/Gestion_Atenciones.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionAtencionesEstudiante />
          </React.Suspense>
        );
      }
      if (activeSection === 'activities') {
        const GestionActividadesEstudiante = React.lazy(() => import('./Dashboard/Estudiante/Gestion_Actividades.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionActividadesEstudiante />
          </React.Suspense>
        );
      }
      if (activeSection === 'scholarships') {
        const GestionSolicitudesBecas = React.lazy(() => import('./Dashboard/Estudiante/Gestion_Solicitud_Becas.tsx'));
        return (
          <React.Suspense fallback={<div>Cargando sección...</div>}>
            <GestionSolicitudesBecas />
          </React.Suspense>
        );
      }
    }

    // Placeholder para secciones no implementadas
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-teal-600 text-xl">🚧</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sección en Desarrollo</h2>
          <p className="text-gray-600">
            La sección "{activeSection}" estará disponible próximamente.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}