"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../interfaces/Task";
import AddButton from "./AddButton";

const API_URL = "http://localhost:3000/task";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TaskList = () => {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    todo: { id: "todo", title: "Todo", tasks: [] },
    inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  });
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        params: { userId },
      });

      const newColumns = {
        todo: {
          ...columns.todo,
          tasks: data.filter((task: Task) => task.status === "todo"),
        },
        inProgress: {
          ...columns.inProgress,
          tasks: data.filter((task: Task) => task.status === "inProgress"),
        },
        done: {
          ...columns.done,
          tasks: data.filter((task: Task) => task.status === "done"),
        },
      };
      setColumns(newColumns);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTaskStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      const updatedColumns = { ...columns };
      let sourceColumnId: string | null = null;
      let task: Task | null = null;

      for (const columnId in updatedColumns) {
        const taskIndex = updatedColumns[columnId].tasks.findIndex(
          (t) => t._id === id
        );
        if (taskIndex !== -1) {
          [task] = updatedColumns[columnId].tasks.splice(taskIndex, 1);
          sourceColumnId = columnId;
          break;
        }
      }

      if (task && sourceColumnId) {
        task.status = newStatus;
        updatedColumns[newStatus].tasks.push(task);
        setColumns(updatedColumns);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: string, columnId: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedColumns = { ...columns };
      updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.filter(
        (task) => task._id !== id
      );
      setColumns(updatedColumns);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId;
      axios
        .put(`${API_URL}/${movedTask._id}`, { status: movedTask.status })
        .catch((error) => console.error("Error updating task status:", error));
    }

    destColumn.tasks.splice(destination.index, 0, movedTask);
    setColumns({
      ...columns,
      [sourceColumn.id]: sourceColumn,
      [destColumn.id]: destColumn,
    });
  };

  return (
    <>
      <AddButton fetchTasks={fetchTasks} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Container
          maxWidth="xl"
          sx={{ my: 5, display: "flex", justifyContent: "space-between" }}
        >
          {Object.values(columns).map((column) => (
            <Box
              key={column.id}
              width="30%"
              sx={{
                backgroundColor:
                  column.id === "todo"
                    ? "#ffcccb"
                    : column.id === "inProgress"
                      ? "#ffffcc"
                      : "#90EE90",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                {column.title}
              </Typography>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ minHeight: "300px" }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ mb: 2 }}
                          >
                            <CardContent>
                              <Typography variant="body1">
                                {task.title}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Select
                                value={task.status}
                                onChange={(e) =>
                                  updateTaskStatus(task._id, e.target.value)
                                }
                                size="small"
                              >
                                <MenuItem value="todo">Todo</MenuItem>
                                <MenuItem value="inProgress">
                                  In Progress
                                </MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                              </Select>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => deleteTask(task._id, column.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </CardActions>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Container>
      </DragDropContext>
    </>
  );
};

export default TaskList;
