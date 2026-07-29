import { useEffect, useState, useCallback } from "react";
import * as api from "../services/api";
import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!api.getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await api.getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch {
        api.setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signOut = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
