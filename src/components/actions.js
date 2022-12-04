import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../firebase";

export const useChangePassword = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}, userId) => {
    try {
      setIsValidating(true);
      setResponse(false);

      await updateDoc(doc(db, "users", userId), {
        password: payload.password,
      });

      setResponse(true);
    } catch (e) {
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
