import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../lib/axios";
import type { User, AuthTokens, LoginCredentials, AgentLoginCredentials, AgentTotpCredentials } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  agentLogin: (credentials: AgentLoginCredentials) => Promise<{ email: string; requiresTotp: boolean }>;
  agentTotpVerify: (credentials: AgentTotpCredentials) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/login", credentials);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const agentLogin = async (credentials: AgentLoginCredentials) => {
    const { data } = await api.post<{ mfaRequired: boolean; user?: User; accessToken?: string; refreshToken?: string; message: string }>("/auth/agent/login", credentials);
    if (!data.mfaRequired && data.accessToken && data.refreshToken && data.user) {
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { requiresTotp: false, email: credentials.email, authenticated: true };
    }
    return { requiresTotp: data.mfaRequired, email: credentials.email, authenticated: false };
  };

  const agentTotpVerify = async (credentials: AgentTotpCredentials) => {
    const { data } = await api.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/agent/login/totp", credentials);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload: any) => {
    const { data } = await api.post<{ user: User; accessToken: string; refreshToken: string }>("/auth/register", payload);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, agentLogin, agentTotpVerify, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
