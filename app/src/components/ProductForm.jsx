import { useState } from 'react';

export default function ProductForm({ inicial, onGuardar, onCancelar, guardando, errorExterno, categorias = [] }) {
  const [name, setName] = useState(inicial?.name ?? '');
  const [price, setPrice] = useState(inicial?.price ?? '');
  const [stock, setStock] = useState(inicial?.stock ?? '');
  const [category, setCategory] = useState(inicial?.category ?? '');
  const [errorLocal, setErrorLocal] = useState('');

  const guardar = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    if (!String(name).trim()) {
      setErrorLocal('El nombre es obligatorio');
      return;
    }
    if (!String(category).trim()) {
      setErrorLocal('La categoría es obligatoria');
      return;
    }
    await onGuardar({
      name: String(name).trim(),
      price: Number(price),
      stock: Number(stock),
      category: String(category).trim(),
    });
  };

  const input = 'input-ml w-full px-3 py-2 text-sm';
  const label = 'mb-1 block text-sm font-semibold';

  return (
    <form onSubmit={guardar} className="rounded-lg border border-mp/30 bg-white p-4 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-mp-fuerte">
        {inicial ? 'Editar producto' : 'Nuevo producto'}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className={label}>Nombre</label>
          <input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} className={input} required />
        </div>
        <div>
          <label htmlFor="pf-category" className={label}>Categoría</label>
          <input id="pf-category" list="pf-cats" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej. Calzado" className={input} required />
          <datalist id="pf-cats">
            {categorias.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="pf-price" className={label}>Precio</label>
          <input id="pf-price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={input} required />
        </div>
        <div>
          <label htmlFor="pf-stock" className={label}>Stock</label>
          <input id="pf-stock" type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} className={input} required />
        </div>
      </div>
      {(errorLocal || errorExterno) && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {errorLocal || errorExterno}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={guardando} className="btn-mp px-4 py-2 text-sm disabled:opacity-50">
          {guardando ? 'Guardando…' : inicial ? 'Guardar cambios' : 'Crear al galope'}
        </button>
        <button type="button" onClick={onCancelar} className="rounded-lg border border-profundo/25 px-4 py-2 text-sm font-semibold">
          Cancelar
        </button>
      </div>
    </form>
  );
}
