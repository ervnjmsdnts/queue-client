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
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import uuid from "react-uuid";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";

const QueueList = () => {
  const [office, setOffice] = useState({});
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    (() => {
      const unsub = onSnapshot(
        doc(db, "offices", currentUser?.id),
        (snapshot) => {
          setOffice(snapshot.data());
          setLoading(false);
        }
      );

      return () => {
        unsub();
      };
    })();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!loading) {
      const peopleInQueue = office.peopleInQueue.map((person) => {
        return {
          id: person.id,
          queuer: person.id.slice(0, 6),
          attendance: person.attendance,
          createdAt: person.createdAt,
        };
      });

      setRows(
        peopleInQueue.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
      );
    }
  }, [loading, office.peopleInQueue]);

  const attendedQueue = rows?.filter((row) => row.attendance === true);

  const sendNotifications = async () => {
    const unsub = onSnapshot(
      doc(db, "offices", currentUser?.id),
      async (snapshot) => {
        const batch = writeBatch(db);
        if (snapshot.data()) {
          for (let i = 0; i < snapshot.data().peopleInQueue.length; i++) {
            const ref = doc(db, "notifications", uuid());
            batch.set(ref, {
              userId: snapshot.data().peopleInQueue[i].id,
              message: `You are near the queue of ${office.name} ${office.window}`,
            });
          }
        }
        await batch.commit();
      }
    );
    return () => {
      unsub();
    };
  };

  const nextQueuer = useCallback(async () => {
    const queuer = office?.peopleInQueue?.find(
      (q) => q.id === attendedQueue[0].id
    );
    await updateDoc(doc(db, "offices", currentUser?.id), {
      peopleInQueue: arrayRemove({ ...queuer }),
    });

    await sendNotifications();
  }, [attendedQueue, currentUser?.id]);

  const columns = [
    { field: "id", headerName: "ID", width: 200, hide: true },
    {
      headerName: "Queue Number",
      flex: 1,
      align: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
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
