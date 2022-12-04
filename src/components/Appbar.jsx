import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useEffect, useMemo, useState } from "react";
import { AppBar, Divider } from "@mui/material";
import useAuth from "../hooks/useAuth";
import QRCode from "qrcode";
import Logo from "../assets/queuerlogo.png";
import QRDialog from "./QRDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { Notifications } from "@mui/icons-material";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const pages = ["How to use", "About"];

const CustomAppBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [QRSrc, setQRSrc] = useState("");

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser) {
      QRCode.toDataURL(`${JSON.stringify({ ...currentUser })}`).then(setQRSrc);
    }
  }, [currentUser]);

  useEffect(() => {
    const ref = collection(db, "notifications");
    const q = query(ref, where("userId", "==", currentUser.id));
    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message,
        }))
      );
    });

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const removeNotif = async (notifId) => {
    await deleteDoc(doc(db, "notifications", notifId));
    handleCloseNotif();
  };

  const handleOpenNotif = (event) => {
    setAnchorNotif(event.currentTarget);
  };

  const handleCloseNotif = (even) => {
    setAnchorNotif(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userInitials = useMemo(
    () =>
      currentUser.displayName
        .split(" ")
        .map((initial) => initial[0])
        .join(""),
    [currentUser]
  );

  return (
    <>
      <ChangePasswordDialog
        onClose={() => setOpenChangePasswordDialog(false)}
        open={openChangePasswordDialog}
      />
      <QRDialog
        onClose={() => setOpenQRDialog(false)}
        open={openQRDialog}
        QRSrc={QRSrc}
      />
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component="img"
              src={Logo}
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                width: "32px",
                height: "32px",
              }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box
              component="img"
              src={Logo}
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
                width: "32px",
                height: "32px",
              }}
            />
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <IconButton
                onClick={notifications.length !== 0 ? handleOpenNotif : null}
                sx={{ position: "relative" }}
              >
                <Notifications />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "999px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>{notifications?.length}</Typography>
                </Box>
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{userInitials}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorNotif}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorNotif)}
                onClose={handleCloseNotif}
              >
                {notifications?.map((notif) => (
                  <MenuItem onClick={() => removeNotif(notif.id)}>
                    {notif.message}
                  </MenuItem>
                ))}
              </Menu>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    gap="16px"
                    px="16px"
                    py="8px"
                  >
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(2, 1fr)"
                      maxWidth="300px"
                      gap="8px"
                    >
                      <Typography fontWeight="bold">Name</Typography>
                      <Typography>{currentUser.displayName}</Typography>
                      <Typography fontWeight="bold">ID</Typography>
                      <Typography>{currentUser.id.slice(0, 6)}</Typography>
                      <Typography fontWeight="bold">Email</Typography>
                      <Typography>{currentUser.email}</Typography>
                    </Box>
                    <Box
                      onClick={() => setOpenQRDialog(true)}
                      component="img"
                      alt="qrcode"
                      src={QRSrc}
                      width="64px"
                      sx={{ cursor: "pointer" }}
                      height="64px"
                      backgroundColor="primary.main"
                    />
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => setOpenChangePasswordDialog(true)}>
                    <Typography>Change Password</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography>Log out</Typography>
                  </MenuItem>
                </Box>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default CustomAppBar;
