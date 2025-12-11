import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const user = await response.json();

      if (!response.ok) {
        const message = user?.error || user?.message || "Signup failed";
        setError(message);
        return { ok: false, error: message };
      }

      localStorage.setItem("user", JSON.stringify(user));
      return { ok: true, user };
    } catch (err) {
      const message = err?.message || "Network error";
      setError(message);
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
}
