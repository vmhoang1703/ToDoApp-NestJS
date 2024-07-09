"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Task from "../interfaces/Task";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3000/tasks";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const route = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleTask = async (id: string, isCompleted: boolean) => {
    try {
      await axios.put(`${API_URL}/${id}`, { isCompleted: !isCompleted });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, isCompleted: !isCompleted } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <List>
        {tasks.map((task) => (
          <div key={task._id}>
            <ListItem
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTask(task._id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox
                checked={task.isCompleted}
                onChange={() => toggleTask(task._id, task.isCompleted)}
              />
              <ListItemText
                primary={task.title}
                sx={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                }}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Container>
  );
};

export default TaskList;
