"use client";

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Button,
  Badge,
} from "@mui/material";
import Image from "next/image";
import { FC, MouseEvent, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
// import { io } from "socket.io-client";

interface MainBarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MainBar: FC<MainBarProps> = ({ isLoggedIn, onLogout }) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  // const userId = localStorage.getItem("user_id");

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    onLogout();
  };

  const navButtons = [
    { text: "Sign Up", route: "/register" },
    { text: "Sign In", route: "/login" },
  ];

  // const [notification, setNotification] = useState(null);

  // useEffect(() => {
  //   const socket = io("http://localhost:3000", {
  //     transports: ["websocket"],
  //     path: "/socket.io",
  //   });
  //   socket.on("connect", () => {
  //     console.log("Connected to WebSocket server");
  //   });
  //   socket.on("deadline_notification", (data) => {
  //     console.log("Notification received:", data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [userId]);

  return (
    <AppBar sx={{ backgroundColor: "#fff" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link href={"/"}>
              <Image
                src="/logo.png"
                alt="Todo App Logo"
                width={60}
                height={50}
                priority
              />
            </Link>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                ml: 2,
                display: { xs: "flex", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "#000",
                textDecoration: "none",
              }}
            >
              TODO APP
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          {!isLoggedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              {navButtons.map((button, index) => (
                <Button key={index} sx={{ color: "#000" }}>
                  <Link
                    href={button.route}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    {button.text}
                  </Link>
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="primary"
                  sx={{ mr: 5 }}
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" src="/user.png" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Link
                      href={"/profile"}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <Typography textAlign="center">Profile</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" sx={{ color: "#000" }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainBar;
