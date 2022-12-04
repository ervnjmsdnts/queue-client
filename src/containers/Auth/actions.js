import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../../firebase";

export const useRegister = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}) => {
    try {
      setIsValidating(true);
      const conditions = [where("email", "==", payload.email)];
      const ref = collection(db, "users");
      const filterQuery = query(ref, ...conditions);
      const user = await getDocs(filterQuery);

      if (user.size) return setError("already exists");

      const res = await addDoc(collection(db, "users"), {
        displayName: `${payload.firstName} ${payload.lastName}`,
        role: "user",
        email: payload.email,
        password: payload.password,
      });

      setResponse(res);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    data: response,
    error,
    isValidating,
    execute,
  };
};

export const useLogin = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}) => {
    try {
      setIsValidating(true);
      setError();
      const conditions = [
        where("email", "==", payload.email),
        where("password", "==", payload.password),
      ];
      const ref = collection(db, "users");
      const filterQuery = query(ref, ...conditions);
      const user = await getDocs(filterQuery);
      if (!user.size) return setError("error");
      setResponse({ id: user.docs[0].id, ...user.docs[0].data() });
    } catch (e) {
      console.log(e);
      setError(e);
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    data: response,
    error,
    isValidating,
    execute,
  };
};
