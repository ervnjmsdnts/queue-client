import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import useAuth from "../../hooks/useAuth";
import { useEditOffice } from "./actions";
import AddOfficeDialog from "./AddOfficeDialog";

const OfficeTable = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "name",
      headerName: "Office Name",
      editable: true,
      flex: 1,
    },
    {
      field: "window",
      headerName: "Window",
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "clientDuration",
      headerName: "Client Duration",
      renderCell: (params) => `${params.formattedValue} minutes`,
      flex: 1,
    },
  ];

  const { currentUser } = useAuth();

  const { id: orgId } = currentUser;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "offices"), (snapshot) => {
      setRows(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((doc) => doc.orgId === orgId)
      );
    });

    return () => {
      unsub();
    };
  }, [orgId]);

  const { data, error, execute } = useEditOffice();

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Saved");
    })();
  }, [data, error]);

  const cellEditCommit = useCallback(
    async (params) => {
      await execute({ [params.field]: params.value }, params.id);
    },
    [execute]
  );

  return (
    <>
      <AddOfficeDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="8px"
      >
        <Typography variant="h4" fontWeight="bold">
          List of Office
        </Typography>
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          Add Office
        </Button>
      </Box>
      <Box height="500px">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          onCellEditCommit={cellEditCommit}
        />
      </Box>
    </>
  );
};

export default OfficeTable;
