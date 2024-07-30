"use client";

import { Box, Container, Typography } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Image from "next/image";
import MainBar from "./components/MainBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddButton from "./components/AddButton";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          };

          const response = await axios.get(
            "http://localhost:3000/user",
            {
              headers,
            }
          );

          if (response.status === 200) {
            localStorage.setItem("user_id", response.data.userId);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div>
      <MainBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {isLoggedIn ? (
        <Container maxWidth="xl" sx={{ mt: 12 }}>
          <AddButton />
          <TaskList />
        </Container>
      ) : null}
    </div>
  );
}
