import { createContext, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const isUser = JSON.parse(localStorage.getItem("user"));
  const [currentUser, setCurrentUser] = useState(isUser);

  const navigate = useNavigate();
  const logout = useCallback(() => {
    setCurrentUser(null);

    localStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  const value = useMemo(
    () => ({
      currentUser,
      logout,
    }),
    [currentUser, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
