import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';

export default function AdminLayout() {
    const { user } = useAuth();
    const role = user?.admin?.role ?? user?.role;
    const { pathname } = useLocation();

    const marcoPropio = pathname.startsWith('/admin/productos');
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        {!marcoPropio && <Sidebar role={role} />}
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
    );
}
