import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

type AdminUser = { email: string };

type AuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  configured: true,
  signIn: async () => ({ error: null }),
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api.hasToken()) {
      setLoading(false);
      return;
    }
    api.get("/auth/me", true)
      .then((data) => {
        const d = data as { user: AdminUser };
        setUser(d.user);
      })
      .catch(() => api.clearToken())
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.post("/auth/login", { email, password }) as { token: string; email: string };
      api.setToken(data.token);
      setUser({ email: data.email });
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error(String(err)) };
    }
  };

  const signOut = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, configured: true, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
