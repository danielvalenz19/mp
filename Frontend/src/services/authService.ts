import api from './api';

interface LoginResponse {
  accessToken: string;
  user: Record<string, unknown>;
}

export const loginService = async (correo: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { correo, password });
  return response.data;
};

export const fetchCurrentUser = async <T = Record<string, unknown>>(): Promise<T> => {
  const response = await api.get<T>('/auth/me');
  return response.data;
};
