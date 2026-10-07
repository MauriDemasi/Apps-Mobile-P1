import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ClientRoute({ children }) {
  const { token, userType, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white flex h-screen items-center justify-center bg-profundo">La liebre está verificando tu sesión...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== 'client') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
