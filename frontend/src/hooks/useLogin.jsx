import { useState } from "react";

export default function useLogin(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data?.error || data?.message || "Login failed";
        setError(message);
        return { ok: false, error: message };
      }

      localStorage.setItem("user", JSON.stringify(data));
      return { ok: true, user: data };
    } catch (err) {
      const message = err?.message || "Network error";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
