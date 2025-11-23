import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Search, Printer, FileBarChart } from 'lucide-react';
import { 
  fetchExpedientesPorDependencia, 
  fetchExpedientesPorEstado, 
  fetchExpedientesPorTecnico 
} from '../../services/reportService';

const COLORS = ['#2563eb', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];

const ReportesView = () => {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [dataEstado, setDataEstado] = useState<any[]>([]);
  const [dataDep, setDataDep] = useState<any[]>([]);
  const [dataTec, setDataTec] = useState<any[]>([]);

  const handleConsultar = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const filters = { fechaDesde, fechaHasta };
      const [estados, deps, tecnicos] = await Promise.all([
        fetchExpedientesPorEstado(filters),
        fetchExpedientesPorDependencia(filters),
        fetchExpedientesPorTecnico(filters)
      ]);
      setDataEstado(estados);
      setDataDep(deps);
      setDataTec(tecnicos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reportes Avanzados</h1>
          <p className="text-slate-500 text-sm">Generación de estadísticas por rango de fechas.</p>
        </div>
        <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
          <Printer className="w-4 h-4" /> Imprimir
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Fecha Inicio</label>
          <input 
            type="date" 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-xs font-medium text-slate-500 mb-1">Fecha Fin</label>
          <input 
            type="date" 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <button 
          onClick={handleConsultar}
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Generando...' : 'Consultar'}
        </button>
      </div>

      {/* Resultados */}
      {!searched ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <FileBarChart className="w-12 h-12 mb-2 opacity-50" />
          <p>Selecciona un rango de fechas para ver los datos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. Estados */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Estado de Expedientes</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataEstado} dataKey="total" nameKey="estado" cx="50%" cy="50%" outerRadius={80} label>
                    {dataEstado.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Fiscalías */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Carga por Fiscalía</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataDep} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="dependencia" type="category" width={120} style={{fontSize: 10}} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Técnicos (Ancho completo) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Productividad por Técnico</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTec}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="tecnico" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
      </div>
    </div>
  );
};

export default ReportesView;
