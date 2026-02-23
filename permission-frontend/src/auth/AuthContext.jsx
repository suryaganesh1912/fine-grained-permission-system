import { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return (t && t !== "null" && t !== "undefined") ? t : null;
  });
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      console.log("AuthContext: Fetching user details with token...");
      setLoading(true);
      try {
        const response = await API.get("/accounts/me/");
        if (isMounted) {
          console.log("AuthContext: User details fetched successfully", response.data);
          setUser(response.data);
          setPermissions(response.data.permissions || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("AuthContext: Failed to fetch user:", error);
          if (error.response?.status === 401) {
            console.warn("AuthContext: 401 Unauthorized, logging out.");
            logout();
          }
        }
      } finally {
        if (isMounted) {
          console.log("AuthContext: Loading finished.");
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchUser();
    } else {
      console.log("AuthContext: No token found.");
      setUser(null);
      setPermissions([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setPermissions([]);
    setLoading(false);
  };

  const hasPermission = (code) => permissions.includes(code);

  return (
    <AuthContext.Provider value={{ token, user, permissions, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);