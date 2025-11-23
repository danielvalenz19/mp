import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface CatalogoItem {
  id: number;
  nombre: string;
}

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (response.ok) return response.data;
  throw new Error(response.message || 'No se pudo obtener la informacion');
};

export const fetchEstadosExpediente = async (): Promise<CatalogoItem[]> => {
  const response = await api.get<ApiResponse<CatalogoItem[]>>('/catalogos/estados-expediente');
  return unwrap(response.data) ?? [];
};

export const fetchDependencias = async (): Promise<CatalogoItem[]> => {
  const response = await api.get<ApiResponse<CatalogoItem[]>>('/catalogos/dependencias');
  return unwrap(response.data) ?? [];
};
