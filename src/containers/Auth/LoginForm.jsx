import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import { useLogin } from "./actions";
import AuthInput from "./AuthInput";
import { loginSchema } from "./schemas";

const LoginForm = ({ changeForm }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const { data, execute, isValidating, error } = useLogin();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await execute({ ...data });
  };

  useEffect(() => {
    (async () => {
      if (!data && !error) return;
      if (error) return toast.error("Something went wrong");

      toast.success("Welcome");

      const snap = await getDoc(doc(db, "users", data.uid));

      const snapRes = snap.data();

      if (snapRes.role === "user") return navigate("/user");
      if (snapRes.role === "office") return navigate("/office");
      if (snapRes.role === "admin") return navigate("/admin");
    })();
  }, [data, error, navigate]);

  return (
    <Stack gap="8px" width="100%">
      <Typography fontWeight="bold" mb="16px" variant="h4">
        Login
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="16px"
      >
        <AuthInput label="Email" {...register("email")} errors={errors.email} />
        <AuthInput
          label="Password"
          type="password"
          {...register("password")}
          errors={errors.password}
        />
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit(onSubmit)}
          disabled={isValidating}
        >
          Log in
        </Button>
        <Typography>
          Don&apos;t have an account?{" "}
          <Link onClick={changeForm} sx={{ cursor: "pointer" }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
};

export default LoginForm;
