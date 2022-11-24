import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { auth, db } from "../../firebase";

export const useRegister = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}) => {
    try {
      setIsValidating(true);
      const res = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );

      await updateProfile(res.user, {
        displayName: `${payload.firstName} ${payload.lastName}`,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: `${payload.firstName} ${payload.lastName}`,
        role: "user",
        email: payload.email,
      });

      setResponse(res.user);
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
      const res = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      setResponse(res.user);
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
