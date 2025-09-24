const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body,
  }).then(r => r.json());
}

export function setAuth(token: string) {
  // Example helper to attach Bearer token; integrate with your fetch layer as needed
  (globalThis as any).__AUTH_TOKEN__ = token;
}

export function authHeaders() {
  const token = (globalThis as any).__AUTH_TOKEN__;
  return token ? { Authorization: `Bearer ${token}` } : {};
}