import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

const StaffAppbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography>
            {currentUser?.role === "admin" ? "Admin" : "Office"}
          </Typography>
          <Button onClick={handleLogout} color="inherit">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default StaffAppbar;
