import { useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, checkAuth } from '../api/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      setLoading(true);
      checkAuth()
        .then((data) => {
          setUser(data.empresa);
          localStorage.setItem("user", JSON.stringify(data.empresa));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      const empresa = data.data?.empresa;
      const token = data.data?.token;
      setUser(empresa);
      localStorage.setItem("user", JSON.stringify(empresa));
      localStorage.setItem("token", token);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return { user, loading, error, login, logout };
};