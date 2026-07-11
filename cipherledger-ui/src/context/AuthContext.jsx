import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({
        username: localStorage.getItem("username") || "Operator",
        role: "ADMIN"
      });
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", userData.username);
    setUser({
      username: userData.username,
      role: userData.role || "ADMIN"
    });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: loginUser,
        logout: logoutUser,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

