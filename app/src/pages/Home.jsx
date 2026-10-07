import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, userType, logout } = useAuth();
  const nombre = user?.nombre || user?.admin?.nombre || 'Cuenta';

  return (
    <div>
      <section className="bg-liebre text-profundo">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:py-14">
          <div className="order-2 flex-1 md:order-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Mercado Liebre · Envíos que corren</p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-[0.95] md:text-6xl">
              Lo mejor está corriendo
            </h1>
            <p className="mt-3 max-w-md text-sm font-medium md:text-base">
              Comprá veloz como una liebre: ofertas, patitos de goma y pelotas con entrega saltarina.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/productos" className="btn-primario px-5 py-2.5 text-sm">
                Ver ofertas
              </Link>
              {!user && (
                <Link to="/login" className="rounded-lg bg-white/70 px-5 py-2.5 text-sm font-bold hover:bg-white">
                  Entrar a mi cuenta
                </Link>
              )}
            </div>
          </div>
          <div className="order-1 w-full max-w-xs self-center overflow-hidden rounded-2xl bg-white shadow-lg md:order-2 md:max-w-sm">
            <img
              src="/assets/apreton-liebre.png"
              alt="Apretón de patas de Mercado Liebre"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <h2 className="text-xl font-black uppercase">Categorías destacadas</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Electronica', 'Lo que corre con cables'],
            ['Ropa', 'Para correr con estilo'],
            ['Juguetes', 'Para liebres chicas'],
            ['Accesorios Dev', 'Para programar saltando'],
          ].map(([cat, bajada]) => (
            <Link
              key={cat}
              to={`/productos?category=${encodeURIComponent(cat)}`}
              className="rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-105"
            >
              <p className="text-lg font-black uppercase">{cat}</p>
              <p className="mt-1 text-sm opacity-70">{bajada}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-2">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-sm md:flex-row md:gap-8">
          <img
            src="/assets/logo-liebre.png"
            alt="Mascota orejuda de Mercado Liebre"
            className="h-24 w-24 shrink-0 rounded-full object-cover shadow-sm"
          />
          <ul className="grid w-full gap-4 text-sm sm:grid-cols-3">
            {[
              ['Paga tranquilo', 'Tu dinero viaja más rápido que la liebre.'],
              ['Envío que corre', 'Saltando hacia tu casa sin escalas.'],
              ['Compra protegida', 'Si algo falla, te devolvemos cada salto.'],
            ].map(([titulo, bajada]) => (
              <li key={titulo}>
                <p className="font-black uppercase">{titulo}</p>
                <p className="mt-1 opacity-70">{bajada}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        {user ? (
          <div className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-60">
              {userType === 'admin' ? 'Trastienda' : 'Mi cuenta'}
            </p>
            <p className="mt-2 text-xl font-bold">Hola de nuevo, {nombre}. La madriguera te extrañaba.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                to={userType === 'admin' ? '/admin/dashboard' : '/cliente/dashboard'}
                className="btn-primario px-4 py-2 text-sm"
              >
                Ir a mi panel
              </Link>
              <button onClick={logout} className="rounded-lg border border-profundo/25 px-4 py-2 text-sm font-semibold">
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/login" className="rounded-lg bg-white p-6 shadow-sm transition-all hover:scale-[1.01]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Puerta clientes</p>
              <p className="mt-2 text-2xl font-black uppercase">Entrá a tu cuenta</p>
              <p className="mt-1 text-sm opacity-70">Tu perfil, tus pedidos y tus ofertas corriendo hacia vos.</p>
              <span className="btn-liebre mt-4 inline-block px-4 py-2 text-sm">Entrar como cliente →</span>
            </Link>
            <Link to="/admin/login" className="bg-profundo rounded-lg p-6 text-white shadow-sm transition-all hover:scale-[1.01]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Puerta trastienda</p>
              <p className="mt-2 text-2xl font-black uppercase">Solo personal</p>
              <p className="mt-1 text-sm opacity-70">Métricas y gestión. Si sos cliente, cerrá tu sesión primero.</p>
              <span className="btn-liebre mt-4 inline-block px-4 py-2 text-sm">Entrar al panel →</span>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
