import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminRoleGuard({ children, allowedRoles }) {
  const { token, user, isLoading } = useAuth();
  const role = user?.admin?.role ?? user?.role;

  if (isLoading) {
    return <div className="text-white flex h-screen items-center justify-center bg-profundo">Verificando tu rol en la trastienda...</div>;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/admin/sin-permiso" replace />;
  }

  return children;
}
