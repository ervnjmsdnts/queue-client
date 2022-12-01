import { Box, Button, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import AddOrganizationDialog from "./AddOrganizationDialog";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
import { useEditOrganization } from "./actions";
import { toast } from "react-toastify";

const ShowOrganizationDetails = ({ orgId }) => {
  return (
    <IconButton LinkComponent={Link} to={`organization/${orgId}`}>
      <OpenInNewOutlinedIcon />
    </IconButton>
  );
};

const OrganizationTable = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [offices, setOffices] = useState([]);
  const [rows, setRows] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: "Organization Name",
      width: 300,
      editable: true,
    },
    {
      field: "windows",
      headerName: "Number of Window Offices",
      width: 200,
      align: "center",
    },
    {
      headerName: "",
      renderCell: (params) => <ShowOrganizationDetails orgId={params.id} />,
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 150,
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
