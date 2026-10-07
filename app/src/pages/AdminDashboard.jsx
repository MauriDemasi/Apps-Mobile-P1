import { useState, useEffect } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [metricas, setMetricas] = useState(null);
  const [error, setError] = useState("");
  const { logout, user } = useAuth();
  const role = user?.admin?.role ?? user?.role;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setError("");
        const res = await api.get("/api/admin/metricas");
        setMetricas(res.data.data);
      } catch (err) {
        setError(err.response?.data?.mensaje || "Error al cargar metricas");
      }
    };

    fetchMetricas();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (error) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10">
        <p className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-red-700">Error: {error}</p>
        <button onClick={handleLogout} className="btn-primario mt-4 px-4 py-2 text-sm">
          Salir
        </button>
      </div>
    );
  }

  if (!metricas) {
    return <p className="p-6 text-center text-sm text-white">Abriendo la trastienda…</p>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mp-fuerte">
          Trastienda · Panel del equipo{role ? ` · ${role}` : ''}
        </p>
        <h1 className="mt-1 text-3xl font-black uppercase">Turno de {metricas.admin.nombre}</h1>
        <p className="mt-1 text-sm opacity-70">{metricas.admin.email}</p>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {[
          ['Clientes', metricas.metricas.totalClientes],
          ['Equipo', metricas.metricas.totalAdmins],
          ['Productos', metricas.metricas.totalProductos ?? '—'],
        ].map(([etiqueta, valor]) => (
          <div key={etiqueta} className="rounded-lg bg-white p-4 text-center shadow-sm">
            <dt className="text-xs font-bold uppercase tracking-widest opacity-60">{etiqueta}</dt>
            <dd className="precio mt-1 text-3xl text-mp-fuerte">{valor}</dd>
          </div>
        ))}
      </dl>
      <button onClick={handleLogout} className="btn-mp mt-4 px-4 py-2 text-sm">
        Cerrar sesión
      </button>
    </div>
  );
}
