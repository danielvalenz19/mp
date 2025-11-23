import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchExpedientes, type Expediente } from '../../services/expedientesService';
import { fetchDependencias, fetchEstadosExpediente, type CatalogoItem } from '../../services/catalogosService';
import { Search, Filter, Plus, RefreshCw } from 'lucide-react';

const ExpedientesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [estados, setEstados] = useState<CatalogoItem[]>([]);
  const [deps, setDeps] = useState<CatalogoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtros = useMemo(
    () => ({
      busqueda: searchParams.get('busqueda') ?? '',
      estado: searchParams.get('estado') ?? '',
      dependencia: searchParams.get('dependencia') ?? '',
    }),
    [searchParams],
  );

  const loadCatalogos = async () => {
    try {
      const [est, dep] = await Promise.all([fetchEstadosExpediente(), fetchDependencias()]);
      setEstados(est);
      setDeps(dep);
    } catch (err) {
      console.error(err);
    }
  };

  const loadExpedientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpedientes({
        busqueda: filtros.busqueda || undefined,
        estado: filtros.estado || undefined,
        dependencia: filtros.dependencia || undefined,
      });
      setExpedientes(data);
    } catch (err) {
      setError('No se pudo cargar la lista de expedientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogos();
  }, []);

  useEffect(() => {
    loadExpedientes();
  }, [filtros.busqueda, filtros.estado, filtros.dependencia]);

  const handleFilterChange = (key: 'busqueda' | 'estado' | 'dependencia', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Expedientes</h1>
          <p className="text-slate-500 text-sm">Bandeja de entrada y filtros de casos.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadExpedientes}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
          <Link
            to="/expedientes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </Link>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleFilterChange('busqueda', e.target.value)}
              placeholder="Buscar por titulo o descripcion"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={filtros.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              <option value="">Todos los estados</option>
              {estados.map((item) => (
                <option key={item.id} value={item.nombre}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={filtros.dependencia}
              onChange={(e) => handleFilterChange('dependencia', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            >
              <option value="">Todas las dependencias</option>
              {deps.map((item) => (
                <option key={item.id} value={item.nombre}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Titulo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                  Dependencia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                  Creado
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500 text-sm">
                    Cargando expedientes...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-rose-500 text-sm">
                    {error}
                  </td>
                </tr>
              ) : expedientes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500 text-sm">
                    Sin resultados para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                expedientes.map((item) => (
                  <tr key={item.id_expediente} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-800">{item.titulo}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{item.dependencia}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {item.creado_en ? new Date(item.creado_en).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/expedientes/${item.id_expediente}/editar`}
                        className="text-primary text-sm hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpedientesList;
