import React from 'react';
import { Calendar, Clock, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const todayAppointments = [
  {
    id: 1,
    time: '09:00',
    student: 'Ana García',
    matricula: '2021001',
    reason: 'Control general',
    status: 'confirmed',
  },
  {
    id: 2,
    time: '10:00',
    student: 'Carlos Mendoza',
    matricula: '2020045',
    reason: 'Dolor de cabeza recurrente',
    status: 'pending',
  },
  {
    id: 3,
    time: '11:30',
    student: 'María López',
    matricula: '2021078',
    reason: 'Certificado médico',
    status: 'confirmed',
  },
  {
    id: 4,
    time: '14:00',
    student: 'Pedro Ramírez',
    matricula: '2019023',
    reason: 'Seguimiento tratamiento',
    status: 'confirmed',
  },
];

const stats = [
  {
    id: 1,
    title: 'Citas Hoy',
    value: '8',
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Pacientes Atendidos',
    value: '6',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Citas Pendientes',
    value: '2',
    icon: Clock,
    color: 'bg-yellow-500',
  },
  {
    id: 4,
    title: 'Historiales Actualizados',
    value: '5',
    icon: FileText,
    color: 'bg-purple-500',
  },
];

export default function DoctorDashboard() {
  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Médico</h1>
        <p className="text-gray-600 mt-2">Gestión de citas y atención médica estudiantil</p>
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
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Citas de Hoy</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{currentTime}</span>
            </div>
          </div>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-teal-600">{appointment.time}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.student}</h3>
                    <p className="text-sm text-gray-500">Matrícula: {appointment.matricula}</p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {appointment.status === 'confirmed' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmada
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pendiente
                    </span>
                  )}
                  <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                    Ver Historial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="space-y-4">
            <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Programar Cita</p>
                  <p className="text-sm text-gray-500">Nueva cita médica</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Historial Clínico</p>
                  <p className="text-sm text-gray-500">Consultar expedientes</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pacientes del Día</p>
                  <p className="text-sm text-gray-500">Lista completa</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Cita completada con Ana García - Control general</p>
              <p className="text-xs text-gray-500">hace 30 minutos</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Historial clínico actualizado para Carlos Mendoza</p>
              <p className="text-xs text-gray-500">hace 1 hora</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Nueva cita programada para María López</p>
              <p className="text-xs text-gray-500">hace 2 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}