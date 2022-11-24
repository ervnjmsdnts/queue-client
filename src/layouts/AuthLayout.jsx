import { Box } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthLayout = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser && currentUser.role === "user")
    return <Navigate to="/user" />;
  if (currentUser && currentUser.role === "office")
    return <Navigate to="/office" />;
  if (currentUser && currentUser.role === "admin")
    return <Navigate to="/admin" />;
  return <Box>{children ? children : <Outlet />}</Box>;
};

export default AuthLayout;
