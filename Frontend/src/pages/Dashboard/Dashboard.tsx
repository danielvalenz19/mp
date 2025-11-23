import { useEffect, useState } from 'react';
import {
  fetchExpedientesPorDependencia,
  fetchExpedientesPorEstado,
  fetchExpedientesPorTecnico,
} from '../../services/reportService';
import type {
  DependenciaResumen,
  EstadoResumen,
  TecnicoResumen,
} from '../../services/reportService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const chartColors = ['#2563eb', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#0ea5e9'];

const Dashboard = () => {
  const [estadoData, setEstadoData] = useState<EstadoResumen[]>([]);
  const [dependenciaData, setDependenciaData] = useState<DependenciaResumen[]>([]);
  const [tecnicoData, setTecnicoData] = useState<TecnicoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [estado, dependencia, tecnico] = await Promise.all([
          fetchExpedientesPorEstado(),
          fetchExpedientesPorDependencia(),
          fetchExpedientesPorTecnico(),
        ]);
        if (!active) return;
        setEstadoData(estado);
        setDependenciaData(dependencia);
        setTecnicoData(tecnico);
      } catch (err) {
        if (active) {
          console.error(err);
          setError('No se pudo cargar la informacion del dashboard.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const getEstadoTotal = (codigo: string, fallback?: string) => {
    const entry = estadoData.find((item) => item.codigo_estado === codigo);
    if (entry) return entry.total;
    if (fallback) {
      const alt = estadoData.find(
        (item) => ((item.estado as string | undefined) ?? '').toLowerCase() === fallback.toLowerCase(),
      );
      return alt?.total ?? 0;
    }
    return 0;
  };

  const totalCasos = estadoData.reduce((acc, item) => acc + item.total, 0);
  const pendientes = getEstadoTotal('EN_REVISION', 'Pendiente') + getEstadoTotal('BORRADOR');
  const rechazados = getEstadoTotal('RECHAZADO', 'Rechazado');

  const cards = [
    {
      title: 'Total Casos',
      value: totalCasos,
      description: 'Expedientes registrados',
      color: 'text-primary',
    },
    {
      title: 'Pendientes',
      value: pendientes,
      description: 'En espera de resolucion',
      color: 'text-amber-500',
    },
    {
      title: 'Rechazados',
      value: rechazados,
      description: 'Casos sin seguimiento',
      color: 'text-rose-500',
    },
  ];

  const formatValue = (value: number) => value.toLocaleString('es-GT');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">
          Resumen general de expedientes y actividad reciente.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>
              {loading ? '...' : formatValue(card.value)}
            </p>
            <p className="text-xs text-slate-400 mt-2">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Expedientes por Dependencia
            </h2>
            <span className="text-xs text-slate-400">
              {loading ? 'Actualizando...' : 'Ultimos 30 dias'}
            </span>
          </div>
          <div className="h-72">
            {dependenciaData.length === 0 && !loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Sin datos para mostrar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dependenciaData}>
                  <XAxis dataKey="dependencia" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Expedientes por Tecnico
            </h2>
            <span className="text-xs text-slate-400">
              {loading ? 'Actualizando...' : 'Ultimos 30 dias'}
            </span>
          </div>
          <div className="h-72">
            {tecnicoData.length === 0 && !loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Sin datos para mostrar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tecnicoData}
                    dataKey="total"
                    nameKey="tecnico"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {tecnicoData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
