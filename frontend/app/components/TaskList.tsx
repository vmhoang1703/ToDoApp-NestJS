"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Task from "../interfaces/Task";
import { useRouter } from "next/navigation";
import AddButton from "./AddButton";

const API_URL = "http://localhost:3000/task";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const route = useRouter();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        params: { userId },
      });
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
    <>
      <AddButton fetchTasks={fetchTasks} />
      <Container
        maxWidth="xl"
        sx={{ my: 5, display: "flex", flexDirection: "row" }}
      >
        {tasks.map((task, index) => (
          <Card key={task._id} sx={{ minWidth: 300, mr: 3 }}>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{
                  textDecoration: task.isCompleted ? "line-through" : "none",
                }}
              >
                {++index}. {task.title}
              </Typography>
            </CardContent>
            <CardActions>
              <Checkbox
                checked={task.isCompleted}
                onChange={() => toggleTask(task._id, task.isCompleted)}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteTask(task._id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
        {/* <List>
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
    </List> */}
      </Container>
    </>
  );
};

export default TaskList;
