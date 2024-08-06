"use client";

import { FC, useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import axios from "axios";

const API_URL = "http://localhost:3000/task";

interface TaskFormProps {
  handleClose: () => void;
  fetchTasks: () => void;
}

const TaskForm: FC<TaskFormProps> = ({ handleClose, fetchTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const userId = localStorage.getItem("user_id");

  const addTask = async () => {
    const taskTitle = newTaskTitle.trim();
    const taskDescription = newTaskDescription.trim();
    if (!taskTitle || !deadline) return;

    try {
      await axios.post(API_URL, {
        userId: userId,
        title: taskTitle,
        description: taskDescription,
        deadline: deadline.toISOString(),
        isCompleted: false,
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setDeadline(null);
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          rows={10}
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <DateTimePicker
          label="Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          sx={{ mb: 2, width: "100%" }}
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
    </LocalizationProvider>
  );
};

export default TaskForm;
