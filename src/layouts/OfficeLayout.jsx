import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import StaffAppbar from "../components/StaffAppbar";

const OfficeLayout = ({ children }) => {
  return (
    <>
      <StaffAppbar />
      <Container maxWidth="xl">
        <Box py="32px">{children ? children : <Outlet />}</Box>
      </Container>
    </>
  );
};

export default OfficeLayout;
