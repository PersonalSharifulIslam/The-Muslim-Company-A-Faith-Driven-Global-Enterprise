import { createContext, useContext, useEffect, useState } from "react";

export type EmployeeUser = {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  position: string;
  phone: string;
  address: string;
  profile_image: string;
  joining_date: string;
  status: string;
};

type AuthCtx = {
  employee: EmployeeUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

const TOKEN_KEY = "tmc_employee_token";

async function empFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error || String(res.status));
  }
  return res.json();
}

export function EmployeeAuthProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<EmployeeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    empFetch("/employee/auth/me")
      .then((d: unknown) => setEmployee((d as { employee: EmployeeUser }).employee))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string) => {
    const d = await empFetch("/employee/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }) as { token: string; employee: EmployeeUser };
    localStorage.setItem(TOKEN_KEY, d.token);
    setEmployee(d.employee as unknown as EmployeeUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setEmployee(null);
    window.location.href = "/employee";
  };

  return <Ctx.Provider value={{ employee, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useEmployeeAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEmployeeAuth must be used within EmployeeAuthProvider");
  return ctx;
}

export function empApi() {
  const token = localStorage.getItem(TOKEN_KEY);
  async function req(method: string, path: string, body?: unknown) {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (!res.ok) throw new Error((j as { error?: string }).error || String(res.status));
    return j;
  }
  return {
    get: (p: string) => req("GET", p),
    post: (p: string, b: unknown) => req("POST", p, b),
    put: (p: string, b: unknown) => req("PUT", p, b),
    del: (p: string) => req("DELETE", p),
  };
}
