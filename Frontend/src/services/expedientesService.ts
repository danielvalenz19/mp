import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface Expediente {
  id_expediente: number;
  titulo: string;
  descripcion: string;
  estado: string;
  dependencia: string;
  id_dependencia: number;
  creado_en?: string;
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

export const fetchExpedientes = async (params: ListParams = {}): Promise<Expediente[]> => {
  const response = await api.get<ApiResponse<Expediente[]>>('/expedientes', { params });
  return unwrap(response.data) ?? [];
};

export const createExpediente = async (payload: {
  titulo: string;
  descripcion: string;
  idDependencia: number;
}): Promise<Expediente> => {
  const response = await api.post<ApiResponse<Expediente>>('/expedientes', payload);
  return unwrap(response.data);
};

export const updateExpediente = async (
  id: number,
  payload: { titulo: string; descripcion: string; idDependencia: number },
): Promise<Expediente> => {
  const response = await api.put<ApiResponse<Expediente>>(`/expedientes/${id}`, payload);
  return unwrap(response.data);
};
