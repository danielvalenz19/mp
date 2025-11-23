import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface EstadoResumen {
  estado: string;
  codigo_estado?: string;
  total: number;
  [key: string]: string | number | undefined;
}

export interface DependenciaResumen {
  dependencia: string;
  total: number;
  [key: string]: string | number | undefined;
}

export interface TecnicoResumen {
  tecnico: string;
  total: number;
  [key: string]: string | number | undefined;
}

// Filtros opcionales para reportes
interface ReporteFilters {
  fechaDesde?: string;
  fechaHasta?: string;
}

const getParams = (filters?: ReporteFilters) => {
  const params = new URLSearchParams();
  if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
  if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
  return params;
};

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (response.ok && response.data) {
    return response.data;
  }
  throw new Error(response.message || 'No se pudo obtener la informacion solicitada');
};

export const fetchExpedientesPorEstado = async (filters?: ReporteFilters): Promise<EstadoResumen[]> => {
  const response = await api.get<ApiResponse<Record<string, unknown>[]>>(
    '/reportes/expedientes-por-estado',
    { params: getParams(filters) },
  );
  const data = unwrap(response.data) ?? [];
  return data.map((item) => ({
    estado: String((item as { estado?: string; descripcion?: string }).estado ?? (item as { descripcion?: string }).descripcion ?? 'Desconocido'),
    codigo_estado: (item as { codigo_estado?: string; estado_codigo?: string }).codigo_estado ??
      (item as { estado_codigo?: string }).estado_codigo ??
      (item as { estado?: string }).estado,
    total: Number((item as { total_expedientes?: number; total?: number }).total_expedientes ??
      (item as { total?: number }).total ??
      0),
  }));
};

export const fetchExpedientesPorDependencia = async (filters?: ReporteFilters): Promise<DependenciaResumen[]> => {
  const response = await api.get<ApiResponse<Record<string, unknown>[]>>(
    '/reportes/expedientes-por-dependencia',
    { params: getParams(filters) },
  );
  const data = unwrap(response.data) ?? [];
  return data.map((item) => ({
    dependencia: String((item as { dependencia?: string; nombre?: string }).dependencia ?? (item as { nombre?: string }).nombre ?? 'Sin dependencia'),
    total: Number((item as { total_expedientes?: number; total?: number }).total_expedientes ??
      (item as { total?: number }).total ??
      0),
  }));
};

export const fetchExpedientesPorTecnico = async (filters?: ReporteFilters): Promise<TecnicoResumen[]> => {
  const response = await api.get<ApiResponse<Record<string, unknown>[]>>(
    '/reportes/expedientes-por-tecnico',
    { params: getParams(filters) },
  );
  const data = unwrap(response.data) ?? [];
  return data.map((item) => ({
    tecnico: String((item as { tecnico?: string; nombre?: string }).tecnico ?? (item as { nombre?: string }).nombre ?? 'Sin tecnico'),
    total: Number((item as { total_expedientes?: number; total?: number }).total_expedientes ??
      (item as { total?: number }).total ??
      0),
  }));
};
