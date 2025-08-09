import React from 'react';
import { Users, Calendar, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Estudiantes Registrados',
    value: '1,247',
    change: '+12%',
    changeType: 'increase',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Actividades Activas',
    value: '34',
    change: '+3',
    changeType: 'increase',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Becas Aprobadas',
    value: '89',
    change: '+7',
    changeType: 'increase',
    icon: Award,
    color: 'bg-purple-500',
  },
  {
    id: 4,
    title: 'Citas Médicas Hoy',
    value: '23',
    change: '+2',
    changeType: 'increase',
    icon: Clock,
    color: 'bg-orange-500',
  },
];

const recentActivities = [
  { id: 1, type: 'enrollment', description: 'Juan Pérez se inscribió en Fútbol Universitario', time: '2 min' },
  { id: 2, type: 'scholarship', description: 'Nueva solicitud de beca académica de María González', time: '5 min' },
  { id: 3, type: 'appointment', description: 'Cita médica confirmada para Carlos Rodríguez', time: '10 min' },
  { id: 4, type: 'activity', description: 'Nueva actividad "Taller de Liderazgo" creada', time: '15 min' },
];

const pendingTasks = [
  { id: 1, task: 'Revisar solicitudes de becas pendientes', priority: 'high', count: 12 },
  { id: 2, task: 'Aprobar nuevas actividades culturales', priority: 'medium', count: 3 },
  { id: 3, task: 'Validar certificados de participación', priority: 'low', count: 8 },
  { id: 4, task: 'Generar reporte mensual de actividades', priority: 'high', count: 1 },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema de bienestar estudiantil</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Actividades Recientes</h2>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              Ver todo
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">hace {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tareas Pendientes</h2>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{task.task}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.count} pendientes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Users className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Registrar Estudiante</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Calendar className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Nueva Actividad</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition-colors group">
            <Award className="w-8 h-8 text-gray-400 group-hover:text-teal-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-teal-700">Revisar Becas</p>
          </button>
        </div>
      </div>
    </div>
  );
}