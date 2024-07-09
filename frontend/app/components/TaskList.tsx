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

  const deleteTask = async (_id: string) => {
    try {
      await axios.delete(`${API_URL}/${_id}`);
      setTasks(tasks.filter((task) => task._id !== _id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <List>
      <Container maxWidth="xl">
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
                style={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                }}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </Container>
    </List>
  );
};

export default TaskList;
