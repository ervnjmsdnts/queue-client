import { Box, Container } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import StaffAppbar from "../components/StaffAppbar";
import useAuth from "../hooks/useAuth";

const StaffLayout = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
  return (
    <>
      <StaffAppbar />
      <Container maxWidth="xl">
        <Box py="32px">{children ? children : <Outlet />}</Box>
      </Container>
    </>
  );
};

export default StaffLayout;
