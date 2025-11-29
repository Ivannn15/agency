const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type FetchOptions = {
  method?: string;
  body?: any;
  token?: string | null;
};

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('agencyroom_token');
    if (stored) headers['Authorization'] = `Bearer ${stored}`;
  }
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}
