import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginClient, user, userType, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginClient(email, password);
      navigate('/cliente/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
  return <p className="p-6 text-center text-sm">Verificando sesión…</p>;
}

if (user && userType !== 'client') {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Sesión en conflicto</p>
        <p className="mt-2 font-semibold">Ya posee una sesión de Administración activa. Para ingresar a su cuenta de Cliente, debe cerrar su sesión actual.</p>
        <button
          onClick={async () => { await logout(); }}
          className="btn-liebre mt-4 px-4 py-2 text-sm"
        >
          Cerrar sesión de Administración y continuar
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-10">
      <div className="grid w-full overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-[1fr_1.2fr]">
        <div className="bg-liebre text-profundo p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Puerta clientes</p>
          <p className="mt-3 text-3xl font-black uppercase leading-none">La liebre te conoce por tu nombre.</p>
          <p className="mt-3 text-sm font-medium">
            Entrá y mirá tu perfil. Si trabajás acá, la trastienda queda en la otra puerta.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 md:p-8">
          <h1 className="text-center text-xl font-black uppercase">Entrá a tu cuenta</h1>
          <div>
            <label htmlFor="email-cliente" className="mb-1 block text-sm font-semibold">Email</label>
            <input
              id="email-cliente"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-ml w-full px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="pass-cliente" className="mb-1 block text-sm font-semibold">Contraseña</label>
            <input
              id="pass-cliente"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-ml w-full px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="btn-liebre w-full px-4 py-2.5 text-sm">
            {loading ? 'Corriendo…' : 'Entrar'}
          </button>
          <p className="text-center text-sm opacity-70">
            ¿Sos del equipo?{' '}
            <Link to="/admin/login" className="font-semibold underline underline-offset-4">
              Entrá por la trastienda
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
