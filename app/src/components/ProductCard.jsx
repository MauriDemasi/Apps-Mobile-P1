import { useAuth } from '../context/AuthContext.jsx';

export const ENVIO_GRATIS_DESDE = 100;

export const partesPrecio = (price) => {
  const [entero, dec = '00'] = String(Number(price).toFixed(2)).split('.');
  return { entero: Number(entero).toLocaleString('es-AR'), dec };
};

function Corazon({ activo }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={activo ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activo ? '' : 'opacity-60'}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function Camion() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

export function useRolGestion() {
  const { user, userType } = useAuth();
  const role = user?.admin?.role ?? user?.role;
  return {
    role,
    userType,
    gestiona: role === 'superadmin' || role === 'gestor_productos',
    borra: role === 'superadmin',
  };
}

export default function ProductCard({ p, esFav, onFav, onComprar, modoCompra, puedeGestionar, puedeBorrar, onEditar, onBorrar }) {
  const { entero, dec } = partesPrecio(p.price);
  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-black/10 bg-white transition-all duration-200 hover:scale-105 hover:shadow-xl">
      <div className="relative flex aspect-square items-center justify-center bg-white">
          {Number(p.price) < 100 && (
            <span className="bg-liebre absolute left-2 top-2 z-10 rounded px-2 py-0.5 text-xs font-black uppercase text-profundo">
              Oferta -10%
            </span>
          )}

          <span className="flex items-center justify-center text-7xl font-black uppercase text-profundo/10 select-none" aria-hidden="true">
            {p.name.charAt(0)}
          </span>
          <img
            src="/assets/hero-liebre.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full bg-white object-contain p-6"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          {modoCompra && (
            <button
              onClick={() => onFav(p.id)}
              aria-label={esFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              aria-pressed={esFav}
              className="absolute right-2 top-2 hidden rounded-full bg-white p-1.5 shadow-md group-hover:block"
            >
              <Corazon activo={esFav} />
            </button>
          )}
        </div>
        <div className="border-t border-fondo p-3">
          <p className="precio text-2xl">
            $ {entero}<span className="align-super text-xs font-bold">{dec}</span>
          </p>
          {Number(p.price) >= ENVIO_GRATIS_DESDE ? (
            <p className="text-envio mt-0.5 flex items-center gap-1 text-sm font-medium">
              <Camion /> Envío gratis
            </p>
          ) : (
            <p className="mt-0.5 text-sm opacity-60">
              {p.stock > 0 ? (p.stock <= 5 ? `¡Últimos ${p.stock}!` : `Stock: ${p.stock}`) : 'Sin stock'}
            </p>
          )}
          <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-normal text-black/70">{p.name}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide opacity-50">{p.category}</p>
          {modoCompra && (
            <button
              onClick={() => onComprar(p.name)}
              disabled={p.stock <= 0}
              className="btn-primario mt-2 w-full px-3 py-2 text-sm disabled:opacity-50"
            >
              Comprar
            </button>
          )
          }
          {puedeGestionar && (
            <button
              onClick={() => onEditar(p)}
              className="mt-1 w-full rounded-md border border-profundo/25 px-3 py-2 text-sm font-semibold"
            >
              Editar
            </button>
          )}
          {puedeBorrar && (
            <button
              onClick={() => onBorrar(p.id, p.name)}
              className="mt-1 w-full rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
            >
              Borrar
            </button>
          )}
        </div>
    </article>
  );
}
