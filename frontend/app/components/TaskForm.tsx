"use client";

import { FC, useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/task";

interface TaskFormProps {
  handleClose: () => void;
  fetchTasks: () => void;
}

const TaskForm: FC<TaskFormProps> = ({ handleClose, fetchTasks }) => {
  const [newTask, setNewTask] = useState("");
  const userId = localStorage.getItem("user_id");

  const addTask = async () => {
    const taskTitle = newTask.trim();
    if (!taskTitle) return;

    try {
      await axios.post(API_URL, {
        userId: userId,
        title: taskTitle,
        isCompleted: false,
      });
      setNewTask("");
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <Container maxWidth="xl" sx={{ marginBottom: "25px" }}>
      <TextField
        id="outlined-basic"
        label="Add a new task"
        variant="outlined"
        fullWidth
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addTask}
        sx={{ marginTop: "10px" }}
      >
        Add
      </Button>
    </Container>
  );
};

export default TaskForm;
