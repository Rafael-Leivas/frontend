import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../api/auth'; // Ajuste o caminho conforme sua estrutura

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica a autenticação quando o componente é montado ou a rota muda
    if (!isAuthenticated()) {
      navigate('/login', { 
        replace: true,
        state: { 
          from: window.location.pathname,
          message: 'Por favor, faça login para acessar esta página' 
        }
      });
    }
  }, [navigate]);

  // Renderiza os children apenas se autenticado
  return isAuthenticated() ? children : null;
};

export default ProtectedRoute;