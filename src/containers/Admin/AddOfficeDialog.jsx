import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddOffice } from "./actions";

const AddOfficeDialog = ({ onClose, open }) => {
  const { register, handleSubmit } = useForm();

  const { data, error, isValidating, execute } = useAddOffice();

  const { orgId } = useParams();

  const onSubmit = useCallback(
    async (data) => {
      await execute({ ...data, orgId });
    },
    [execute, orgId]
  );

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Added office");
      onClose();
    })();
  }, [data, error, onClose]);

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        p="16px"
        width="300px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="h6" fontWeight="bold">
          Add Office
        </Typography>
        <TextField label="Office Name" {...register("name")} />
        <TextField label="Window" {...register("window")} />
        <TextField label="Email" {...register("email")} />
        <TextField label="Username" {...register("username")} />
        <TextField label="Password" {...register("password")} type="password" />
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
