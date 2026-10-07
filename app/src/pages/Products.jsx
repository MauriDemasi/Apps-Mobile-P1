import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import ProductForm from '../components/ProductForm.jsx';
import ProductCard, { useRolGestion } from '../components/ProductCard.jsx';

const LIMIT = 4;

const ORDENES = {
  'precio-asc': { sortBy: 'price', order: 'ASC', etiqueta: 'Menor precio' },
  'precio-desc': { sortBy: 'price', order: 'DESC', etiqueta: 'Mayor precio' },
  nombre: { sortBy: 'name', order: 'ASC', etiqueta: 'Nombre A–Z' },
};

export default function Products({gestion = false}) {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [texto, setTexto] = useState(params.get('search') || '');
  const [q, setQ] = useState(params.get('search') || '');
  const [categoria, setCategoria] = useState(params.get('category') || '');

  const [categorias, setCategorias] = useState([]);
  const [orden, setOrden] = useState('precio-asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [bolsa, setBolsa] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');
  const [aviso, setAviso] = useState(null);

  const { role, userType, gestiona, borra } = useRolGestion();

  const puedeGestionar = gestion && gestiona;
  const puedeBorrar = gestion && borra;

  const modoCompra = !puedeGestionar && userType !== 'admin';
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { sortBy, order } = ORDENES[orden];
        const res = await api.get('/api/products', {
          params: {
            page,
            limit: LIMIT,
            ...(q ? { search: q } : {}),
            ...(categoria ? { category: categoria } : {}),
            sortBy,
            order,
          },
        });
        setProducts(res.data.data.products);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.mensaje || 'La liebre se tropezó: no pudimos traer el catálogo');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, q, categoria, orden]);

  useEffect(() => {
    api.get('/api/products/categorias')
      .then((res) => setCategorias(res.data.data.map((r) => r.category)))
      .catch(() => setCategorias([]));
  }, []);

  const buscar = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(texto.trim());
    setParams(texto.trim() ? { search: texto.trim() } : {});
  };

  const elegirCategoria = (c) => {
    setPage(1);
    setCategoria(c);
  };

  const fav = (id) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const limpiar = () => {
    setTexto(''); setQ(''); setCategoria(''); setPage(1); setParams({});
  };

  const crear = async (datos) => {
    setFormError('');
    setGuardando(true);
    try {
      const res = await api.post('/api/products', datos);
      setAviso(res.data.restaurado
        ? `“${datos.name}” revivido de la madriguera.`
        : `“${datos.name}” creado al galope.`);
      setMostrarForm(false);
      setPage(1);

      api.get('/api/products/categorias')
        .then((res) => setCategorias(res.data.data.map((r) => r.category)))
        .catch(() => {});
    } catch (err) {
      setFormError(err.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const guardarEdicion = async (datos) => {
    setFormError('');
    setGuardando(true);
    try {
      await api.put(`/api/products/${editando.id}`, datos);
      setAviso(`“${datos.name}” actualizado al trote`);
      setEditando(null);
      setPage(1);
    } catch (err) {
      setFormError(err.response?.data?.mensaje || 'La liebre se tropezó: no pudimos actualizar el producto');
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (id, name) => {
    if (!window.confirm(`¿Mandar “${name}” a la madriguera de borrados (lógico)?`)) return;
    try {
      await api.delete(`/api/products/${id}`);
      setAviso(`“${name}” borrado (lógico, se puede revivir).`);
      setPage(1);
    } catch (err) {
      setAviso(null);
      setError(err.response?.data?.mensaje || 'Error al borrar');
    }
  };

  return (
    <div className={gestion
      ? 'mx-auto w-full max-w-6xl rounded-xl bg-mp/10 p-4 md:p-6'
      : 'mx-auto w-full max-w-6xl px-4 py-4 md:py-6'}>
      {gestion ? (
        <div className="mb-4 rounded-lg border-l-4 border-mp bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">
            Trastienda · Gestión{role ? ` · ${role}` : ''}
          </p>
          <h1 className="mt-1 text-2xl font-black uppercase tracking-tight">Catálogo y stock</h1>
          <p className="mt-1 text-sm opacity-70">
            {total} {total === 1 ? 'producto' : 'productos'} · crear y editar: equipo · borrar: superadmin
          </p>
        </div>
      ) : (
        <p className="text-sm opacity-70">
          {q ? (
            <>Resultados para <strong>“{q}”</strong> · </>
          ) : null}
          {total} {total === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
      {(!gestion && userType === 'admin') && (
        <p className="mt-2 rounded-md bg-white px-4 py-2 text-sm shadow-sm">
          Mirando como equipo: acá no se compra. <Link to="/admin/productos" className="font-semibold text-mp-fuerte underline underline-offset-4">Ir a gestión</Link>
        </p>
      )}

      <form onSubmit={buscar} className="mt-2 flex gap-2 md:hidden">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar en Mercado Liebre…"
          aria-label="Buscar productos"
          className="input-ml w-full flex-1 px-4 py-2 text-sm"
        />
        <button type="submit" className="btn-primario shrink-0 px-4 py-2 text-sm">Buscar</button>
      </form>

      <div className="mt-3 flex flex-col gap-4 md:flex-row">
        <aside className="shrink-0 md:w-52">
          <div className="rounded-md bg-white p-4 shadow-sm">
            {gestion && (
              <>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">Trastienda</h2>
                <ul className="mt-2 space-y-1 text-sm font-semibold">
                  <li><Link to="/admin/dashboard" className="hover:underline underline-offset-4">Panel</Link></li>
                  {role === 'superadmin' && (
                    <li><Link to="/admin/usuarios" className="hover:underline underline-offset-4">Usuarios</Link></li>
                  )}
                  <li><Link to="/admin/productos" className="hover:underline underline-offset-4">Productos</Link></li>
                  {(role === 'auditor' || role === 'superadmin') && (
                    <li><Link to="/admin/reportes" className="hover:underline underline-offset-4">Reportes</Link></li>
                  )}
                </ul>
                <h2 className="mt-4 border-t border-fondo pt-3 text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">Filtros del catálogo</h2>
              </>
            )}
            {!gestion && <h2 className="text-sm font-bold">Categoría</h2>}
            <select
              value={categoria}
              onChange={(e) => elegirCategoria(e.target.value)}
              aria-label="Filtrar por categoría"
              className="input-ml mt-2 w-full px-2 py-2 text-sm"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <h2 className="mt-4 text-sm font-bold">Ordenar por</h2>
            <select value={orden} onChange={(e) => { setPage(1); setOrden(e.target.value); }} aria-label="Ordenar" className="input-ml mt-2 w-full px-2 py-2 text-sm">
              {Object.entries(ORDENES).map(([k, v]) => (
                <option key={k} value={k}>{v.etiqueta}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {(modoCompra && bolsa) && (
            <p className="bg-liebre mb-3 rounded-md px-4 py-2 text-sm font-semibold text-profundo">
              ¡A la bolsa! “{bolsa}” ya está saltando hacia tu casa.
            </p>
          )}

          {error && <p className="mb-3 rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-700">{error}</p>}
          {aviso && (
            <p className="bg-mp mb-3 rounded-md px-4 py-2 text-sm font-semibold text-white">
              {aviso}
            </p>
          )}
          {puedeGestionar && (
            <button
              onClick={() => { setMostrarForm((v) => !v); setFormError(''); }}
              className="btn-mp mb-3 px-4 py-2 text-sm"
            >
              {mostrarForm ? 'Cerrar' : '＋ Nuevo producto'}
            </button>
          )}
          {(puedeGestionar && mostrarForm) && (
            <div className="mb-3">
              <ProductForm
                onGuardar={crear}
                onCancelar={() => { setMostrarForm(false); setFormError(''); }}
                guardando={guardando}
                errorExterno={formError}
                categorias={categorias}
              />
            </div>
          )}
          {(puedeGestionar && editando) && (
            <div className="mb-3">
              <ProductForm
                key={editando.id}
                inicial={editando}
                onGuardar={guardarEdicion}
                onCancelar={() => {
                  setEditando(null);
                  setFormError(null);
                }}
                guardando={guardando}
                errorExterno={formError}
                categorias={categorias}
              />
            </div>
          )}
          {loading && products.length === 0 ? (
            <p className="py-10 text-center text-sm">La liebre está juntando los productos…</p>
          ) : products.length === 0 ? (
            <div className="rounded-md bg-white p-8 text-center shadow-sm">
              <img
                src="/assets/vacio-liebre.png"
                alt="Madriguera vacía"
                className="mx-auto w-full max-w-xs rounded-md"
              />
              <p className="mt-3 font-bold">Nada por acá… la liebre ya se lo llevó todo.</p>
              <button onClick={limpiar} className="btn-primario mt-3 px-4 py-2 text-sm">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  esFav={favoritos.includes(p.id)}
                  onFav={fav}
                  onComprar={setBolsa}
                  modoCompra={modoCompra}
                  puedeGestionar={puedeGestionar}
                  puedeBorrar={puedeBorrar}
                  onEditar={
                    (p) => {
                      setEditando(p);
                      setMostrarForm(false);
                    }
                  }
                  onBorrar={borrar}
                />

              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((n) => n - 1)}
              disabled={page <= 1 || loading}
              className="btn-primario px-4 py-2 text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm font-semibold">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage((n) => n + 1)}
              disabled={page >= totalPages || loading}
              className="btn-primario px-4 py-2 text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
