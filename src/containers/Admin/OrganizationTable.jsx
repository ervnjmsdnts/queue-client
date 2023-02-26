import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddOrganizationDialog from "./AddOrganizationDialog";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
import { useEditOrganization } from "./actions";
import { toast } from "react-toastify";
import moment from "moment";

const OrganizationTable = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [offices, setOffices] = useState([]);
  const [rows, setRows] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "name",
      headerName: "Organization Name",
      flex: 1,
      editable: true,
    },
    {
      field: "windows",
      headerName: "Number of Window Offices",
      flex: 1,
    },
    {
      field: "time",
      headerName: "Time",
      renderCell: (params) =>
        `${moment(params.row.openingTime).format("hh:mm A")} - ${moment(
          params.row.closingTime
        ).format("hh:mm A")}`,
      flex: 1,
    },
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "organizations"), (snapshot) => {
      setOrganizations(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "offices"), (snapshot) => {
      setOffices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (organizations && offices) {
      setRows(
        organizations.map((org) => {
          const office = offices.filter((office) => office.orgId === org.id);
          return {
            windows: office.length,
            ...org,
          };
        })
      );
    }
  }, [organizations, offices]);

  const { data, error, execute } = useEditOrganization();

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
      <AddOrganizationDialog
        onClose={() => setOpenAddDialog(false)}
        open={openAddDialog}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="8px"
      >
        <Typography variant="h4" fontWeight="bold">
          Organization
        </Typography>
        <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
          Add Organization
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

export default OrganizationTable;
