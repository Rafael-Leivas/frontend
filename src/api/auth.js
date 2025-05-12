  
  export const removeToken = () => {
    localStorage.removeItem('authToken');
  };
  

  // src/api/auth.js

// Armazenamento do Token e Role
export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const setUserRole = (role) => {
    localStorage.setItem('userRole', role);
  };
  
  export const getUserRole = () => {
    return localStorage.getItem('userRole');
  };
  
  export const removeAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // Verifica se o usuário atual tem role específica
  export const hasRole = (requiredRole) => {
    const role = getUserRole();
    return role === requiredRole;
  };