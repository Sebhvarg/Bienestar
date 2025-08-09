import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico General';
      case 'student':
        return 'Estudiante';
      default:
        return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-teal-600">
            {user.name}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{getRoleLabel(user.role)}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}