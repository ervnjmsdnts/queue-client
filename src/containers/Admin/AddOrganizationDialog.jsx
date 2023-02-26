import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddOrganization } from "./actions";

const AddOrganizationDialog = ({ onClose, open }) => {
  const { register, handleSubmit } = useForm();

  const [openingTime, setOpeningTime] = useState(null);
  const [closingTime, setClosingTime] = useState(null);

  const { data, error, isValidating, execute } = useAddOrganization();

  const onSubmit = useCallback(
    async (data) => {
      const payload = {
        ...data,
        openingTime: Number(moment(openingTime).format("x")),
        closingTime: Number(moment(closingTime).format("x")),
      };
      await execute({ ...payload });
    },
    [execute, openingTime, closingTime]
  );

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Added organization");
      onClose();
    })();
  }, [data, error, onClose]);

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        p="16px"
        minWidth="500px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="h6" fontWeight="bold">
          Add Organization
        </Typography>
        <Typography color="gray">
          Please fill in the information below
        </Typography>
        <TextField label="Organization Name" {...register("name")} />
        <TextField label="Email Address" {...register("email")} />
        <TextField label="Password" {...register("password")} />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Stack gap="8px" direction="row">
            <TimePicker
              label="Opening Time"
              value={openingTime}
              minutesStep={5}
              onChange={(value) => setOpeningTime(value)}
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              label="Closing Time"
              value={closingTime}
              minutesStep={5}
              onChange={(value) => setClosingTime(value)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
        <Button
          disabled={isValidating}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddOrganizationDialog;
