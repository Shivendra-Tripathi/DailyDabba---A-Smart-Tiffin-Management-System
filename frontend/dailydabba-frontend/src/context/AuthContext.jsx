// Global "is the user logged in?" state. Any component can call useAuth().
import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.get()); // restores login after refresh

  const login = async (credentials) => {
    const { accessToken } = await authService.login(credentials); // throws ApiError on failure
    tokenStorage.set(accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
  };

  return <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
