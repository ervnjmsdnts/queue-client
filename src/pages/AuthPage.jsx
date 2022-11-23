import { Box, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import LoginForm from "../containers/Auth/LoginForm";
import RegisterForm from "../containers/Auth/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const matches = useMediaQuery("(min-width: 600px)");

  const showRegisterForm = () => setIsLogin(false);
  const showLoginForm = () => setIsLogin(true);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          width: matches ? "60%" : "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            marginX: "16px",
            borderRadius: "16px",
            padding: "16px",
          }}
        >
          {isLogin ? (
            <LoginForm changeForm={showRegisterForm} />
          ) : (
            <RegisterForm changeForm={showLoginForm} />
          )}
        </Box>
      </Box>
      {matches && (
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          backgroundColor="primary.main"
          alignItems="center"
        >
          <Typography variant="h2" color="white" fontWeight="bold">
            Welcome to QueueR
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AuthPage;
