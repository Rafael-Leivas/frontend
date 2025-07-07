// src/api/auth.js

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
};

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const removeAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const hasRole = (requiredRole) => {
  const role = getUserRole();
  return role === requiredRole;
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const getUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined') return null;
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};
