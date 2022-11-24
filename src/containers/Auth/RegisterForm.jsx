import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import AuthInput from "./AuthInput";
import { useRegister } from "./actions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "./schemas";

const RegisterForm = ({ changeForm }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const { execute, error, isValidating, data } = useRegister();

  const onSubmit = async (data) => {
    await execute({ ...data });
  };

  useEffect(() => {
    (() => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Successfully registered");
      window.location.reload();
    })();
  }, [data, error]);

  return (
    <Stack gap="8px" width="100%">
      <Typography fontWeight="bold" mb="16px" variant="h4">
        Register
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="16px"
      >
        <Box display="flex" width="100%" gap="16px">
          <AuthInput
            label="First Name"
            {...register("firstName")}
            errors={errors.firstName}
          />
          <AuthInput
            label="Last Name"
            {...register("lastName")}
            errors={errors.lastName}
          />
        </Box>
        <AuthInput label="Email" {...register("email")} errors={errors.email} />
        <AuthInput
          label="Password"
          type="password"
          {...register("password")}
          errors={errors.password}
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          errors={errors.confirmPassword}
        />
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit(onSubmit)}
          disabled={isValidating}
        >
          Register
        </Button>
        <Typography>
          Already have an account?{" "}
          <Link onClick={changeForm} sx={{ cursor: "pointer" }}>
            Log in
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
};

export default RegisterForm;
