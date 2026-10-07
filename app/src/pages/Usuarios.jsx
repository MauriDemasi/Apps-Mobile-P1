import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

const fecha = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("es-AR")} ${d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setError("");
        const res = await api.get("/api/admin/usuarios");
        const lista = res.data.data;
        setUsuarios(lista);
        setSeleccionado((prev) => prev ?? lista[0]?.id ?? null);
      } catch (err) {
        setError(err.response?.data?.mensaje || "Error al cargar usuarios");
      }
    };
    fetchUsuarios();
  }, []);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <p className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">Error: {error}</p>
        <Link to="/admin/dashboard" className="mt-4 inline-block rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Volver al panel
        </Link>
      </div>
    );
  }

  const actual = usuarios.find((u) => u.id === seleccionado) ?? null;

  const campos = actual
    ? [
        ["Nombre", actual.nombre],
        ["Email", actual.email],
        ["Dirección", actual.direccion],
        ["Teléfono", actual.telefono],
        ["Alta", fecha(actual.createdAt)],
        ["Última modificación", fecha(actual.updatedAt)],
      ]
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte"> Cuentas de cliente</p>
      <h1 className="mt-1 text-2xl font-bold">
        Usuarios <span className="text-base font-normal opacity-70">({usuarios.length})</span>
      </h1>

      <div className="crm-claro mt-4 flex flex-col gap-0 overflow-hidden rounded border border-slate-300 bg-white md:flex-row">
        <div className="shrink-0 md:w-72 md:border-r md:border-slate-300">
          <p className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Lista de Clientes · {usuarios.length} {usuarios.length === 1 ? "registro" : "registros"}
          </p>
          <ul className="max-h-96 divide-y divide-slate-200 overflow-y-auto">
            {usuarios.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => setSeleccionado(u.id)}
                  aria-current={seleccionado === u.id}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-500 ${
                    seleccionado === u.id ? "border-l-4 border-slate-700 bg-slate-100 font-semibold" : "border-l-4 border-transparent"
                  }`}
                >
                  {u.nombre}
                  <span className="block truncate text-xs font-normal text-slate-500">{u.email}</span>
                </button>
              </li>
            ))}
            {usuarios.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">Sin registros.</li>
            )}
          </ul>
        </div>

        <section aria-label="Detalle de cuenta" className="min-w-0 flex-1">
          <p className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            {actual ? `Detalle de cuenta · Cliente #${actual.id}` : "Detalle de cuenta"}
          </p>
          {actual ? (
            <dl className="grid grid-cols-1 gap-x-6 px-4 py-3 sm:grid-cols-2">
              {campos.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="border-b border-slate-100 py-2">
                  <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">{etiqueta}</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{valor || "—"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="px-4 py-6 text-sm text-slate-500">Seleccioná una cuenta de la cabecera.</p>
          )}
        </section>
      </div>

      <Link to="/admin/dashboard" className="mt-4 inline-block rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
        Volver al panel
      </Link>
    </div>
  );
}
