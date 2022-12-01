import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../../firebase";

export const useAddUserToQueue = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}, officeId) => {
    try {
      setIsValidating(true);
      const res = await updateDoc(doc(db, "offices", officeId), {
        peopleInQueue: arrayUnion({ ...payload }),
      });

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

export const useRemoveUserFromQueue = () => {
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);

  const execute = useCallback(async (payload = {}, officeId) => {
    console.log({ payload });
    try {
      setIsValidating(true);
      const res = await updateDoc(doc(db, "offices", officeId), {
        peopleInQueue: arrayRemove({ ...payload }),
      });

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
