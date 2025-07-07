import { useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") return null;
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  // Removida a verificação checkAuth() - agora apenas mantém os dados salvos no localStorage
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  const savedRole = localStorage.getItem("userRole");
  
  if (token && savedUser && savedRole && !user) {
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch {
      // Se houver erro ao parsear, limpa os dados
      logout();
    }
  }
}, [user]);


  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      const tipoUsuario = data.data?.tipoUsuario;
      const token = data.data?.token;
      
      // Trata tanto empresa quanto colaborador
      const userData = tipoUsuario === 'empresa' ? data.data?.empresa : data.data?.colaborador;
      
      // Salva também o ID do usuário separadamente para facilitar acesso
      const userId = userData?.id;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", tipoUsuario);

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
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  const getUserId = () => {
    return localStorage.getItem("userId") || user?.id;
  };

  return { user, loading, error, login, logout, getUserId };
};
