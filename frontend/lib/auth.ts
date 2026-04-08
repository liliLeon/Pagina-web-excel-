import { api, User } from './api';

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function login(email: string, password: string): Promise<User> {
  const { token, user } = await api.auth.login(email, password);
  saveToken(token);
  return user;
}

export async function logout(): Promise<void> {
  await api.auth.logout().catch(() => {});
  removeToken();
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
