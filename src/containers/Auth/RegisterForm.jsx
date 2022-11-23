import { Box, Button, Link, Stack, Typography } from "@mui/material";
import AuthInput from "./AuthInput";

const RegisterForm = ({ changeForm }) => {
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
          <AuthInput label="First Name" />
          <AuthInput label="Last Name" />
        </Box>
        <AuthInput label="Email" />
        <AuthInput label="Password" type="password" />
        <AuthInput label="Confirm Password" type="password" />
        <Button variant="contained" fullWidth size="large">
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
