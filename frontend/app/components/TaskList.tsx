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
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../interfaces/Task";
import { useRouter } from "next/navigation";
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

      const newColumns = {
        todo: {
          ...columns.todo,
          tasks: data.filter((task: Task) => !task.isCompleted),
        },
        inProgress: { ...columns.inProgress, tasks: [] },
        done: {
          ...columns.done,
          tasks: data.filter((task: Task) => task.isCompleted),
        },
      };
      setColumns(newColumns);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const toggleTask = async (id: string, isCompleted: boolean) => {
    try {
      await axios.put(`${API_URL}/${id}`, { isCompleted: !isCompleted });
      const updatedColumns = { ...columns };
      const sourceColumn = isCompleted ? "done" : "todo";
      const destColumn = isCompleted ? "todo" : "done";

      const taskIndex = updatedColumns[sourceColumn].tasks.findIndex(
        (task) => task._id === id
      );
      const [task] = updatedColumns[sourceColumn].tasks.splice(taskIndex, 1);
      task.isCompleted = !isCompleted;
      updatedColumns[destColumn].tasks.push(task);

      setColumns(updatedColumns);
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
      movedTask.isCompleted = destination.droppableId === "done";
      axios
        .put(`${API_URL}/${movedTask._id}`, {
          isCompleted: movedTask.isCompleted,
        })
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
                  column.id == "todo"
                    ? "#ffcccb"
                    : column.id == "inProgress"
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
                              <Typography
                                variant="body1"
                                sx={{
                                  textDecoration: task.isCompleted
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                {task.title}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Checkbox
                                checked={task.isCompleted}
                                onChange={() =>
                                  toggleTask(task._id, task.isCompleted)
                                }
                              />
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
