import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomAppBar from "../components/Appbar";

const UserLayout = ({ children }) => {
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
