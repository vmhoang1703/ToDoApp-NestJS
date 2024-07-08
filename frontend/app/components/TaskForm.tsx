"use client";

import { useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

const TaskForm = () => {
  const [newTask, setNewTask] = useState("");

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(API_URL, { title: newTask, isCompleted: false });
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
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
        onKeyPress={(e) => e.key === "Enter" && addTask()}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addTask}
        style={styles.button}
      >
        Add Task
      </Button>
    </Container>
  );
};

const styles = {
  button: {
    marginTop: "10px",
  },
};

export default TaskForm;
