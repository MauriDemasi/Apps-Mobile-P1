import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PROFUNDO = '#2D327A';
const MP = '#00B1EA';
const LIEBRE = '#FFD800';
const GRIS = '#EDEDED';
const TINTA_NOCHE = '#eef0ff';
const FONDO_NICHO = '#232a5e';

export function BarrasCategoria({ datos, oscuro = false }) {

  if (!datos.length) return <p className="py-6 text-center text-sm">Sin datos para graficar.</p>;
  const tick = { fontSize: 12, fill: oscuro ? TINTA_NOCHE : PROFUNDO };
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={datos}>
          <XAxis dataKey="categoria" tick={tick} axisLine={{ stroke: oscuro ? TINTA_NOCHE : PROFUNDO }} tickLine={false} interval={0} angle={-15} dy={10} height={60} />
          <YAxis allowDecimals={false} tick={tick} axisLine={{ stroke: oscuro ? TINTA_NOCHE : PROFUNDO }} tickLine={false} />
          <Tooltip contentStyle={oscuro ? { backgroundColor: FONDO_NICHO, border: 'none', borderRadius: 8, color: TINTA_NOCHE } : undefined} />
          <Bar dataKey="cantidad" fill={oscuro ? LIEBRE : PROFUNDO} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonaStock({ ok, bajo, oscuro = false }) {

  if (!ok && !bajo) return <p className="py-6 text-center text-sm">Sin datos para graficar.</p>;
  const datos = [
    { nombre: 'Stock sano', valor: ok },
    { nombre: 'Stock bajo', valor: bajo },
  ];
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={datos} dataKey="valor" nameKey="nombre" innerRadius={60} outerRadius={100} stroke="none">
            <Cell fill={MP} />
            <Cell fill={LIEBRE} />
          </Pie>
          <Tooltip contentStyle={oscuro ? { backgroundColor: FONDO_NICHO, border: 'none', borderRadius: 8, color: TINTA_NOCHE } : undefined} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
