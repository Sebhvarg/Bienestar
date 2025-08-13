import React, { useEffect, useState, Suspense } from 'react';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';

interface Stat {
  id: number;
  title: string;
  value: number;
  change: string;
  icon: 'Users' | 'Calendar' | 'Award';
  color: string;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(err => console.error(err));

    fetch('http://localhost:4000/api/admin/dashboard/activities')
      .then(res => res.json())
      .then(data => setRecentActivities(data.activities))
      .catch(err => console.error(err));
  }, []);

  // Mapear string de icono a componente real
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'Calendar': return Calendar;
      case 'Award': return Award;
      default: return Users;
    }
  };

  // Render dinámico de secciones según Quick Action
  const renderSection = () => {
    if (activeSection === 'students') {
      const GestionEstudiantes = React.lazy(() => import('./Admin/Gestion_Estudiantes'));
      return (
        <Suspense fallback={<div>Cargando sección de Estudiantes...</div>}>
          <GestionEstudiantes />
        </Suspense>
      );
    }

    if (activeSection === 'activities') {
      const NuevaActividad = React.lazy(() => import('./Admin/Gestion_Actividades'));
      return (
        <Suspense fallback={<div>Cargando sección de Actividades...</div>}>
          <NuevaActividad />
        </Suspense>
      );
    }

    if (activeSection === 'scholarships') {
      const RevisarBecas = React.lazy(() => import('./Admin/Gestion_Becas'));
      return (
        <Suspense fallback={<div>Cargando sección de Becas...</div>}>
          <RevisarBecas />
        </Suspense>
      );
    }

    return null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema de bienestar estudiantil</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = getIconComponent(stat.icon);
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group"
            onClick={() => setActiveSection('students')}
          >
            <Users className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Registrar Estudiante</p>
          </button>
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group"
            onClick={() => setActiveSection('activities')}
          >
            <Calendar className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Nueva Actividad</p>
          </button>
          <button
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group"
            onClick={() => setActiveSection('scholarships')}
          >
            <Award className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Revisar Becas</p>
          </button>
        </div>
      </div>

      {/* Sección dinámica */}
      <div>{renderSection()}</div>
    </div>
  );
}
