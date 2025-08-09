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

    // For other sections, show a placeholder for now
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