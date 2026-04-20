import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { User } from '../types';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => ({ ok: false }),
  logout: () => { },
  refresh: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/me/');
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.post('/users/login/', { email, password });
      await refresh();
      return { ok: true };
    } catch (e: any) {
      return { ok: false, msg: e.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try { await api.post('/users/logout/'); } catch { }
    setUser(null);
    navigate('/login');
  };

  return <Ctx.Provider value={{ user, loading, login, logout, refresh }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
