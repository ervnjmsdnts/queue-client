import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../../firebase";

export const useAddOrganization = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}) => {
    try {
      setIsValidating(true);
      const res = await addDoc(collection(db, "organizations"), { ...payload });
      setResponse(res);
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

export const useAddOffice = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}) => {
    try {
      setIsValidating(true);

      const resUser = await addDoc(collection(db, "users"), {
        displayName: payload.username,
        role: "office",
        email: payload.email,
        password: payload.password,
      });

      const resOffice = await setDoc(doc(db, "offices", resUser.id), {
        ...payload,
      });

      setResponse(resOffice);
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

export const useEditOffice = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}, officeId) => {
    try {
      setIsValidating(true);
      setResponse();

      await updateDoc(doc(db, "offices", officeId), {
        ...payload,
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

export const useEditOrganization = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}, orgId) => {
    try {
      setIsValidating(true);
      setResponse();

      await updateDoc(doc(db, "organizations", orgId), {
        ...payload,
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
