import { Box, Button, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import QueueConfirmationDialog from "./QueueConfirmationDialog";

const Queue = ({ organization, window, officeId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [peopleInQueue, setPeopleInQueue] = useState(0);
  const [queueNumber, setQueueNumber] = useState(0);

  const { currentUser } = useAuth();

  useEffect(() => {
    const ref = doc(db, "offices", officeId);
    const unsub = onSnapshot(ref, (snapshot) => {
      const peopleInQueue = snapshot.data().peopleInQueue.length;
      const queueNumber = snapshot
        .data()
        .peopleInQueue.findIndex((q) => q.id === currentUser.id);
      const isInQueue = snapshot
        .data()
        .peopleInQueue.some((q) => q.id === currentUser.id);

      setInQueue(isInQueue);
      setPeopleInQueue(peopleInQueue);
      setQueueNumber(queueNumber + 1);
    });
    return () => {
      unsub();
    };
  }, [currentUser, officeId]);

  return (
    <>
      <QueueConfirmationDialog
        onClose={() => setOpenDialog(false)}
        open={openDialog}
        organization={organization}
        window={window}
        officeId={officeId}
        queueNumber={queueNumber}
        isRemove={inQueue}
      />
      <Box
        p="16px"
        boxShadow={2}
        display="flex"
        flexDirection="column"
        gap="8px"
        borderRadius="16px"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            {organization}
          </Typography>
          <Typography variant="h6" color="gray">
            {window}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          textAlign="center"
          alignItems="center"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold" variant="h6">
              People in Queue
            </Typography>
            <Typography variant="h6">{peopleInQueue}</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold" variant="h6">
              Your Queue Number
            </Typography>
            <Typography variant="h6">
              {queueNumber === 0 ? "Not In Queue" : queueNumber}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color={inQueue ? "warning" : "primary"}
          fullWidth
          size="large"
          disableElevation
          onClick={() => setOpenDialog(true)}
        >
          {inQueue ? "Already In Queue" : "Go In Queue"}
        </Button>
      </Box>
    </>
  );
};

export default Queue;
