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
import QRDialog from "./QRDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";

const pages = ["How to use", "About"];

const CustomAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
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

  const handleLogout = () => {
    logout();
    window.location.reload();
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
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/user"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>

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
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
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

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{userInitials}</Avatar>
                </IconButton>
              </Tooltip>
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
