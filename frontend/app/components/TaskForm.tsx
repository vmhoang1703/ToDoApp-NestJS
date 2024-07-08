"use client";

import { useState } from "react";
import { TextField, Button } from "@mui/material";
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
    <>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addTask()}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={addTask}
        style={{ marginTop: "10px" }}
      >
        Add Task
      </Button>
    </>
  );
};

export default TaskForm;
