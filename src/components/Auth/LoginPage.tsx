import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, Linkedin, Youtube, Instagram, User, Stethoscope, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    failedAttempts: 0,
    success: false,
    message: '',
    role: '',
    id: '',
    createdAt: '',
    lastLogin: '',
    status: '',
    attempts: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'doctor' | 'student'>('student');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState<number | null>(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password, selectedRole);
    if (!result.success) {
      setError('Credenciales incorrectas');
      if (typeof result.failedAttempts === 'number') {
        setFailedAttempts(result.failedAttempts);
      }
    } else {
      setFailedAttempts(result.failedAttempts ?? 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const getDemoCredentials = () => {
    switch (selectedRole) {
      case 'admin':
        return { email: 'admin1', password: 'admin123' };
      case 'doctor':
        return { email: 'medico1', password: 'medico123' };
      case 'student':
        return { email: 'estudiante1', password: 'estudiante123' };
      default:
        return { email: '', password: '' };
    }
  };

  const fillDemoCredentials = () => {
    const credentials = getDemoCredentials();
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-teal-100 to-blue-200">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-6xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Section */}
              <div className="lg:w-1/2 p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      Bienvenidos a:
                    </h1>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">
                      Bienestar Estudiantil
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Sistema de Información Integral
                    </p>
                  </div>

                  {/* Medical Logo */}
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection Buttons */}
                  <div className="flex space-x-3 mb-8">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        selectedRole === 'student'
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2" /> Estudiante
                      </div>
                    </button>
                    <button
                      
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        selectedRole === 'admin'
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" /> Administrativo
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('doctor')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        selectedRole === 'doctor'
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                      <Stethoscope className="w-4 h-4 mr-2" /> Médico
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contáctanos</h3>
                  <div className="flex space-x-4">
                    <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
                    <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-700 cursor-pointer transition-colors" />
                    <Youtube className="w-6 h-6 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" />
                    <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>

              {/* Right Section - Login Form */}
              <div className="lg:w-1/2 bg-white/90 p-12 flex items-center justify-center">
              {/* Login Form */}
                <div className="w-full max-w-md">
                  {/* Mostrar el rol seleccionado */}
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-teal-100 text-teal-800">
                      Usted esta ingresando como:
                      { ' ' + selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                    </span>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email.replace(/@.*/, '')}
                      onChange={e => {
                        // Solo permitir el nombre de usuario sin dominio
                        const value = e.target.value.replace(/@.*/, '');
                        setFormData(prev => ({ ...prev, email: value }));
                        if (error) setError('');
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder="Ej: admin1, medico1, estudiante1"
                      autoComplete="username"
                      required
                    />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    {typeof failedAttempts === 'number' && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                        Intentos fallidos: {failedAttempts}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>

                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Usar credenciales de demo
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}