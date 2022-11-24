import { Box, CircularProgress, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomAppBar from "../components/Appbar";
import useAuth from "../hooks/useAuth";

const UserLayout = ({ children }) => {
  const { getUser } = useAuth();
  if (getUser) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <CustomAppBar />
      <Container maxWidth="xl">
        <Box py="32px">{children ? children : <Outlet />}</Box>
      </Container>
    </>
  );
};

export default UserLayout;
