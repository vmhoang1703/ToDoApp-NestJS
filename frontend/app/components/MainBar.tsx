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
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

interface MainBarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MainBar = ({ isLoggedIn, onLogout }: MainBarProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const route = useRouter();

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

  const handleProfile = () => {
    route.push("/profile");
  };

  const navButtons = [
    { text: "Sign Up", route: "/register" },
    { text: "Sign In", route: "/login" },
  ];

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
            <Button onClick={() => route.push("/")}>
              <Image
                src="/logo.png"
                alt="Todo App Logo"
                width={60}
                height={50}
                priority
              />
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
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          {!isLoggedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              {navButtons.map((button, index) => (
                <Button
                  key={index}
                  sx={{ color: "#000" }}
                  onClick={() => route.push(button.route)}
                >
                  {button.text}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
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
                <MenuItem onClick={handleProfile}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MainBar;
