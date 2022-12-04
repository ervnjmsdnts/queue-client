import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import { useChangePassword } from "./actions";
import { changePasswordSchema } from "./schema";

const FieldError = ({ errors }) => {
  return (
    <Typography
      fontSize="14px"
      fontWeight="bold"
      pl="10px"
      mt="2px"
      color={red["300"]}
    >
      {errors.message}
    </Typography>
  );
};

const ChangePasswordDialog = ({ onClose, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(changePasswordSchema) });
  const [oldPassword, setOldPassword] = useState("");

  const { data, error, isValidating, execute } = useChangePassword();

  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      const unsub = await getDoc(doc(db, "users", currentUser.id));

      setOldPassword(unsub.data().password);

      return () => {
        unsub();
      };
    })();
  }, [currentUser.id]);

  const onSubmit = useCallback(
    async (data) => {
      if (oldPassword !== data.oldPassword)
        return toast.error("Incorrect Old Password");
      await execute({ password: data.newPassword }, currentUser.id);
    },
    [execute, currentUser, oldPassword]
  );

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Updated Password");
      return onClose();
    })();
  }, [data, error]);

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
          Change Password
        </Typography>
        <Box>
          <TextField
            label="Old Password"
            fullWidth
            {...register("oldPassword")}
            type="password"
          />
          {errors.oldPassword ? (
            <FieldError errors={errors.oldPassword} />
          ) : null}
        </Box>
        <Box>
          <TextField
            label="New Password"
            fullWidth
            {...register("newPassword")}
            type="password"
          />
          {errors.newPassword ? (
            <FieldError errors={errors.newPassword} />
          ) : null}
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Confirm New Password"
            {...register("confirmNewPassword")}
            type="password"
          />
          {errors.confirmNewPassword ? (
            <FieldError errors={errors.confirmNewPassword} />
          ) : null}
        </Box>
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

export default ChangePasswordDialog;
