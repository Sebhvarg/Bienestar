import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Stethoscope,
  BookOpen,
  Award,
  FileText,
  Settings,
  LogOut,
  icons,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'admins', label: 'Administradores', icon: User},
    { id: 'students', label: 'Gestión de Estudiantes', icon: Users },
    { id: 'doctors', label: 'Gestión de Médicos', icon: Stethoscope },
    { id: 'activities', label: 'Gestión de Actividades', icon: Calendar },
    { id: 'scholarships', label: 'Becas y Servicios', icon: Award },
    { id: 'reports', label: 'Reportes y Estadísticas', icon: BarChart3 },
  ],
  doctor: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Citas Médicas', icon: Stethoscope },
    { id: 'patients', label: 'Historial Clínico', icon: FileText },
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'activities', label: 'Actividades', icon: Calendar },
    { id: 'scholarships', label: 'Becas y Servicios', icon: Award },
  ],
};

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Bienestar Politécnico</h2>
        <p className="text-sm text-gray-600 mt-1">Sistema Integral</p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}