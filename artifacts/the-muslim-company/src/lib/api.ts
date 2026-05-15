function getToken(): string | null {
  return localStorage.getItem("tmc_admin_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method: string, path: string, body?: unknown, auth = false): Promise<unknown> {
  const headers: Record<string, string> = {};
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) Object.assign(headers, authHeaders());

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let msg = `${res.status}`;
    try { const j = await res.json(); msg = j.error || msg; } catch { /* noop */ }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string, auth = false) => request("GET", path, undefined, auth),
  post: (path: string, body: unknown, auth = false) => request("POST", path, body, auth),
  put: (path: string, body: unknown, auth = false) => request("PUT", path, body, auth),
  del: (path: string, auth = false) => request("DELETE", path, undefined, auth),
  setToken: (token: string) => localStorage.setItem("tmc_admin_token", token),
  clearToken: () => localStorage.removeItem("tmc_admin_token"),
  hasToken: () => Boolean(localStorage.getItem("tmc_admin_token")),
  getToken,
};
