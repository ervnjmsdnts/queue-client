import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddOrganization } from "./actions";

const AddOrganizationDialog = ({ onClose, open }) => {
  const { register, handleSubmit } = useForm();

  const { data, error, isValidating, execute } = useAddOrganization();

  const onSubmit = useCallback(
    async (data) => {
      await execute({ ...data });
    },
    [execute]
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
        width="300px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="h6" fontWeight="bold">
          Add Organization
        </Typography>
        <TextField label="Name" {...register("name")} />
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
