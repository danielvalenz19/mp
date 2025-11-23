import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface EstadoResumen {
  estado: string;
  total: number;
  [key: string]: string | number;
}

export interface DependenciaResumen {
  dependencia: string;
  total: number;
  [key: string]: string | number;
}

export interface TecnicoResumen {
  tecnico: string;
  total: number;
  [key: string]: string | number;
}

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (response.ok && response.data) {
    return response.data;
  }
  throw new Error(response.message || 'No se pudo obtener la informacion solicitada');
};

export const fetchExpedientesPorEstado = async (): Promise<EstadoResumen[]> => {
  const response = await api.get<ApiResponse<EstadoResumen[]>>('/reportes/expedientes-por-estado');
  return unwrap(response.data) ?? [];
};

export const fetchExpedientesPorDependencia = async (): Promise<DependenciaResumen[]> => {
  const response = await api.get<ApiResponse<DependenciaResumen[]>>(
    '/reportes/expedientes-por-dependencia',
  );
  return unwrap(response.data) ?? [];
};

export const fetchExpedientesPorTecnico = async (): Promise<TecnicoResumen[]> => {
  const response = await api.get<ApiResponse<TecnicoResumen[]>>('/reportes/expedientes-por-tecnico');
  return unwrap(response.data) ?? [];
};
