import { Box, Button, Dialog, Typography } from "@mui/material";
import useAuth from "../hooks/useAuth";

const LogoutDialog = ({ onClose, open }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        p="16px"
        width="300px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="16px"
      >
        <Typography variant="h6" fontWeight="bold">
          Logout
        </Typography>
        <Typography textAlign="center">
          Are you sure you want to logout?
        </Typography>
        <Box
          display="flex"
          gap="16px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button fullWidth variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button fullWidth variant="contained" onClick={handleLogout}>
            Yes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LogoutDialog;
