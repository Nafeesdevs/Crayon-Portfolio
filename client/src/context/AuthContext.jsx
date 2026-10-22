import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('pf_token')) return setReady(true);
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem('pf_token'))
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('pf_token', data.token);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('pf_token');
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
