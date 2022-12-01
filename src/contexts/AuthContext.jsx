import { createContext, useCallback, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const logout = useCallback(() => {
    setCurrentUser(null);

    localStorage.removeItem("user");
    window.location.href = "/";
  }, []);

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
