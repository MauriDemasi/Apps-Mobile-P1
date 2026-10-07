import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin,user,userType,logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
  return <p className="p-6 text-center text-sm">Verificando sesión…</p>;
}

if (user && userType !== 'admin') {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Sesión en conflicto</p>
        <p className="mt-2 font-semibold">Ya posee una sesión de Cliente activa. Para ingresar al panel de Administración, debe cerrar su sesión actual.</p>
        <button
          onClick={async () => { await logout(); }}
          className="btn-mp mt-4 px-4 py-2 text-sm"
        >
          Cerrar sesión de Cliente y continuar
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-[1fr_1.2fr]">
        <div className="bg-mp m-0 p-6 text-white md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Puerta trastienda</p>
          <p className="mt-3 text-3xl font-black uppercase leading-none">Tu plata, tus reglas.</p>
          <p className="mt-3 text-sm font-medium opacity-90">
            Solo personal autorizado. Si tenés cuenta de cliente abierta, cerrala antes de seguir.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-8">
          <h1 className="text-center text-xl font-black uppercase">Entrá al panel</h1>
          <div>
            <label htmlFor="email-admin" className="mb-1 block text-sm font-semibold">Email del equipo</label>
            <input
              id="email-admin"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-ml w-full px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="pass-admin" className="mb-1 block text-sm font-semibold">Contraseña</label>
            <input
              id="pass-admin"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-ml w-full px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-mp w-full px-4 py-2.5 text-sm">
            {loading ? 'Verificando…' : 'Entrar a la trastienda'}
          </button>
          <p className="text-center text-sm opacity-70">
            <Link to="/" className="font-semibold underline underline-offset-4">
              Volver al inicio
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
