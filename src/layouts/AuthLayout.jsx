import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return <Box>{children ? children : <Outlet />}</Box>;
};

export default AuthLayout;
