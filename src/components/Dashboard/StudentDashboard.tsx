import React, { useEffect, useState } from 'react';
import { Calendar, Award, BookOpen, FileText, Clock, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    actividades: 0,
    asistencias: 0,
    certificados: 0,
    solicitudes: 0,
  });

  // Cargar datos desde el backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resActividades, resSolicitudes] = await Promise.all([
          fetch('http://localhost:4000/api/estudiante/actividades-inscritas'),
          fetch('http://localhost:4000/api/estudiante/solicitudes-beca')
        ]);

        const actividadesData = await resActividades.json();
        const solicitudesData = await resSolicitudes.json();

        setStats({
          actividades: actividadesData.length || 0,
          asistencias: 12, // Aquí puedes poner el valor real si lo tienes en otra API
          certificados: 3, // Igual aquí puedes hacer otro fetch si quieres
          solicitudes: solicitudesData.length || 0
        });
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      }
    };

    fetchData();
  }, []);

  const myStats = [
    {
      id: 1,
      title: 'Actividades Inscritas',
      value: stats.actividades,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Asistencias Registradas',
      value: stats.asistencias,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Certificados Disponibles',
      value: stats.certificados,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Solicitudes Pendientes',
      value: stats.solicitudes,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido a tu portal de bienestar estudiantil</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {myStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
