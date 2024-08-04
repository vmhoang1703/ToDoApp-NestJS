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
  Dialog,
  DialogTitle,
  DialogContent,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../interfaces/Task";
import AddButton from "./AddButton";
import CloseIcon from "@mui/icons-material/Close";
import LongDescription from "./LongDescription";
import EditTaskForm from "./EditTaskForm";

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

  const deleteTask = async (id: string, columnId: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedColumns = { ...columns };
      updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.filter(
        (task) => task._id !== id
      );
      setColumns(updatedColumns);
      handleClose();
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

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openEditForm, setOpenEditForm] = useState(false);

  const handleClickOpenEditForm = () => {
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  return (
    <>
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
                          <>
                            <Card
                              onClick={handleClickOpen}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 2 }}
                            >
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {task.title}
                                </Typography>
                                <Typography variant="body1">
                                  <LongDescription
                                    content={task.description}
                                    limit={70}
                                  />
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "end",
                                    width: "100%",
                                    mx: 2,
                                  }}
                                >
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteTask(task._id, column.id);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: "#FF6666" }} />
                                  </IconButton>
                                </Box>
                              </CardActions>
                            </Card>
                            <BootstrapDialog
                              onClose={handleClose}
                              aria-labelledby="customized-dialog-title"
                              open={open}
                            >
                              <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                              >
                                {task.title}
                              </DialogTitle>
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
                              <DialogContent dividers sx={{ mx: 1 }}>
                                <Typography gutterBottom>
                                  {task.description}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <>
                                    <IconButton
                                      edge="start"
                                      aria-label="edit"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleClickOpenEditForm();
                                      }}
                                    >
                                      <EditIcon sx={{ color: "#3399ff" }} />
                                    </IconButton>
                                    <Dialog
                                      open={openEditForm}
                                      onClose={handleCloseEditForm}
                                    >
                                      <DialogTitle>Edit Task</DialogTitle>
                                      <EditTaskForm
                                        title={task.title}
                                        description={task.description}
                                        status={task.status}
                                        handleClose={handleCloseEditForm}
                                        fetchTasks={fetchTasks}
                                      />
                                    </Dialog>
                                  </>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      deleteTask(task._id, column.id);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: "#FF6666" }} />
                                  </IconButton>
                                </Box>
                              </DialogContent>
                            </BootstrapDialog>
                          </>
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
      <AddButton fetchTasks={fetchTasks} />
    </>
  );
};

export default TaskList;
