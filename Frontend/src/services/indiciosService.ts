import api from './api';

export interface Indicio {
  id: number;
  id_expediente: number;
  descripcion: string;
  color?: string;
  tamano?: string;
  peso?: number;
  ubicacion?: string;
  fecha_registro: string;
  id_tecnico: number;
  tecnico_nombre?: string;
}

// Listar evidencias de un caso
export const getIndiciosByExpediente = async (expedienteId: number): Promise<Indicio[]> => {
  const response = await api.get<{ ok: boolean; data: Indicio[] }>(`/expedientes/${expedienteId}/indicios`);
  return response.data.data;
};

// Crear evidencia
export const createIndicio = async (expedienteId: number, data: Partial<Indicio>) => {
  const response = await api.post(`/expedientes/${expedienteId}/indicios`, data);
  return response.data;
};

// Editar evidencia
export const updateIndicio = async (id: number, data: Partial<Indicio>) => {
  const response = await api.put(`/indicios/${id}`, data);
  return response.data;
};

// Borrar evidencia
export const deleteIndicio = async (id: number) => {
  const response = await api.delete(`/indicios/${id}`);
  return response.data;
};
