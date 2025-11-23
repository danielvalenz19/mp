import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

// Interfaz alineada exactamente con lo que devuelve SQL Server
export interface Expediente {
  id: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  fecha_registro: string;
  estado_id: number;
  estado_descripcion: string;
  estado_codigo: string;
  dependencia: string;
  id_dependencia?: number;
  tecnico_nombre?: string;
}

export interface ListParams {
  busqueda?: string;
  estado?: string;
  dependencia?: string;
}

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (response.ok) return response.data;
  throw new Error(response.message || 'No se pudo obtener la informacion');
};

// 1. Listar todos
export const fetchExpedientes = async (params: ListParams = {}): Promise<Expediente[]> => {
  const response = await api.get<ApiResponse<Expediente[]>>('/expedientes', { params });
  return unwrap(response.data) ?? [];
};

// 2. Obtener uno solo (Esta es la que tenías duplicada)
export const fetchExpedienteById = async (id: number): Promise<Expediente> => {
  const response = await api.get<ApiResponse<Expediente>>(`/expedientes/${id}`);
  return unwrap(response.data);
};

// 3. Crear
export const createExpediente = async (payload: {
  titulo: string;
  descripcion: string;
  idDependencia: number;
}): Promise<Expediente> => {
  const response = await api.post<ApiResponse<Expediente>>('/expedientes', payload);
  return unwrap(response.data);
};

// 4. Actualizar
export const updateExpediente = async (
  id: number,
  payload: { titulo: string; descripcion: string; idDependencia: number },
): Promise<Expediente> => {
  const response = await api.put<ApiResponse<Expediente>>(`/expedientes/${id}`, payload);
  return unwrap(response.data);
};
