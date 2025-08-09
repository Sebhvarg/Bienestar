import React from 'react';
import { Calendar, Award, BookOpen, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const upcomingActivities = [
  {
    id: 1,
    name: 'Fútbol Universitario',
    type: 'deportiva',
    date: 'Hoy 16:00',
    location: 'Cancha Principal',
    status: 'enrolled',
  },
  {
    id: 2,
    name: 'Taller de Liderazgo',
    type: 'academica',
    date: 'Mañana 10:00',
    location: 'Aula 205',
    status: 'enrolled',
  },
  {
    id: 3,
    name: 'Concierto Estudiantil',
    type: 'cultural',
    date: 'Viernes 19:00',
    location: 'Auditorio',
    status: 'available',
  },
];

const myStats = [
  {
    id: 1,
    title: 'Actividades Inscritas',
    value: '5',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Asistencias Registradas',
    value: '12',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Certificados Disponibles',
    value: '3',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    id: 4,
    title: 'Solicitudes Pendientes',
    value: '1',
    icon: Clock,
    color: 'bg-yellow-500',
  },
];

const notifications = [
  {
    id: 1,
    type: 'success',
    message: 'Tu solicitud de beca académica ha sido aprobada',
    time: 'hace 2 horas',
  },
  {
    id: 2,
    type: 'warning',
    message: 'Recuerda registrar tu asistencia al Taller de Liderazgo',
    time: 'hace 1 día',
  },
  {
    id: 3,
    type: 'info',
    message: 'Nuevas actividades culturales disponibles para inscripción',
    time: 'hace 2 días',
  },
];

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mis Próximas Actividades</h2>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {upcomingActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activity.type === 'deportiva' ? 'bg-blue-100' :
                    activity.type === 'academica' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'deportiva' ? (
                      <span className="text-blue-600 font-bold">D</span>
                    ) : activity.type === 'academica' ? (
                      <BookOpen className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className="text-purple-600 font-bold">C</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-500">{activity.date} • {activity.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activity.status === 'enrolled' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Inscrito
                    </span>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors">
                      Inscribirse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notificaciones</h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Calendar className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Buscar Actividades</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Award className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Solicitar Beca</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Mis Certificados</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Clock className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Cita Médica</p>
          </button>
        </div>
      </div>
    </div>
  );
}