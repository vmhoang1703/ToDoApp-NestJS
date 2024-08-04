"use client";

import { FC, useState, KeyboardEvent } from "react";
import { TextField, Button, Container } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/task";

interface EditTaskFormProps {
  taskId: string;
  title: string;
  description: string;
  status: string;
  handleClose: () => void;
  fetchTasks: () => void;
}

const EditTaskForm: FC<EditTaskFormProps> = ({
  taskId,
  title,
  description,
  status,
  handleClose,
  fetchTasks,
}) => {
  const [updateTaskTitle, setUpdateTaskTitle] = useState(title);
  const [updateTaskDescription, setUpdateTaskDescription] =
    useState(description);
  const userId = localStorage.getItem("user_id");

  const updateTask = async () => {
    const updateTitle = updateTaskTitle.trim();
    const updateDescription = updateTaskDescription.trim();

    console.log(updateTitle, updateDescription);

    try {
      await axios.put(`${API_URL}/${taskId}`, {
        userId: userId,
        title: updateTaskTitle,
        description: updateTaskDescription,
        status: status,
      });
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") updateTask();
  };

  return (
    <Container maxWidth="xl" sx={{ marginBottom: "25px" }}>
      <TextField
        id="task-title"
        label="Title"
        variant="outlined"
        fullWidth
        value={updateTaskTitle}
        onChange={(e) => setUpdateTaskTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ mb: 2 }}
      />
      <TextField
        id="task-description"
        label="Description"
        variant="outlined"
        fullWidth
        multiline
        rows={10}
        value={updateTaskDescription}
        onChange={(e) => setUpdateTaskDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={updateTask}
        sx={{ marginTop: "10px" }}
      >
        Save Changes
      </Button>
    </Container>
  );
};

export default EditTaskForm;
