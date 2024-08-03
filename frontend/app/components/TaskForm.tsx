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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const userId = localStorage.getItem("user_id");

  const addTask = async () => {
    const taskTitle = newTaskTitle.trim();
    const taskDescription = newTaskDescription.trim();
    if (!taskTitle) return;

    try {
      await axios.post(API_URL, {
        userId: userId,
        title: taskTitle,
        description: taskDescription,
        isCompleted: false,
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
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
        id="task-title"
        label="Title"
        variant="outlined"
        fullWidth
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 2 }}
      />
      <TextField
        id="task-description"
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
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
