import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import LogoutDialog from "./LogoutDialog";

const StaffAppbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <>
      <LogoutDialog onClose={() => setOpen(false)} open={open} />
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
              {currentUser?.role === "admin"
                ? "Admin"
                : currentUser?.role === "organization"
                ? `Organization (${currentUser?.displayName})`
                : "Office"}
            </Typography>
            <Button onClick={() => setOpen(true)} color="inherit">
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default StaffAppbar;
