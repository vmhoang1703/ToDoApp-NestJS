"use client";

import { useState, useEffect } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

interface Task {
  id: string;
  title: string;
  description: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} disablePadding>
          <ListItemText primary={task.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
