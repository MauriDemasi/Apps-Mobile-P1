import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

export default function ClienteDashboard() {

    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState("");
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                setError("");
                const res = await api.get("/api/client/perfil");
                setPerfil(res.data.data);
            } catch (err) {
                setError(err.response?.data?.mensaje || "Error al cargar perfil");
            }
        };

        fetchPerfil();
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

    if (!perfil) {
        return <p className="p-6 text-center text-sm">La liebre está buscando tu ficha…</p>;
    }

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
            <div className="bg-liebre rounded-lg p-6 text-profundo">
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Mi cuenta</p>
                <h1 className="mt-1 text-3xl font-black uppercase">Hola, {perfil.nombre}</h1>
                <p className="mt-1 text-sm font-medium">Esta es tu ficha de la madriguera.</p>
            </div>
            <dl className="mt-4 divide-y rounded-lg bg-white shadow-sm">
                {[
                  ['Nombre', perfil.nombre],
                  ['Email', perfil.email],
                  ['Dirección', perfil.direccion],
                  ['Teléfono', perfil.telefono],
                ].map(([etiqueta, valor]) => (
                  <div key={etiqueta} className="grid grid-cols-[130px_1fr] gap-2 px-4 py-3 text-sm md:grid-cols-[180px_1fr]">
                    <dt className="font-semibold opacity-60">{etiqueta}</dt>
                    <dd>{valor || <span className="opacity-50">Sin registrar</span>}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={handleLogout} className="btn-primario px-4 py-2 text-sm">Cerrar sesión</button>
                <Link to="/productos" className="rounded-lg border border-profundo/25 px-4 py-2 text-sm font-semibold">
                  Ver ofertas
                </Link>
            </div>
        </div>
    );
}
