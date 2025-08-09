import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import MainApp from './components/MainApp';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-teal-100 to-blue-200 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <span className="text-gray-700 font-medium">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;