import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-profundo mt-10 text-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <p className="marca text-lg leading-none text-white">
            Mercado<br />Liebre
          </p>
          <p className="mt-2 text-sm opacity-70">Lo mejor está corriendo. Tu paquete ya está saltando hacia tu casa.</p>
        </div>
        <nav aria-label="Enlaces rápidos">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Enlaces rápidos</p>
          <ul className="mt-2 space-y-1 text-sm font-medium">
            <li><Link to="/" className="hover:underline underline-offset-4">Inicio</Link></li>
            <li><Link to="/productos" className="hover:underline underline-offset-4">Ofertas</Link></li>
            <li><Link to="/login" className="hover:underline underline-offset-4">Mi cuenta</Link></li>
            <li><Link to="/admin/login" className="hover:underline underline-offset-4">Trastienda</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Legal</p>
          <ul className="mt-2 space-y-1 text-sm opacity-70">
            <li>Términos y condiciones</li>
            <li>Defensa del consumidor</li>
            <li>Arrepentimiento en 10 días (o 10 saltos)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto w-full max-w-6xl px-4 py-3 text-center text-xs opacity-60">
          Mercado Liebre · Proyecto Fullstack con fines educativos
        </p>
      </div>
    </footer>
  );
}
