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
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const hasRole = (requiredRole) => {
  const role = getUserRole();
  return role === requiredRole;
};
