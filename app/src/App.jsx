import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext.jsx';
import { useTheme } from './context/ThemeContext.jsx';
import ClientRoute from './components/Routes/ClientRoute.jsx';
import AdminRoute from './components/Routes/AdminRoute.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRoleGuard from './components/Routes/AdminRoleGuard.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import ClienteDashboard from './pages/ClienteDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import ClienteLogin from './pages/ClientLogin.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Footer from './components/Footer.jsx';
import Reportes from './pages/Reportes.jsx';
import Usuarios from './pages/Usuarios.jsx';

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <img
        src="/assets/logo-liebre.png"
        alt="Mercado Liebre"
        className="h-9 w-9 rounded-lg bg-white object-cover shadow-sm"
      />
      <span className="marca text-lg leading-none">
        Mercado
        <br />
        Liebre
        <small>Lo mejor está corriendo</small>
      </span>
    </Link>
  );
}

function ThemeToggle({ compacto = false }) {
  const { theme, toggleTheme } = useTheme();
  const oscuro = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-pressed={oscuro}
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo madriguera'}
      title={oscuro ? 'Modo claro' : 'Modo madriguera'}
      className={compacto ? 'btn-primario px-2.5 py-1.5 text-sm' : 'btn-primario px-3 py-1.5 text-sm'}
    >
      {oscuro ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}

function Navbar() {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);

  const buscar = (e) => {
    e.preventDefault();
    navigate(`/productos?search=${encodeURIComponent(texto.trim())}`);
  };

  const salir = () => {
    logout();
    navigate('/', { replace: true });
  };

  const esAdmin = userType === "admin";

  return (
    <header className={` ${esAdmin ? "bg-mp text-white shadow-md" : "bg-liebre text-profundo shadow-md"}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compacto />
            <button onClick={() => setMenuAbierto((v) => !v)} aria-expanded={menuAbierto} aria-label="Abrir menú" className="btn-primario px-2.5 py-1.5 text-sm md:hidden">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
            {user ? (
              <button onClick={salir} className="btn-primario px-3 py-1.5 text-sm">
                Salir
              </button>
            ) : (
              <Link to="/login" className="btn-primario px-3 py-1.5 text-sm">
                Ingresá
              </Link>
            )}
          </div>
        </div>

        {!esAdmin && (
          <form onSubmit={buscar} className="flex w-full flex-1 gap-2" role="search">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Buscar zapatillas, patitos de goma, pelotas…"
              aria-label="Buscar productos"
              className="input-ml w-full px-4 py-2 text-sm"
            />
            <button type="submit" aria-label="Buscar" className="btn-primario shrink-0 px-4 py-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
          </form>)}

        <div className="hidden items-center gap-3 text-sm md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <span className="bg-profundo rounded-full px-3 py-1 font-semibold text-white">
                {user.nombre || user.admin?.nombre || 'Cuenta'} · {userType === 'admin' ? 'Trastienda' : 'Cliente'}
              </span>
              <button onClick={salir} className="btn-primario px-4 py-1.5">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold underline underline-offset-4">
                Ingresá
              </Link>
              <Link to="/admin/login" className="btn-primario px-4 py-1.5">
                Trastienda
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-white/25 hidden md:block">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 text-sm font-medium">
          <Link to="/" className="hover:underline underline-offset-4">Inicio</Link>
          {!esAdmin && (
            <Link to="/productos" className="hover:underline underline-offset-4">Ofertas</Link>)}
          {!esAdmin && (
            <Link
              to={userType === 'client' ? '/cliente/dashboard' : '/login'}
              className="hover:underline underline-offset-4"
            >
              Mi cuenta
            </Link>)}
          {esAdmin && (
            <Link
              to={userType === 'admin' ? '/admin/dashboard' : '/admin/login'}
              className="hover:underline underline-offset-4"
            >
              Trastienda
            </Link>
          )}
        </div>
      </nav>
      {}
      {menuAbierto && (
        <nav className="border-t border-white/25 md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3 text-sm font-medium">
            <Link to="/" className="hover:underline underline-offset-4" onClick={() => setMenuAbierto(false)}>Inicio</Link>
            {!esAdmin && (
              <Link to="/productos" className="hover:underline underline-offset-4" onClick={() => setMenuAbierto(false)}>Ofertas</Link>)}
            {!esAdmin && (
              <Link
                to={userType === 'client' ? '/cliente/dashboard' : '/login'}
                className="hover:underline underline-offset-4"
                onClick={() => setMenuAbierto(false)}
              >
                Mi cuenta
              </Link>)}
            {esAdmin && (
              <Link
                to={userType === 'admin' ? '/admin/dashboard' : '/admin/login'}
                className="hover:underline underline-offset-4"
                onClick={() => setMenuAbierto(false)}
              >
                Trastienda
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<ClienteLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/cliente/dashboard" element={<ClientRoute><ClienteDashboard /></ClientRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>} >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="usuarios" element={<AdminRoleGuard allowedRoles={['superadmin']}><Usuarios /></AdminRoleGuard>} />
        <Route path="productos" element={<AdminRoleGuard allowedRoles={['superadmin', 'gestor_productos']}><Products gestion /></AdminRoleGuard>} />

        <Route path="reportes" element={<AdminRoleGuard allowedRoles={['superadmin', 'auditor']}><Reportes /></AdminRoleGuard>} />

        <Route path="sin-permiso" element={
          <div className="mx-auto max-w-md p-6 text-center">
            <p className="text-lg font-bold">Sin permiso</p>
            <p className="mt-1 text-sm opacity-70">Esa madriguera es solo para otros roles. La liebre te devuelve a tu pista.</p>
          </div>} />
      </Route>
      <Route path="*" element={
        <div className="mx-auto w-full max-w-md px-4 py-10 text-center">
          <img
            src="/assets/vacio-liebre.png"
            alt="Madriguera vacía"
            className="mx-auto w-full max-w-xs rounded-lg"
          />
          <p className="mt-3 text-xl font-black uppercase">Esa madriguera no existe (404)</p>
          <p className="mt-1 text-sm opacity-70">La liebre ya se llevó esa página a otra cueva.</p>
          <Link to="/" className="btn-primario mt-4 inline-block px-4 py-2 text-sm">
            Volver al inicio
          </Link>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
