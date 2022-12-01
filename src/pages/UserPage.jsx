import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Queue from "../containers/User/Queue";
import { db } from "../firebase";

const UserPage = () => {
  const matches = useMediaQuery("(min-width: 600px)");
  const [organizations, setOrganizations] = useState([]);
  const [offices, setOffices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [loadingOff, setLoadingOff] = useState(true);

  const { register, watch, setValue } = useForm();

  const selectedOrg = watch("selectedOrg");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "organizations"), (snapshot) => {
      setOrganizations(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setValue("selectedOrg", snapshot.docs[0].id);
      setLoadingOrg(false);
    });

    return () => {
      unsub();
    };
  }, [setValue]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "offices"), (snapshot) => {
      setOffices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    setLoadingOff(false);

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (organizations && offices) {
        setQueues(offices.filter((office) => office.orgId === selectedOrg));
      }
    })();
  }, [offices, selectedOrg, organizations]);

  if (loadingOrg || loadingOff) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        mb="16px"
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <FormControl sx={{ minWidth: matches ? "200px" : "100%" }} size="small">
          <InputLabel id="label">Organization</InputLabel>
          <Select
            label="Organization"
            labelId="label"
            defaultValue={organizations[0].id}
            {...register("selectedOrg")}
          >
            {organizations.map((organization) => (
              <MenuItem key={organization.id} value={organization.id}>
                {organization.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        display="grid"
        gap="24px"
        gridTemplateColumns={!matches ? "repeat(1, 1fr)" : "repeat(4, 1fr)"}
      >
        {queues.map((queue) => (
          <Queue
            organization={queue.name}
            key={queue.id}
            window={queue.window}
            officeId={queue.id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserPage;
