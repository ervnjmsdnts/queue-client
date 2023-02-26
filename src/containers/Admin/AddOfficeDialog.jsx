import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useAddOffice } from "./actions";

const AddOfficeDialog = ({ onClose, open }) => {
  const { register, handleSubmit, control } = useForm();

  const { data, error, isValidating, execute } = useAddOffice();

  const { currentUser } = useAuth();
  const { id: orgId } = currentUser;

  const onSubmit = useCallback(
    async (data) => {
      await execute({ ...data, orgId, peopleInQueue: [] });
    },
    [execute, orgId]
  );

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error(error);

      toast.success("Added office");
      onClose();
    })();
  }, [data, error]);

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
          Add Office
        </Typography>
        <Typography color="gray">
          Please fill in the information below
        </Typography>
        <TextField label="Office Name" {...register("name")} />
        <TextField label="Window Number" {...register("window")} />
        <TextField label="Email" {...register("email")} />
        <TextField label="Password" {...register("password")} type="password" />
        <Controller
          control={control}
          name="clientDuration"
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth>
              <InputLabel id="clientDuration">Client Duration</InputLabel>
              <Select
                labelId="clientDuration"
                label="Client Duration"
                value={value}
                onChange={onChange}
              >
                <MenuItem value="5">5 Minutes</MenuItem>
                <MenuItem value="10">10 Minutes</MenuItem>
                <MenuItem value="15">15 Minutes</MenuItem>
                <MenuItem value="20">20 Minutes</MenuItem>
                <MenuItem value="25">25 Minutes</MenuItem>
                <MenuItem value="30">30 Minutes</MenuItem>
              </Select>
            </FormControl>
          )}
        />
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

export default AddOfficeDialog;
