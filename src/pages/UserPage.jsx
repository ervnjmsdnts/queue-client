import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Queue from "../containers/User/Queue";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const UserPage = () => {
  const matches = useMediaQuery("(min-width: 600px)");
  const [organizations, setOrganizations] = useState([]);
  const [offices, setOffices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [inAnotherQueue, setInAnotherQueue] = useState(false);
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

  const { currentUser } = useAuth();

  const currentOrg = organizations?.find((org) => org.id === selectedOrg);

  useEffect(() => {
    (async () => {
      if (organizations && offices) {
        const isInQueueArr = offices.map((office) =>
          office.peopleInQueue.some((of) => of.id === currentUser.id)
        );
        const isInQueue = isInQueueArr.some((arr) => arr === true);
        setQueues(offices.filter((office) => office.orgId === selectedOrg));
        setInAnotherQueue(isInQueue);
      }
    })();
  }, [offices, selectedOrg, organizations, currentUser.id]);

  const format = "HH:mm:ss";

  const currentDateTime = moment().valueOf();
  const openTime = moment(currentOrg?.openingTime);
  const closeTime = moment(currentOrg?.closingTime);
  const currentFormattedTime = moment(currentDateTime).format("HH:mm:ss");

  const canQueue =
    currentFormattedTime >= openTime.format(format) &&
    currentFormattedTime <= closeTime.format(format);

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
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography>
          Available Queue Time: {openTime.format("hh:mm A")}{" "}
          {closeTime.format("hh:mm A")}
        </Typography>
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
        alignItems="start"
      >
        {queues.map((queue) => (
          <Queue
            canQueue={canQueue}
            inAnotherQueue={inAnotherQueue}
            organization={queue.name}
            duration={queue.clientDuration}
            key={queue.id}
            window={queue.window}
            officeId={queue.id}
            closeTime={closeTime}
            openTime={moment(openTime).add(1, "hour")}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserPage;
