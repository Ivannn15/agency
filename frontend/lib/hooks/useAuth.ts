'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../apiClient';

export type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  agencyId?: string | null;
  clientId?: string | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('agencyroom_token') : null;
    const user = token && typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('agencyroom_user') || 'null') : null;
    setState({ user, token });
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('agencyroom_token', data.token);
    localStorage.setItem('agencyroom_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token });
  };

  const registerAgency = async (payload: { agencyName: string; fullName: string; email: string; password: string }) => {
    const data = await apiFetch('/auth/register-agency', { method: 'POST', body: payload });
    localStorage.setItem('agencyroom_token', data.token);
    localStorage.setItem('agencyroom_user', JSON.stringify(data.user));
    setState({ user: data.user, token: data.token });
  };

  const logout = () => {
    localStorage.removeItem('agencyroom_token');
    localStorage.removeItem('agencyroom_user');
    setState({ user: null, token: null });
  };

  return { ...state, loading, login, logout, registerAgency };
}
