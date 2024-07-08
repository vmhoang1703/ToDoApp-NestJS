import { Box, Container, Typography } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Image from "next/image";

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Image
          src={"/logo.jpg"}
          alt={"Todo App Logo"}
          width={120}
          height={100}
          style={{ marginBottom: "10px" }}
          priority
        />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          TODO APP
        </Typography>
      </Box>
      <TaskForm />
      <TaskList />
    </Container>
  );
}
