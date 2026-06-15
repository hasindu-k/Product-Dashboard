import axios from "axios";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  access_token?: string;
  user?: AuthUser;
  errors?: Record<string, string[]>;
}

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const AUTH_TOKEN_KEY = "product_dashboard_token";
const AUTH_USER_KEY = "product_dashboard_user";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function logout() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  try {
    if (token) {
      await authApi.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  } finally {
    clearStoredAuth();
  }
}

export async function authenticate(
  action: "login" | "register",
  payload: AuthPayload,
) {
  try {
    const { data } = await authApi.post<AuthResponse>(`/${action}`, payload);

    if (!data.success || !data.access_token || !data.user) {
      throw new Error(data.message ?? "Authentication failed. Please try again.");
    }

    return {
      token: data.access_token,
      user: data.user,
    };
  } catch (error) {
    if (axios.isAxiosError<AuthResponse>(error)) {
      const data = error.response?.data;
      const validationMessage = data?.errors
        ? Object.values(data.errors).flat().at(0)
        : undefined;

      throw new Error(
        validationMessage ??
          data?.message ??
          "Authentication failed. Please try again.",
      );
    }

    throw error;
  }
}
