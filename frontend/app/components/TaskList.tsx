"use client";

import { useState, useEffect } from "react";
import { Checkbox, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

interface Task {
  _id: string;
  title: string;
  isCompleted: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleTask = async (_id: string, isCompleted: boolean) => {
    try {
      await axios.put(`${API_URL}/${_id}`, { isCompleted: !isCompleted });
      setTasks(
        tasks.map((task) =>
          task._id === _id ? { ...task, isCompleted: !isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task._id} disablePadding>
          <Checkbox
            checked={task.isCompleted}
            onChange={() => toggleTask(task._id, task.isCompleted)}
          />
          <ListItemText
            primary={task.title}
            style={{ textDecoration: task.isCompleted ? "line-through" : "none" }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
