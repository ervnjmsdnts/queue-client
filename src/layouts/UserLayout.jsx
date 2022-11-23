import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import CustomAppBar from "../components/Appbar";

const UserLayout = ({ children }) => {
  return (
    <>
      <CustomAppBar />
      <Box px="32px" py="16px">
        {children ? children : <Outlet />}
      </Box>
    </>
  );
};

export default UserLayout;
