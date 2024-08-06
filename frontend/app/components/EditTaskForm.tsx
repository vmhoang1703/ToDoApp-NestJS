"use client";

import { FC, useState, KeyboardEvent } from "react";
import { TextField, Button, Container, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

const API_URL = "http://localhost:3000/task";

interface EditTaskFormProps {
  taskId: string;
  title: string;
  description: string;
  status: string;
  deadline?: string;
  handleClose: () => void;
  fetchTasks: () => void;
}

const EditTaskForm: FC<EditTaskFormProps> = ({
  taskId,
  title,
  description,
  status,
  deadline,
  handleClose,
  fetchTasks,
}) => {
  const [updateTaskTitle, setUpdateTaskTitle] = useState(title);
  const [updateTaskDescription, setUpdateTaskDescription] =
    useState(description);
  const [updateTaskDeadline, setUpdateTaskDeadline] = useState<Dayjs | null>(
    deadline ? dayjs(deadline) : null
  );
  const userId = localStorage.getItem("user_id");

  const updateTask = async () => {
    const updateTitle = updateTaskTitle.trim();
    const updateDescription = updateTaskDescription.trim();

    try {
      await axios.put(`${API_URL}/${taskId}`, {
        userId: userId,
        title: updateTitle,
        description: updateDescription,
        status: status,
        deadline: updateTaskDeadline ? updateTaskDeadline.toISOString() : null,
      });
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") updateTask();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ marginBottom: "25px" }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
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
        <DateTimePicker
          label="Deadline"
          value={updateTaskDeadline}
          onChange={(newValue) => setUpdateTaskDeadline(newValue)}
          sx={{ mb: 2, width: "100%" }}
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
    </LocalizationProvider>
  );
};

export default EditTaskForm;
