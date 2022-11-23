import { Box, Button, Link, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import AuthInput from "./AuthInput";

const LoginForm = ({ changeForm }) => {
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
        <AuthInput label="Email" />
        <AuthInput label="Password" type="password" />
        <Button variant="contained" fullWidth size="large">
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
