import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

// Shape of the auth context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook to access auth context
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}

// Wraps the entire app and provides auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user using the auth cookie (called on app load)
  async function fetchMe() {
    try {
      // GET /api/v1/users/me/ — returns UserReadSerializer data
      const res = await api.get('/users/me/');
      setUser(res.data.data);
    } catch {
      // Not authenticated — clear user
      setUser(null);
    }
  }

  // Login — backend sets httpOnly cookies on success
  async function login(email: string, password: string) {
    // POST /api/v1/users/login/
    await api.post('/users/login/', { email, password });
    // Fetch user data after successful login
    await fetchMe();
  }

  // Logout — backend clears cookies
  async function logout() {
    try {
      // POST /api/v1/users/logout/
      await api.post('/users/logout/');
    } finally {
      setUser(null);
    }
  }

  // Check auth state when app first loads
  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}
