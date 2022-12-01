import { Box, Container } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import CustomAppBar from "../components/Appbar";
import useAuth from "../hooks/useAuth";

const UserLayout = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
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
