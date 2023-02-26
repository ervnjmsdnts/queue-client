import { Box, Button, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import QueueConfirmationDialog from "./QueueConfirmationDialog";

const Queue = ({
  organization,
  window,
  officeId,
  inAnotherQueue,
  duration,
  canQueue,
  openTime,
  closeTime,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [peopleInQueue, setPeopleInQueue] = useState(0);
  const [queueNumber, setQueueNumber] = useState(0);
  const [personInQueue, setPersonInQueue] = useState(null);

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
      const inQueuePerson = snapshot
        .data()
        .peopleInQueue.find((q) => q.id === currentUser.id);

      setInQueue(isInQueue);
      setPeopleInQueue(peopleInQueue);
      setQueueNumber(queueNumber + 1);
      setPersonInQueue(inQueuePerson);
    });
    return () => {
      unsub();
    };
  }, [currentUser, officeId]);

  const handleOpenDialog = () => {
    if (inQueue) return setOpenDialog(true);
    if (inAnotherQueue) return toast.error("Only limited to 1 queue");
    if (!canQueue) return toast.error("Office closed for the day");
    return setOpenDialog(true);
  };

  return (
    <>
      <QueueConfirmationDialog
        onClose={() => setOpenDialog(false)}
        open={openDialog}
        duration={duration}
        organization={organization}
        window={window}
        officeId={officeId}
        queueNumber={queueNumber}
        isRemove={inQueue}
        openTime={openTime}
        closeTime={closeTime}
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
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          textAlign="center"
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
          {inQueue && personInQueue && (
            <>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold" variant="h6">
                  Appointment Time
                </Typography>
                <Typography variant="h6">
                  {moment(personInQueue.appointmentTime).format("hh:mm A")}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight="bold" variant="h6">
                  Scheduled Time
                </Typography>
                <Typography variant="h6">
                  {moment(personInQueue.scheduledTime).format("hh:mm A")}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        <Button
          variant="contained"
          color={inQueue || !canQueue ? "warning" : "primary"}
          fullWidth
          size="large"
          disableElevation
          onClick={handleOpenDialog}
        >
          {inQueue
            ? "Already In Queue"
            : !canQueue
            ? "Office Closed"
            : "Go In Queue"}
        </Button>
      </Box>
    </>
  );
};

export default Queue;
