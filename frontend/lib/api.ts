const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<void>('/logout', { method: 'POST' }),
    me: () => request<User>('/me'),
  },

  invoices: {
    list: (params?: { estado_validacion?: string; search?: string; page?: number }) => {
      const qs = new URLSearchParams(
        Object.entries(params ?? {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])
      ).toString();
      return request<PaginatedResponse<Invoice>>(`/invoices${qs ? `?${qs}` : ''}`);
    },
    create: (data: InvoiceFormData) =>
      request<{ message: string; invoice: Invoice }>('/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<InvoiceFormData>) =>
      request<Invoice>(`/invoices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) => request<void>(`/invoices/${id}`, { method: 'DELETE' }),
    exportUrl: () => `${API_URL}/invoices-export?token=${getToken()}`,
    stats: () => request<StatsResponse>('/stats'),
  },
};

// Types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  numero_factura: string;
  proveedor: string;
  nit: string;
  total: number;
  fecha: string;
  estado_validacion: 'pendiente' | 'correcto' | 'error' | 'advertencia';
  mensaje_validacion: string | null;
  exportado_excel: boolean;
  created_at: string;
}

export interface InvoiceFormData {
  numero_factura: string;
  proveedor: string;
  nit: string;
  total: number;
  fecha: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface StatsResponse {
  stats: {
    total: number;
    correctas: number;
    errores: number;
    pendientes: number;
    advertencias: number;
    total_monto: number;
  };
  monthly: { mes: string; cantidad: number; monto: number }[];
}
