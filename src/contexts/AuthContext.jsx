import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [getUser, setGetUser] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/");

      const snap = await getDoc(doc(db, "users", user?.uid));

      setCurrentUser(snap.data());
      setGetUser(false);
    });

    return () => {
      unsub();
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      getUser,
    }),
    [currentUser, getUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
