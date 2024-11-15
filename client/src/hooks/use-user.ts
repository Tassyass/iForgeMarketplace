import useSWR from "swr";
import type { User } from "db/schema";

interface AuthError extends Error {
  status?: number;
}

export function useUser() {
  const { data, error, mutate } = useSWR<User, AuthError>("/api/user", {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: (err) => {
      // Don't retry on 401 as it's an expected state
      return err.status !== 401;
    },
    onError: (err) => {
      // Clear user data on 401 errors
      if (err.status === 401) {
        mutate(undefined, false);
      }
    }
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: error && error.status !== 401,
    isAuthenticated: Boolean(data),
    error,
    login: async (credentials: { email: string; password: string }) => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include"
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        await mutate();
        return { ok: true };
      } catch (e: any) {
        return { ok: false, message: e.message };
      }
    },
    logout: async () => {
      try {
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include"
        });
        await mutate(undefined, false);
        return { ok: true };
      } catch (e: any) {
        return { ok: false, message: e.message };
      }
    }
  };
}

type RequestResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

async function handleRequest(
  url: string,
  method: string,
  body?: { email: string; password: string }
): Promise<RequestResult> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error: AuthError = new Error(errorData.message);
      error.status = response.status;
      throw error;
    }

    return { ok: true };
  } catch (e: any) {
    return { 
      ok: false, 
      message: e.message || 'An error occurred'
    };
  }
}