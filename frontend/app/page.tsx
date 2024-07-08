import { Box, Container, Typography } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Image from "next/image";
import MainBar from "./components/MainBar";

export default function Home() {
  return (
    <div>
      <MainBar />
      <Container maxWidth="sm" sx={{ marginTop: 15 }}>
        <TaskForm />
        <TaskList />
      </Container>
    </div>
  );
}
