import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import {BarrasCategoria, DonaStock} from '../components/Graficos.jsx';

export default function Reportes() {
  const { theme } = useTheme();
  const oscuro = theme === 'dark';
  const [totales, setTotales] = useState(null);
  const [porCategoria, setPorCategoria] = useState([]);
  const [bajoStock, setBajoStock] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [rep, prods] = await Promise.all([
          api.get('/api/admin/reportes'),
          api.get('/api/products', { params: { limit: 50 } }),
        ]);
        setTotales(rep.data.data);
        const lista = prods.data.data.products;
        const mapa = {};
        lista.forEach((p) => { mapa[p.category] = (mapa[p.category] || 0) + 1; });
        setPorCategoria(Object.entries(mapa).map(([categoria, cantidad]) => ({ categoria, cantidad })));
        setBajoStock(lista.filter((p) => p.stock <= 5));
      } catch (err) {
        setError(err.response?.data?.mensaje || 'Error al cargar reportes');
      }
    };
    cargar();
  }, []);

  if (error) return <p className="p-6 text-center font-semibold text-red-700">{error}</p>;
  if (!totales) return <p className="p-6 text-center text-sm">La liebre está sumando…</p>;

  const sanos = totales.totalProductos - bajoStock.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">Auditoría · solo lectura</p>
      <h1 className="mt-1 text-3xl font-black uppercase">Informe de la madriguera</h1>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[['Clientes', totales.totalClientes], ['Equipo', totales.totalAdmins], ['Productos', totales.totalProductos]].map(([e, v]) => (
          <div key={e} className="rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">{e}</p>
            <p className="precio mt-1 text-3xl text-mp-fuerte">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="font-bold">Productos por categoría</h2>
          <BarrasCategoria datos={porCategoria} oscuro={oscuro} />
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="font-bold">Salud del stock</h2>
          <DonaStock ok={sanos} bajo={bajoStock.length} oscuro={oscuro} />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="font-bold">Alertas de stock bajo (≤ 5)</h2>
        {bajoStock.length === 0 ? (
          <p className="mt-2 text-sm opacity-70">Todo corriendo con stock sano.</p>
        ) : (
          <ul className="mt-2 divide-y text-sm">
            {bajoStock.map((p) => (
              <li key={p.id} className="flex justify-between py-2">
                <span>{p.name} <span className="opacity-50">· {p.category}</span></span>
                <strong>{p.stock} u.</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-xs opacity-60">Informe agregado de auditoría: conteos y stock, sin datos personales.</p>
    </div>
  );
}
