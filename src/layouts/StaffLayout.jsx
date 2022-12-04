import { Box, Container } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StaffAppbar from "../components/StaffAppbar";
import useAuth from "../hooks/useAuth";

const StaffLayout = ({ children }) => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return navigate("/");
    if (currentUser && currentUser.role === "user") return navigate("/user");
    if (currentUser && currentUser.role === "office")
      return navigate("/office");
    if (currentUser && currentUser.role === "admin") return navigate("/admin");
  }, [currentUser]);
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
