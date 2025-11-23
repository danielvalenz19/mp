import api from './api';

interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

// Interfaz alineada con lo que devuelve el SP sp_Usuarios_Listar
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  username?: string;
  id_rol: number;
  rol: string;
  estado: number; // 1 = Activo, 0 = Inactivo
  fecha_creacion: string;
}

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (response.ok) return response.data;
  throw new Error(response.message || 'Error en la petición');
};

// Listar todos
export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
  return unwrap(response.data) ?? [];
};

// Crear
export const createUsuario = async (data: any) => {
  const response = await api.post<ApiResponse<any>>('/usuarios', data);
  return unwrap(response.data);
};

// Actualizar Datos
export const updateUsuario = async (id: number, data: any) => {
  const response = await api.put<ApiResponse<any>>(`/usuarios/${id}`, data);
  return unwrap(response.data);
};

// Cambiar Contraseña
export const changePassword = async (id: number, password: string) => {
  const response = await api.patch<ApiResponse<any>>(`/usuarios/${id}/password`, { password });
  return unwrap(response.data);
};

// Cambiar Estado (Activar/Desactivar)
export const changeEstado = async (id: number, estado: number) => {
  const response = await api.patch<ApiResponse<any>>(`/usuarios/${id}/estado`, { estado });
  return unwrap(response.data);
};
