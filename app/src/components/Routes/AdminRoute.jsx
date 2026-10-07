import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { token, userType, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white flex h-screen items-center justify-center bg-profundo">Verificando credenciales del equipo...</div>;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userType !== 'admin') {
    return <Navigate to="/cliente/dashboard" replace />;
  }

  return children;
}
