import api from './api';

interface LoginResponse {
  accessToken: string;
  user: Record<string, unknown>;
}

interface MeResponse {
  ok: boolean;
  user: Record<string, unknown>;
}

export const loginService = async (correo: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { correo, password });
  return response.data;
};

export const fetchCurrentUser = async <T = Record<string, unknown>>(): Promise<T> => {
  const response = await api.get<MeResponse | { data?: unknown; user?: unknown }>('/auth/me');
  const payload = (response.data as MeResponse).user ?? (response.data as { data?: unknown }).data;
  if (!payload) {
    throw new Error('Perfil no disponible');
  }
  return payload as T;
};
