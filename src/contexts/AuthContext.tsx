import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface LoginResult {
  success: boolean;
  message?: string;
  failedAttempts?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'doctor' | 'student') => Promise<LoginResult>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Nota: el login ahora se realiza vía API; dejamos esta estructura como referencia.

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: 'admin' | 'doctor' | 'student'
  ): Promise<LoginResult> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: (email && email.includes('@')) ? email.split('@')[0] : email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setLoading(false);
        return { success: false, message: errorData.message || 'Error de autenticación', failedAttempts: errorData.failedAttempts };
      }

      const data = await response.json();
      const apiUser: User = {
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        createdAt: new Date(data.user.createdAt),
      };

      setUser(apiUser);
      localStorage.setItem('user', JSON.stringify(apiUser));
      setLoading(false);
      return { success: true, failedAttempts: data.failedAttempts };
    } catch (err) {
      setLoading(false);
      return { success: false, message: 'Error de red' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}