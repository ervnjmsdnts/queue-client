import { Box, Button, Dialog, Typography } from "@mui/material";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import { useAddUserToQueue, useRemoveUserFromQueue } from "./actions";

const QueueConfirmationDialog = ({
  onClose,
  open,
  organization,
  window,
  isRemove,
  officeId,
}) => {
  const {
    data: addData,
    error: addError,
    isValidating: addValidating,
    execute: addToQueue,
  } = useAddUserToQueue();
  const {
    data: removeData,
    error: removeError,
    isValidating: removeValidating,
    execute: removeFromQueue,
  } = useRemoveUserFromQueue();

  const { currentUser } = useAuth();

  const [currOffice, setCurrOffice] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "offices", officeId), (snapshot) => {
      setCurrOffice(snapshot.data());
    });

    return () => {
      unsub();
    };
  }, [officeId]);

  const currQueueNumber = currOffice?.peopleInQueue?.find(
    (q) => q.id === currentUser.id
  );

  const onSubmit = useCallback(async () => {
    isRemove
      ? await removeFromQueue(
          {
            ...currQueueNumber,
          },
          officeId
        )
      : await addToQueue(
          {
            ...currentUser,
            attendance: false,
            createdAt: Timestamp.now(),
          },
          officeId
        );
    onClose();
  }, [
    currentUser,
    officeId,
    addToQueue,
    isRemove,
    removeFromQueue,
    onClose,
    currQueueNumber,
  ]);

  useEffect(() => {
    (async () => {
      if (!addData && !addError) return;
      if (addError) return toast.error("Something went wrong");

      toast.success("Added to queue");
    })();
  }, [addData, addError]);

  useEffect(() => {
    (async () => {
      if (!removeData && !removeError) return;
      if (removeError) return toast.error("Something went wrong");

      toast.success("Removed from queue");
    })();
  }, [removeData, removeError]);

  const isValidating = useMemo(
    () => addValidating || removeValidating,
    [addValidating, removeValidating]
  );

  return (
    <Dialog onClose={onClose} open={open}>
      <Box p="32px">
        <Typography
          width="300px"
          fontWeight="bold"
          variant="h5"
          textAlign="center"
          mb="16px"
        >
          {isRemove
            ? `Are you sure want to be removed from queue of ${organization} ${window}`
            : `Are you sure want to queue for ${organization} ${window}`}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="center"
        >
          <Button
            disabled={isValidating}
            color="error"
            variant="contained"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            disabled={isValidating}
            onClick={onSubmit}
            color="success"
            variant="contained"
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default QueueConfirmationDialog;
