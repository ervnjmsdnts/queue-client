import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";

const QueueList = () => {
  const [office, setOffice] = useState({});
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "offices", currentUser.id), (snapshot) => {
      setOffice(snapshot.data());
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (!loading) {
      const peopleInQueue = office.peopleInQueue.map((person, index) => {
        return {
          id: person.id,
          queueNumber: person.queueNumber,
          queuer: `${person.displayName} (${person.id.slice(0, 6)})`,
          attendance: person.attendance,
          isDone: person.isDone,
        };
      });

      setRows(peopleInQueue.sort((a, b) => a.queueNumber - b.queueNumber));
    }
  }, [loading, office.peopleInQueue]);

  const attendedQueue = rows?.filter(
    (row) => row.attendance === true && row.isDone === false
  );

  const nextQueuer = useCallback(async () => {
    const queuer = office?.peopleInQueue?.find(
      (q) => q.id === attendedQueue[0].id
    );
    await updateDoc(doc(db, "offices", currentUser.id), {
      peopleInQueue: arrayRemove({ ...queuer }),
    });
    await updateDoc(doc(db, "offices", currentUser.id), {
      peopleInQueue: arrayUnion({ ...queuer, isDone: true }),
    });
  }, [attendedQueue, currentUser.id]);

  const columns = [
    { field: "id", headerName: "ID", width: 200, hide: true },
    {
      field: "queueNumber",
      headerName: "Queue Number",
      flex: 1,
      align: "center",
    },
    {
      field: "queuer",
      headerName: "Queuer",
      flex: 1,
      align: "center",
    },
  ];

  const theme = useTheme();

  if (loading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box height="400px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb="8px"
        >
          <Typography variant="h4" fontWeight="bold">
            {office.name} {office.window}
          </Typography>
          <Button variant="contained" LinkComponent={Link} to="scan">
            Scan QR
          </Button>
        </Box>
        <Box
          height="500px"
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              height: "100%",
              flex: 1,
              "& .attended": {
                backgroundColor: theme.palette.success.main,
                color: "white",
              },
              "& .notAttended": {
                backgroundColor: theme.palette.error.main,
                color: "white",
              },
              "& .doneQueue": {
                backgroundColor: theme.palette.warning.main,
                color: "white",
              },
            }}
          >
            <DataGrid
              columns={columns}
              rows={rows}
              pageSize={10}
              getRowClassName={(params) => {
                return params.row.isDone
                  ? "doneQueue"
                  : params.row.attendance
                  ? "attended"
                  : "notAttended";
              }}
            />
          </Box>
          <Box flex={1} display="flex" justifyContent="center">
            {attendedQueue.length === 0 ? (
              <Typography variant="h4" fontWeight="bold" textAlign="center">
                No one in queue has attended
              </Typography>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="8px"
              >
                <Typography textAlign="center" variant="h4" fontWeight="bold">
                  Next In Queue
                </Typography>
                <Typography textAlign="center" variant="h5">
                  {attendedQueue[0].queuer}
                </Typography>
                <Button onClick={nextQueuer} variant="contained">
                  Next
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default QueueList;
