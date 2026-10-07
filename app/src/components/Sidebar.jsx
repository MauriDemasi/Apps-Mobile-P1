import { Link } from 'react-router-dom';

export default function Sidebar({ role }) {
  const link = 'rounded-md px-3 py-2 text-sm font-semibold link-barra hover:bg-mp/15 focus-visible:outline-2 focus-visible:outline-profundo';
  return (
    <nav aria-label="Trastienda" className="shrink-0 rounded-lg bg-white p-3 shadow-sm md:w-52">
      <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">
        Trastienda{role ? ` · ${role}` : ''}
      </p>
      <div className="flex flex-row flex-wrap gap-1 md:flex-col">
        <Link to="/admin/dashboard" className={link}>Panel</Link>
        {(role === 'superadmin') && (<Link to="/admin/usuarios" className={link}>Usuarios</Link>)}
        {(role === 'gestor_productos' || role === 'superadmin') && (<Link to="/admin/productos" className={link}>Productos</Link>)}
        {(role === 'auditor' || role === 'superadmin') && (<Link to="/admin/reportes" className={link}>Reportes</Link>)}
      </div>
    </nav>
  );
}
